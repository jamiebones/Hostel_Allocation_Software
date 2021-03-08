import userResolvers from "./user";
import messageResolvers from "./message";
import transactionResolvers from "./transaction";
import studentBioResolvers from "./studentBio";
import { GraphQLDateTime } from "graphql-iso-date";
import bedSpaceResolvers from "./bedSpace";
import roomResolvers from "./room";
import hostelResolvers from "./hostel";
import departmentResolvers from "./department";
import sessionTableResolvers from "./sessionTable";
import confirmPhoneResolvers from "./confirmPhoneTable";
import bedSpaceAllocationResolvers from "./bedSpaceAllocation";
import facultyResolvers from "./faculty";
import adminRoomAllocation from "./adminRoomAllocation"
const customScalarResolver = {
  Date: GraphQLDateTime,
};

export default [
  customScalarResolver,
  userResolvers,
  messageResolvers,
  transactionResolvers,
  studentBioResolvers,
  bedSpaceResolvers,
  roomResolvers,
  hostelResolvers,
  departmentResolvers,
  sessionTableResolvers,
  confirmPhoneResolvers,
  bedSpaceAllocationResolvers,
  facultyResolvers,
  adminRoomAllocation
];
