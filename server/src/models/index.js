import UserSchema from "./user";
import AdminRoomAllocationSchema from "./adminRoomAllocation";
import BedSpaceSchema from "./bedSpace";
import BedSpaceAllocationSchema from "./bedSpaceAllocation";
import ConfirmPhoneNumberSchema from "./confirmPhoneNumber";
import DepartmentSchema from "./department";
import FacultySchema from "./faculty";
import HostelSchema from "./hostel";
import MessageSchema from "./message";
import OnHoldBedSchema from "./onHoldBed";
import RoomSchema from "./room";
import SessionTableSchema from "./sessionTable";
import StudentBioSchema from "./studentBio";
import TransactionSchema from "./transaction";

export default async (db) => {
  db.model("User", UserSchema);
  db.model("AdminRoomAllocation", AdminRoomAllocationSchema);
  db.model("BedSpace", BedSpaceSchema);
  db.model("BedSpaceAllocation", BedSpaceAllocationSchema);
  db.model("ConfirmPhoneNumber", ConfirmPhoneNumberSchema);
  db.model("Department", DepartmentSchema);
  db.model("Faculty", FacultySchema);
  db.model("Hostel", HostelSchema);
  db.model("Message", MessageSchema);
  db.model("OnHoldBed", OnHoldBedSchema);
  db.model("Room", RoomSchema);
  db.model("SessionTable", SessionTableSchema);
  db.model("StudentBio", StudentBioSchema);
  db.model("Transaction", TransactionSchema);

  return db;
};
