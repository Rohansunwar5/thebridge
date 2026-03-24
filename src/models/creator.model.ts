import mongoose from 'mongoose';

const creatorSchema = new mongoose.Schema(
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
    name: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    pincode: {
      type: String,
      trim: true,
    },
    profilePicture: {
      type: String,
    },
    niches: {
      type: [String],
      default: [],
    },
    platforms: {
      type: [String],
      enum: ['instagram', 'youtube', 'facebook', 'twitter', 'linkedin', 'other'],
      default: [],
    },
    socialLinks: {
      instagram: { type: String },
      youtube: { type: String },
      facebook: { type: String },
      twitter: { type: String },
      linkedin: { type: String },
      other: { type: String },
    },
    followerCount: {
      type: Number,
      default: 0,
    },
    engagementRate: {
      type: Number,
      default: 0,
    },
    bio: {
      type: String,
      maxlength: 1000,
    },

    // ---- Instagram analytics ----
    instagramToken: {
      type: String,
    },
    analyticsSnapshot: {
      followersCount: { type: Number },
      reach: { type: Number },
      impressions: { type: Number },
      views: { type: Number },
      lastRefreshed: { type: Date },
    },
  },
  { timestamps: true }
);

creatorSchema.index({ email: 1 });
creatorSchema.index({ phoneNumber: 1 });
creatorSchema.index({ niches: 1 });
creatorSchema.index({ city: 1 });
creatorSchema.index({ followerCount: 1 });
creatorSchema.index({ engagementRate: 1 });

export interface ICreator extends mongoose.Document {
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
  name?: string;
  city?: string;
  pincode?: string;
  profilePicture?: string;
  niches: string[];
  platforms: string[];
  socialLinks?: {
    instagram?: string;
    youtube?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    other?: string;
  };
  followerCount: number;
  engagementRate: number;
  bio?: string;
  // Instagram
  instagramToken?: string;
  analyticsSnapshot?: {
    followersCount?: number;
    reach?: number;
    impressions?: number;
    views?: number;
    lastRefreshed?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export default mongoose.model<ICreator>('Creator', creatorSchema);
