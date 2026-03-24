import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema(
  {
    // ---- Auth fields ----
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
      sparse: true,
    },
    isdCode: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      minlength: 8,
    },
    authProvider: {
      type: String,
      enum: ['email', 'google', 'apple'],
      default: 'email',
    },
    verified: {
      type: Boolean,
      default: false,
    },
    onboardingComplete: {
      type: Boolean,
      default: false,
    },
    deletedAccount: {
      type: Boolean,
      default: false,
    },

    // ---- Profile fields ----
    brandName: {
      type: String,
      trim: true,
    },
    niche: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      maxlength: 1000,
    },
    websiteLink: {
      type: String,
    },
    socialLink: {
      type: String,
    },
    logo: {
      type: String,
    },
    banner: {
      type: String,
    },
  },
  { timestamps: true }
);

brandSchema.index({ email: 1 });
brandSchema.index({ phoneNumber: 1 });
brandSchema.index({ niche: 1 });

export interface IBrand extends mongoose.Document {
  _id: string;
  // Auth
  email: string;
  phoneNumber?: string;
  isdCode?: string;
  password?: string;
  authProvider: 'email' | 'google' | 'apple';
  verified: boolean;
  onboardingComplete: boolean;
  deletedAccount: boolean;
  // Profile
  brandName?: string;
  niche?: string;
  bio?: string;
  websiteLink?: string;
  socialLink?: string;
  logo?: string;
  banner?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default mongoose.model<IBrand>('Brand', brandSchema);
