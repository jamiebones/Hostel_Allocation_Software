const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  message: String,
  from: String,
  receipents: [],
  date: Date,
});

export default MessageSchema;
