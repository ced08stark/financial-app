import mongoose, { Document, Schema } from 'mongoose';

interface IStatistics extends Document {
  user: mongoose.Types.ObjectId;
  postsCount: number;
  messagesCount: number;
  groupsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const statisticsSchema = new Schema<IStatistics>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    postsCount: { type: Number, default: 0 },
    messagesCount: { type: Number, default: 0 },
    groupsCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Statistics = mongoose.model<IStatistics>("Statistics", statisticsSchema);
export default Statistics;