import mongoose from "mongoose";
const Schema = mongoose.Schema;

const facultyAllocationSchema = new Schema({
  facultyId: String,
  facultyName: String,
  percentAllocation: Number,
  totalAllocation: Number,
  totalOccupied: Number,
});

const levelAllocationSchema = new Schema({
  level: String,
  percentAllocation: Number,
  totalAllocation: Number,
  totalOccupied: Number,
});

const SessionTableSchema = new Schema({
  session: String,
  facultyAllocation: [facultyAllocationSchema],
  levelAllocation: [levelAllocationSchema],
  active: Boolean,
});

SessionTableSchema.index({ session: -1 });
export default SessionTableSchema;
//session status is either active or inactive
//only one session can be active at a time

//final year slot is in percentage of the total hostel space

//keep a track of the slot left for each
