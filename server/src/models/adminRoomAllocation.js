import mongoose from "mongoose";
const Schema = mongoose.Schema;

const AdminRoomAllocationSchema = new Schema({
  session: String,
  date: Date,
  regNumber: { type: String, required: true, lowercase: true },
  name: { type: String, required: true, lowercase: true },
  alloctedBy: String,
  roomNumber: String,
  roomId: String,
  hallId: String,
  hallName: { type: String, required: true, lowercase: true },
  bedNumber: String,
});

AdminRoomAllocationSchema.index({ session: -1 });

export default AdminRoomAllocationSchema