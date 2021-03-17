import mongoose from "mongoose";

const Schema = mongoose.Schema;

const BedSpaceAllocationSchema = new Schema({
  hallId: String,
  hallName: { type: String, required: true, lowercase: true },
  roomId: String,
  studentId: String,
  phoneNumber: String,
  roomNumber: String,
  session: String,
  regNumber: { type: String, required: true, lowercase: true },
  studentName: { type: String, required: true, lowercase: true },
  bedSpace: String,
  studentConfirmed: {
    type: Boolean,
    default: false
  }
});

export default BedSpaceAllocationSchema;