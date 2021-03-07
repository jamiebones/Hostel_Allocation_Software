import mongoose from "mongoose";

const Schema = mongoose.Schema;

const bedSpaceSchema = new Schema({
  bedIndex: String,
  bedNumber: String,
  bedStatus: String,
  lockStart: Date,
});

const roomSchema = new Schema({
  roomNumber: String,
  bedSpace: [bedSpaceSchema],
  totalBedSpace: String,
  hallName: { type: String, required: true, lowercase: true },
  hallId: String,
  location: { type: String, required: true, lowercase: true },
  roomType: { type: String, required: true, lowercase: true },
});

export default roomSchema;
//room type is gotten from hall type and it is either male or female

//bedspace object

/*{
    bedIndex
    bedNumber
    bedStatus
    lockStart
}*/
