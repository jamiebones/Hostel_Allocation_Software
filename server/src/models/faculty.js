import mongoose from "mongoose";

const Schema = mongoose.Schema;

const FacultySchema = new Schema({
  facultyName: String,
  location: String,
});

export default FacultySchema;