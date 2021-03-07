import mongoose from "mongoose";

const Schema = mongoose.Schema;

const OnHoldBedSchema = new Schema({
  bedId: String,
  regNumber: { type: String, required: true, lowercase: true },
  session: String,
  lockStart: {
    type: Date,
    required: false,
  },
});

OnHoldBedSchema.index({ regNumber: 1, session: -1 }, { unique: true });

export default OnHoldBedSchema;
//room type is gotten from hall type and it is either male or female

//lockstart is a locked applied to a room that has been marked for allocation.
