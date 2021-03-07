import mongoose from "mongoose";
const Schema = mongoose.Schema;

const StudentBioSchema = new Schema({
  regNumber: { type: String, lowercase: true },
  email: { type: String, required: false, lowercase: true },
  sex: { type: String, required: true, lowercase: true },
  name: { type: String, required: true, lowercase: true },
  dept: { type: String, required: true, lowercase: true },
  faculty: { type: String, required: true, lowercase: true },
  programDuration: String,
  phoneNumber: String,
  currentLevel: String,
  currentSession: String,
  profileImage: String,
  nextofKin: {
    name: { type: String, required: false },
    address: { type: String, required: false },
    phone: { type: String, required: false },
  },
  entryMode: {
    type: String,
    enum: ["utme", "direct entry"],
  },
});

StudentBioSchema.index({ regNumber: 1 });

export default StudentBioSchema;