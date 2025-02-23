import mongoose, { Document, Schema } from 'mongoose';

interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  content: string;
  group?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, required: true },
    group: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model<IMessage>("Message", messageSchema);
export default Message;