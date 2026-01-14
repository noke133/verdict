import mongoose, { Document, Schema } from 'mongoose';

export interface IOTPVerification extends Document {
    email: string;
    otpCode: string;
    expiresAt: Date;
    createdAt: Date;
    // Pending registration data (stored until verification)
    name?: string;
    passwordHash?: string;
    role?: string;
    licenseNumber?: string;
}

const OTPVerificationSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    otpCode: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    // Pending registration data
    name: {
        type: String,
        trim: true
    },
    passwordHash: {
        type: String
    },
    role: {
        type: String
    },
    licenseNumber: {
        type: String,
        trim: true
    }
});

// Index for faster lookups
OTPVerificationSchema.index({ email: 1 });

// Auto-delete expired OTPs
OTPVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IOTPVerification>('OTPVerification', OTPVerificationSchema);
