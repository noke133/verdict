import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

/**
 * Send OTP email to user
 */
export const sendOTPEmail = async (email: string, otp: string, name: string): Promise<boolean> => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"Verdict" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
            to: email,
            subject: 'Verify Your Email - Verdict',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
                        .otp-box { background: white; border: 2px solid #1e3a8a; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
                        .otp-code { font-size: 32px; font-weight: bold; color: #1e3a8a; letter-spacing: 8px; }
                        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #64748b; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Welcome to Verdict</h1>
                        </div>
                        <div class="content">
                            <h2>Hello ${name},</h2>
                            <p>Thank you for signing up! To complete your registration, please verify your email address using the code below:</p>
                            
                            <div class="otp-box">
                                <p style="margin: 0; font-size: 14px; color: #64748b;">Your Verification Code</p>
                                <div class="otp-code">${otp}</div>
                            </div>
                            
                            <p><strong>This code will expire in 10 minutes.</strong></p>
                            <p>If you didn't request this code, please ignore this email.</p>
                            
                            <div class="footer">
                                <p>© ${new Date().getFullYear()} Verdict. All rights reserved.</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `Hello ${name},\n\nYour verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, please ignore this email.\n\n© ${new Date().getFullYear()} Verdict. All rights reserved.`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully to ${email}. Message ID: ${info.messageId}`);
        return true;
    } catch (error: any) {
        console.error('❌ Email sending failed:', error.message);
        // Don't throw error - allow signup to continue even if email fails
        return false;
    }
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (email: string, resetToken: string, name: string): Promise<boolean> => {
    try {
        const transporter = createTransporter();
        const resetUrl = `${process.env.APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: `"Verdict" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
            to: email,
            subject: 'Password Reset Request - Verdict',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
                        .button { display: inline-block; background: #1e3a8a; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
                        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #64748b; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Password Reset</h1>
                        </div>
                        <div class="content">
                            <h2>Hello ${name},</h2>
                            <p>We received a request to reset your password. Click the button below to create a new password:</p>
                            
                            <a href="${resetUrl}" class="button">Reset Password</a>
                            
                            <p><strong>This link will expire in 1 hour.</strong></p>
                            <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
                            
                            <div class="footer">
                                <p>© ${new Date().getFullYear()} Verdict. All rights reserved.</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `Hello ${name},\n\nClick the link below to reset your password:\n${resetUrl}\n\nThis link will expire in 1 hour.\n\n© ${new Date().getFullYear()} Verdict. All rights reserved.`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Password reset email sent to ${email}. Message ID: ${info.messageId}`);
        return true;
    } catch (error: any) {
        console.error('❌ Password reset email failed:', error.message);
        return false;
    }
};
