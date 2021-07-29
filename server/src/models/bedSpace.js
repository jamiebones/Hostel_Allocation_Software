import mongoose from "mongoose";

const Schema = mongoose.Schema;

const BedSpaceSchema = new Schema({
  roomNumber: String,
  roomId: String,
  hallName: { type: String, required: true, lowercase: true },
  hallId: String,
  location: { type: String, required: true, lowercase: true },
  roomType: { type: String, required: true, lowercase: true },
  bedNumber: String,
  bedStatus: { type: String, required: true, lowercase: true },
  bedStatusType: { type: String, required: true, lowercase: true },
  lockStart: {
    type: Date,
    required: false,
  },
});

BedSpaceSchema.index({ roomNumber: 1, roomType: 1 });
BedSpaceSchema.index({ bedStatus: 1, location: 1, roomType: 1, bedNumber: 1 });
BedSpaceSchema.index({ bedStatusType: 1, location: 1, roomType: 1, bedNumber: 1 });
BedSpaceSchema.index({ bedStatusType: 1});

export default BedSpaceSchema;
//room type is gotten from hall type and it is either male or female

//lockstart is a locked applied to a room that has been marked for allocation.
