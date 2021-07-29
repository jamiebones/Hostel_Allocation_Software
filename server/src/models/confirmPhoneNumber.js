import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ConfirmPhoneNumberSchema = new Schema({
  randomCode: String,
  confirmStatus: Boolean,
  regNumber: { type: String, required: true, lowercase: true },
  timeSaved: Date,
  phoneNumber: String,
});

export default ConfirmPhoneNumberSchema;