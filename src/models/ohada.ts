import mongoose, { Document, Schema } from 'mongoose';

interface IOhadaPlan extends Document {
  code: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const ohadaPlanSchema = new Schema<IOhadaPlan>(
  {
    code: { type: String, required: true, unique: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const OhadaPlan = mongoose.model<IOhadaPlan>("OhadaPlan", ohadaPlanSchema);
export default OhadaPlan;