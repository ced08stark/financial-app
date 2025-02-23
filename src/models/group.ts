import mongoose, { Document, Schema } from 'mongoose';

interface IGroup extends Document {
  name: string;
  description: string;
  creator: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  posts: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const groupSchema = new Schema<IGroup>(
  {
    name: { type: String, required: true },
    description: { type: String },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  {
    timestamps: true,
  }
);

const Group = mongoose.model<IGroup>("Group", groupSchema);
export default Group;