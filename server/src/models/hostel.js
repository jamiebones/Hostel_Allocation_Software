import mongoose from "mongoose";

const Schema = mongoose.Schema;

const HostelSchema = new Schema({
  hallName: { type: String, required: true, lowercase: true },
  type: {
    type: String,
    required: true,
    enum: ['male', 'female'],
  },
  location: { type: String, required: true, lowercase: true },
  hostelFee: String,
  status: {
    type: String,
    required: true,
    enum: ['special', 'normal'],
  },
  occupiedByLevel: {
    type: [String],
    required: false
  },
  occupiedBy: {
    type: [String],
    required: false
  }
  
});

export default HostelSchema;