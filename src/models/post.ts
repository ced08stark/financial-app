import mongoose, { Document, Schema } from 'mongoose';

interface IPost extends Document {
  author: mongoose.Types.ObjectId;
  content: string;
  group?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    group: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model<IPost>("Post", postSchema);
export default Post;