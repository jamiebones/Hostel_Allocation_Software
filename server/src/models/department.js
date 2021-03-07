import mongoose from "mongoose";

const Schema = mongoose.Schema;

const DepartmentSchema = new Schema({
  department: String,
  faculty: String,
  programDuration: String,
});

export default DepartmentSchema;