import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash: string;
    role: 'attorney' | 'client';
    isVerified: boolean;
    licenseNumber?: string;
    phone?: string;
    city?: string;
    practiceAreas?: string[];
    yearsExperience?: number;
    lawFirm?: string;
    hourlyRate?: number;
    bio?: string;
    profilePictureUrl?: string;
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['attorney', 'client'],
        default: 'attorney'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    licenseNumber: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    practiceAreas: [{
        type: String
    }],
    yearsExperience: {
        type: Number,
        min: 0
    },
    lawFirm: {
        type: String,
        trim: true
    },
    hourlyRate: {
        type: Number,
        min: 0
    },
    bio: {
        type: String
    },
    profilePictureUrl: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

export default mongoose.model<IUser>('User', UserSchema);
