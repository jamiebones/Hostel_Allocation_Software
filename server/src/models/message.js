const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  message: String,
  sender: String,
  receipents: String,
  date: Date,
  status: String,
  totalMessage: String,
  batchId: String,
});

export default MessageSchema;
