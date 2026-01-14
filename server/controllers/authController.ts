import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';


// Generate JWT token
const generateToken = (userId: string): string => {
    const secret = process.env.JWT_SECRET || 'your-default-secret-key';
    return jwt.sign({ userId }, secret, { expiresIn: '30d' });
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

        // Create user directly
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            passwordHash,
            role,
            licenseNumber: license,
            isVerified: true
        });

        // Generate token
        const token = generateToken(user._id.toString());

        res.status(201).json({
            success: true,
            message: 'Account created successfully',
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
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during signup',
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
