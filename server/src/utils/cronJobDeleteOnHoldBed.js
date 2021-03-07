import date from "date-and-time";
import dbConn from "../connections";


export default async () => {
  try {
    const { OnHoldBed, BedSpace } = dbConn.slowConn.models
    const now = new Date();
    let oneDayAgo = date.addHours(now, -24);

    // console.log( (new Date(thirtyMinutesAgo)) );
    await OnHoldBed.deleteMany({
      lockStart: { $lte: oneDayAgo },
    });

    await BedSpace.updateMany(
      {
        lockStart: {
          $lte: oneDayAgo,
        },
        bedStatus: { $regex: "onHold", $options: "i" },
      },
      { $set: { bedStatus: "vacant" } }
    );

    //i have to loop and set and possible delete
  } catch (error) {
    console.log(error);
  }
};
