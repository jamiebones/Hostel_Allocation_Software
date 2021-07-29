import mongoose from "mongoose";
const Schema = mongoose.Schema;

//paymentId will stand for the id of the payment processing companies like remita and flutter

const TransactionSchema = new Schema({
  amount: String,
  transactionId: String,
  regNumber: { type: String, lowercase: true },
  payerName: String,
  session: String,
  date: Date,
  rrr: { type: String, required: false },
  transactionStatus: { type: String, required: false },
  roomDetails: {
    roomNumber: { type: String, required: false },
    hallName: { type: String, required: false },
    bedSpace: { type: String, required: false },
    roomNumber: { type: String, required: false },
    roomId: { type: String, required: false },
    hallId: { type: String, required: false },
    location: { type: String, required: false },
    roomType: { type: String, required: false },
    bedId: { type: String, required: false },
  },
  successful: { type: Boolean, required: false },
});

TransactionSchema.index({ regNumber: 1 });

export default TransactionSchema;