import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
  userType: String,
  accessLevel: { type: String, required: false },
  regNumber: { type: String, required: false },
});

export default UserSchema;