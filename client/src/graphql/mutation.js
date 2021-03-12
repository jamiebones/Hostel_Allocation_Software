import gql from "graphql-tag";

const CreateStudentAccount = gql`
  mutation createStudentAccount($input: StudentDataInput!) {
    createStudentAccount(input: $input) {
      regNumber
    }
  }
`;

const AllocateBedSpace = gql`
  mutation allocateBedSpace($regNumber: String!) {
    allocateBedSpace(regNumber: $regNumber) {
      id
      roomNumber
      hallName
      hallId
      roomType
      location
      bedStatus
      lockStart
      bedNumber
    }
  }
`;

const GenerateRemitaRRR = gql`
  mutation generateRemitaRRR($regNumber: String!) {
    generateRemitaRRR(regNumber: $regNumber) {
      statuscode
      RRR
      status
      regNumber
      amount
      env {
        MerchantId
        Api_Key
        ServiceTypeId
        Gateway
        CheckStatusUrl
        ReturnRemitaUrl
        RRRGateWayPaymentUrl
      }
    }
  }
`;

const InitiateHostelPayment = gql`
  mutation initiateHostelFeePayment($regNumber: String!) {
    initiateHostelFeePayment(regNumber: $regNumber) {
      id
      amount
      transactionId
      payerName
      session
      date
      successful
      roomDetails {
        roomNumber
        hallName
        bedSpace
        roomNumber
        roomId
        hallId
        bedId
        location
        roomType
      }
      student {
        name
        email
        phoneNumber
        regNumber
      }
    }
  }
`;

const ConfirmRemitaRRRTransaction = gql`
  mutation confirmRemitaTransaction($rrr: String!) {
    confirmRemitaTransaction(rrr: $rrr) {
      id
      amount
      transactionId
      payerId
      payerName
      transactionStatus
      session
      date
      RRR
      successful
      roomDetails {
        roomNumber
        hallName
        bedSpace
        roomNumber
        roomId
        hallId
        bedId
        location
        roomType
      }
    }
  }
`;

const ChangeBedStatusMutation = gql`
  mutation changeBedStatus($newStatus: String!, $bedId: String!, $roomId: ID!) {
    changeBedStatus(newStatus: $newStatus, bedId: $bedId, roomId: $roomId)
  }
`;

const CreateNewSessionMutation = gql`
  mutation createSession($input: SessionInput) {
    createSession(input: $input) {
      id
      session
      active
    }
  }
`;

const UpdateSessionMutation = gql`
  mutation updateSession($input: SessionInput, $sessionId: ID!) {
    updateSession(input: $input, sessionId: $sessionId) {
      id
      session
    }
  }
`;

const UpdateSession = gql`
  mutation updateSessionTable($sessionStatus: String!, $sessionId: ID!) {
    updateSessionTable(sessionId: $sessionId, sessionStatus: $sessionStatus) {
      id
    }
  }
`;

const SendNotificationCode = gql`
  mutation phoneConfirmation($regNumber: String!, $phoneNumber: String!) {
    phoneConfirmation(regNumber: $regNumber, phoneNumber: $phoneNumber) {
      randomCode
      confirmStatus
      regNumber
      timeSaved
      phoneNumber
    }
  }
`;

const ConfirmNotificationCode = gql`
  mutation confirmCode($regNumber: String!, $code: String!) {
    confirmCode(regNumber: $regNumber, code: $code) {
      randomCode
      confirmStatus
    }
  }
`;

const CreateHall = gql`
  mutation createHostelHall(
    $hallName: String!
    $type: String!
    $location: String!
    $status: String!
    $hostelFee: String!
    $occupiedBy: [OccupiedByInput]
  ) {
    createHostelHall(
      hallName: $hallName
      type: $type
      location: $location
      status: $status
      hostelFee: $hostelFee
      occupiedBy: $occupiedBy
    ) {
      id
    }
  }
`;

const EditHall = gql`
  mutation editHostelHall(
    $hallId: ID!
    $hallName: String!
    $type: String!
    $location: String!
    $status: String!
    $hostelFee: String!
    $occupiedBy: [OccupiedByInput]
  ) {
    editHostelHall(
      hallId: $hallId
      hallName: $hallName
      type: $type
      location: $location
      status: $status
      hostelFee: $hostelFee
      occupiedBy: $occupiedBy
    ) {
      id
    }
  }
`;

const LockAllBedSpaceMutation = gql`
  mutation lockAllBedsInRoom($roomId: ID!) {
    lockAllBedsInRoom(roomId: $roomId)
  }
`;

const AddNewRoomMutation = gql`
  mutation createRoom(
    $roomNumber: String!
    $totalBedSpace: String!
    $hallName: String!
    $hallId: String
    $location: String!
    $roomType: String!
    $singleBeds: String!,
    $doubleBeds: String!,
  ) {
    createRoom(
      roomNumber: $roomNumber
      totalBedSpace: $totalBedSpace
      hallName: $hallName
      hallId: $hallId
      location: $location
      roomType: $roomType
      singleBeds: $singleBeds
      doubleBeds: $doubleBeds

    ) {
      id
    }
  }
`;

const ActivateSessionMutation = gql`
  mutation activateSession($sessionId: ID!) {
    activateSession(sessionId: $sessionId)
  }
`;

const DeactivateSessionMutation = gql`
  mutation deactivateSession($sessionId: ID!) {
    deactivateSession(sessionId: $sessionId)
  }
`;

const CreateRoom = gql`
  mutation createRoom($input: RoomInput) {
    createRoom(input: $input) {
      id
    }
  }
`;

const LoginStudent = gql`
  query loginStudent($regNumber: String, $password: String, $email: String) {
    loginUser(regNumber: $regNumber, password: $password, email: $email) {
      id
      token
      email
      regNumber
      accessLevel
    }
  }
`;

const ChangeBedStatus = gql`
  mutation changeBedStatus($newStatus: String!, $bedId: ID!) {
    changeBedStatus(newStatus: $newStatus, bedId: $bedId)
  }
`;

const ConfirmStudentHostelAllocation = gql`
  mutation confirmStudent($regNumber: String!, $session: String!) {
    confirmStudent(regNumber: $regNumber, session: $session)
  }
`;

const LockAllBedSpace = gql`
  mutation lockAllBedSpace {
    lockAllBedSpace
  }
`;

const OpenAllBedSpace = gql`
  mutation openAllBedSpace {
    openAllBedSpace
  }
`;

const SimulateRemitaTransaction = gql`
  mutation simulateRemitaTransaction($regNumber: String!) {
    simulateRemitaTransaction(regNumber: $regNumber) {
      message
      status
    }
  }
`;

//

const PlaceStudentInHoldBedSpace = gql`
  mutation placeStudentInBedSpace($regNumber: String!, $bedId: ID!) {
    placeStudentInBedSpace(regNumber: $regNumber, bedId: $bedId)
  }
`;

const DashStudentFreeRoom = gql`
  mutation dashStudentFreeBed($regNumber: String!, $bedId: ID!) {
    dashStudentFreeBed(regNumber: $regNumber, bedId: $bedId)
  }
`;
//method for confirming the payment made by a student
const ConfirmStudentTransaction = gql`
  mutation confirmTransaction($flutterId: String!, $transId: String!) {
    confirmTransaction(flutterId: $flutterId, transId: $transId) {
      id
      amount
      transactionId
      paymentId
      payerId
      regNumber
      payerName
      session
      date
      successful
      student {
        dept
        faculty
        regNumber
      }
      roomDetails {
        roomNumber
        hallName
        bedSpace
        location
        roomType
      }
    }
  }
`;

//

export {
  EditHall,
  ChangeBedStatus,
  CreateRoom,
  LoginStudent,
  CreateStudentAccount,
  AllocateBedSpace,
  GenerateRemitaRRR,
  ConfirmRemitaRRRTransaction,
  ChangeBedStatusMutation,
  CreateNewSessionMutation,
  UpdateSession,
  SendNotificationCode,
  ConfirmNotificationCode,
  CreateHall,
  LockAllBedSpaceMutation,
  AddNewRoomMutation,
  InitiateHostelPayment,
  UpdateSessionMutation,
  ActivateSessionMutation,
  DeactivateSessionMutation,
  LockAllBedSpace,
  OpenAllBedSpace,
  ConfirmStudentHostelAllocation,
  ConfirmStudentTransaction,
  PlaceStudentInHoldBedSpace,
  DashStudentFreeRoom,
  SimulateRemitaTransaction,
};
