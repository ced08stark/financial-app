import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  userName?: string;
  email: string;
  password: string;
  refreshToken?: string;
  role: 'admin' | 'editor' | 'member' | 'premium' | 'guest';
  preferences: {
    language: string;
    notifications: boolean;
  };
  groups: mongoose.Types.ObjectId[];
  posts: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    userName: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'editor', 'member', 'premium', 'guest'], required: true },
    preferences: {
      language: { type: String, default: "fr" },
      notifications: { type: Boolean, default: true },
    },
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    refreshToken: { type: String },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>("User", userSchema);
export default User;