const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  message: String,
  from: String,
  receipents: String,
  date: Date,
  messageId: String
});

export default MessageSchema;
