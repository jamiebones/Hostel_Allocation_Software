import { gql } from "apollo-server-express";

import userSchema from "./user";
import transactionSchema from "./transaction";
import messageSchema from "./message";
import studentBioSchema from "./studentBio";
import bedAlloctedStatSchema from "./bedAlloctedStat";
import sessionTableSchema from "./sessionTable";
import roomSchema from "./room";
import onHoldBedSchema from "./onHoldRoom";
import hostelSchema from "./hostel";
import confirmPhoneTableSchema from "./confirmPhoneTable";
import facultySchema from "./faculty";
import bedSpaceAllocationSchema from "./bedSpaceAllocation";
import bedSpaceSchema from "./bedSpace";
import departmentSchema from "./department";
import luckyCodeSchema from "./luckyCode";
import adminAllocationSchema from "./adminRoomAllocation"
const linkSchema = gql`
  scalar Date
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

export default [
  linkSchema,
  userSchema,
  transactionSchema,
  messageSchema,
  studentBioSchema,
  bedAlloctedStatSchema,
  sessionTableSchema,
  roomSchema,
  onHoldBedSchema,
  hostelSchema,
  confirmPhoneTableSchema,
  facultySchema,
  bedSpaceAllocationSchema,
  bedSpaceSchema,
  departmentSchema,
  luckyCodeSchema,
  adminAllocationSchema
];
