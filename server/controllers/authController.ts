import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import OTPVerification from '../models/OTPVerification';
import { sendOTPEmail } from '../services/emailService';

// Generate JWT token
const generateToken = (userId: string): string => {
    const secret = process.env.JWT_SECRET || 'your-default-secret-key';
    return jwt.sign({ userId }, secret, { expiresIn: '30d' });
};

// Generate random OTP
const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Signup controller
export const signup = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role = 'attorney', license } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Generate OTP
        const otpCode = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Delete any existing OTP for this email
        await OTPVerification.deleteMany({ email: email.toLowerCase() });

        // Store pending registration data in OTP record (don't create user yet)
        await OTPVerification.create({
            email: email.toLowerCase(),
            otpCode,
            expiresAt,
            name,
            passwordHash,
            role,
            licenseNumber: license
        });

        // Send OTP via email
        const emailSent = await sendOTPEmail(email, otpCode, name);

        // Log OTP for development (remove in production)
        console.log(`📧 OTP for ${email}: ${otpCode}`);

        if (!emailSent) {
            console.warn(`⚠️ Email delivery failed for ${email}, but OTP is logged above`);
        }

        res.status(201).json({
            success: true,
            message: emailSent
                ? 'Registration initiated. Please check your email for the verification code.'
                : 'Registration initiated. OTP sent (check server logs if email failed).',
            data: {
                email: email.toLowerCase(),
                emailSent
            }
        });

    } catch (error: any) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during signup',
            error: error.message
        });
    }
};

// Verify OTP controller
export const verifyOTP = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required'
            });
        }

        // Find OTP record
        const otpRecord = await OTPVerification.findOne({
            email: email.toLowerCase(),
            otpCode: otp
        });

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        // Check if expired
        if (otpRecord.expiresAt < new Date()) {
            await OTPVerification.deleteOne({ _id: otpRecord._id });
            return res.status(400).json({
                success: false,
                message: 'OTP has expired'
            });
        }

        // Verify OTP has pending registration data
        if (!otpRecord.name || !otpRecord.passwordHash) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP record - missing registration data'
            });
        }

        // Create user from OTP pending data
        const user = await User.create({
            name: otpRecord.name,
            email: email.toLowerCase(),
            passwordHash: otpRecord.passwordHash,
            role: otpRecord.role || 'attorney',
            licenseNumber: otpRecord.licenseNumber,
            isVerified: true  // Mark as verified immediately
        });

        // Delete used OTP
        await OTPVerification.deleteOne({ _id: otpRecord._id });

        // Generate token
        const token = generateToken(user._id.toString());

        res.json({
            success: true,
            message: 'Email verified successfully',
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isVerified: user.isVerified
                }
            }
        });

    } catch (error: any) {
        console.error('Verify OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during verification',
            error: error.message
        });
    }
};

// Resend OTP controller
export const resendOTP = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Find pending OTP record
        const otpRecord = await OTPVerification.findOne({ email: email.toLowerCase() });

        if (!otpRecord) {
            return res.status(404).json({
                success: false,
                message: 'No pending registration found for this email'
            });
        }

        // Generate new OTP
        const otpCode = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Update OTP record
        otpRecord.otpCode = otpCode;
        otpRecord.expiresAt = expiresAt;
        await otpRecord.save();

        // Send OTP via email
        const emailSent = await sendOTPEmail(email, otpCode, otpRecord.name || 'User');

        // Log OTP for development
        console.log(`📧 Resent OTP for ${email}: ${otpCode}`);

        if (!emailSent) {
            console.warn(`⚠️ Email delivery failed for ${email}, but OTP is logged above`);
        }

        res.json({
            success: true,
            message: emailSent
                ? 'New verification code sent to your email'
                : 'New verification code generated (check server logs if email failed)',
            data: {
                emailSent
            }
        });

    } catch (error: any) {
        console.error('Resend OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while resending OTP',
            error: error.message
        });
    }
};

// Login controller
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if verified
        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: 'Please verify your email first'
            });
        }

        // Generate token
        const token = generateToken(user._id.toString());

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isVerified: user.isVerified,
                    phone: user.phone,
                    city: user.city,
                    practiceAreas: user.practiceAreas,
                    yearsExperience: user.yearsExperience,
                    lawFirm: user.lawFirm,
                    hourlyRate: user.hourlyRate,
                    bio: user.bio,
                    profilePictureUrl: user.profilePictureUrl
                }
            }
        });

    } catch (error: any) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: error.message
        });
    }
};

// Update profile controller
export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId; // From auth middleware
        const updates = req.body;

        // Don't allow updating sensitive fields
        delete updates.passwordHash;
        delete updates.email;
        delete updates.isVerified;
        delete updates.role;

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    phone: user.phone,
                    city: user.city,
                    practiceAreas: user.practiceAreas,
                    yearsExperience: user.yearsExperience,
                    lawFirm: user.lawFirm,
                    hourlyRate: user.hourlyRate,
                    bio: user.bio,
                    profilePictureUrl: user.profilePictureUrl
                }
            }
        });

    } catch (error: any) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during profile update',
            error: error.message
        });
    }
};

// Get attorneys controller
export const getAttorneys = async (req: Request, res: Response) => {
    try {
        const attorneys = await User.find({
            role: 'attorney',
            isVerified: true
        }).select('-passwordHash');

        res.json({
            success: true,
            data: {
                attorneys
            }
        });

    } catch (error: any) {
        console.error('Get attorneys error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching attorneys',
            error: error.message
        });
    }
};
