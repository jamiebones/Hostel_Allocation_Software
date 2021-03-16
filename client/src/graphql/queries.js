import gql from "graphql-tag";

const ContactUniuyoPortal = gql`
  query contactUniuyoPortal($regNumber: String!) {
    contactUniuyoPortal(regNumber: $regNumber) {
      regNumber
      email
      sex
      name
      dept
      faculty
      phoneNumber
      currentLevel
      currentSession
      nextofKin {
        name
        address
        phone
      }
      entryMode
      profileImage
    }
  }
`;

const LoginUser = gql`
  query loginUser($regNumber: String, $password: String!, $email: String) {
    loginUser(regNumber: $regNumber, password: $password, email: $email) {
      ... on User {
        token
        email
        regNumber
        accessLevel
        userType
        name
      }
      ... on Error {
        message
        type
      }
    }
  }
`;

const GetReservedBedSpace = gql`
  query getbedSpaceReserved($regNumber: String!) {
    getbedSpaceReserved(regNumber: $regNumber) {
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

const GetAllocationByRoom = gql`
  query getAllConfirmedBedAllocationByRoom(
    $roomId: String!
    $session: String!
  ) {
    getAllConfirmedBedAllocationByRoom(roomId: $roomId, session: $session) {
      studentId
      hallName
      roomId
      roomNumber
      bedSpace
      studentName
      studentConfirmed
      session
      student {
        dept
        faculty
        email
        sex
        currentLevel
        name
        entryMode
        profileImage
        regNumber
        phoneNumber
      }
      room {
        location
        roomType
      }
    }
  }
`;

const GetConfirmedAllocationByRoom = gql`
  query getAllConfirmedBedAllocationByRoom(
    $roomId: String!
    $session: String!
  ) {
    getAllConfirmedBedAllocationByRoom(roomId: $roomId, session: $session) {
      studentId
      hallName
      roomId
      roomNumber
      bedSpace
      studentName
      session
      student {
        dept
        faculty
        email
        sex
        currentLevel
        name
        entryMode
        profileImage
        regNumber
        phoneNumber
      }
      room {
        location
        roomType
      }
    }
  }
`;

const AllocationToStudent = gql`
  query getAllocationToStudent($regNumber: String!, $session: String!) {
    getAllocationToStudent(regNumber: $regNumber, session: $session) {
      studentId
      hallName
      roomId
      roomNumber
      bedSpace
      studentName
      session
      studentConfirmed
      student {
        dept
        faculty
        email
        sex
        currentLevel
        name
        entryMode
        profileImage
        regNumber
      }
      room {
        location
        roomType
      }
    }
  }
`;

const GetHostelByType = gql`
  query hallByType($type: String!) {
    hallByType(type: $type) {
      id
      hallName
    }
  }
`;

const TotalAndReservedBedStatistic = gql`
  query getBedStatistic {
    getBedStatistic {
      totalSpace
      reservedSpace
    }
  }
`;

const CheckPhoneNumberConfirmation = gql`
  query confirmIfPhone($regNumber: String!) {
    confirmIfPhone(regNumber: $regNumber)
  }
`;

const CheckphoneIfThePersonHasTriedsMoreThanThreeTimes = gql`
  query checkPhoneEnteredMoreThanThreeTimes($regNumber: String!) {
    checkPhoneEnteredMoreThanThreeTimes(regNumber: $regNumber)
  }
`;

const GetRoomInHall = gql`
  query roomsInHall($hallId: ID!) {
    roomsInHall(hallId: $hallId) {
      roomNumber
      totalBedSpace
      hallName
      hallId
      id
      roomType
      location
      beds {
        bedStatus
        bedNumber
        id
      }
    }
  }
`;

const AllSessions = gql`
  query allSessions {
    allSessions {
      id
      facultyAllocation {
        facultyName
        facultyId
        percentAllocation
      }
      levelAllocation {
        level
        percentAllocation
      }
      session
      active
    }
  }
`;

const GetAllHalls = gql`
  query getAllHalls {
    getAllHalls {
      id
      hallName
      type
      location
    }
  }
`;

const BedsInRoom = gql`
  query bedsInRoom($roomId: ID!) {
    bedsInRoom(roomId: $roomId) {
      roomNumber
      hallName
      hallId
      roomType
      location
      bedStatus
      lockStart
      bedNumber
      id
    }
  }
`;

const GetStudentData = gql`
  query studentData($regNumber: String!) {
    studentData(regNumber: $regNumber) {
      id
      regNumber
      email
      sex
      name
      phoneNumber
      dept
      faculty
      currentLevel
      currentSession
    }
  }
`;

//new queries starts here

const GetSessionById = gql`
  query getSessionById($sessionId: ID!) {
    getSessionById(sessionId: $sessionId) {
      id
      session
      facultyAllocation {
        facultyName
        facultyId
        percentAllocation
      }
      levelAllocation {
        level
        percentAllocation
      }
      active
    }
  }
`;

const GetAllFaculties = gql`
  query allFaculties {
    allFaculties {
      id
      facultyName
      location
    }
  }
`;

const GetBedStatusTotal = gql`
  query getbedsByStatus($status: String!) {
    getbedsByStatus(status: $status) {
      hallName
      rooms {
        room
        beds {
          bedNumber
          bedStatus
        }
      }
    }
  }
`;

const GetLockedBedSpace = gql`
  query getLockedBedSpace {
    getLockedBedSpace {
      hallName
      location
      roomType
      rooms {
        room
        beds {
          bedNumber
          bedId
        }
      }
    }
  }
`;

const ConfirmTransactionUsingRRR = gql`
  query confirmTransactionUsingRRR($orderID: String!, $RRR: String!) {
    confirmTransactionUsingRRR(orderID: $orderID, RRR: $RRR) {
      message
      status
    }
  }
`;

const GetHostelByTypeAndLocation = gql`
  query getHallByLocationAndType($hallType: String!, $location: String!) {
    getHallByLocationAndType(hallType: $hallType, location: $location) {
      id
      hallName
      type
      location
      hostelFee
      status
      occupiedBy {
        facultyName
        levels
      }
      rooms {
        id
        roomNumber
        totalBedSpace
      }
    }
  }
`;

const GetTransactionUsingRRR = gql`
  query getTransactionWithRRR($rrr: String!) {
    getTransactionWithRRR(rrr: $rrr) {
      amount
      transactionId
      payerName
      regNumber
      session
      date
      student {
        email
        dept
        faculty
        currentLevel
      }
      roomDetails {
        roomNumber
        hallName
        bedSpace
        roomId
        hallId
        bedId
        location
        roomType
      }
      rrr
    }
  }
`;

const StudentTransaction = gql`
  query studentTransaction($regNumber: String!) {
    studentTransaction(regNumber: $regNumber) {
      amount
      transactionId
      payerName
      regNumber
      session
      date
      student {
        email
        dept
        faculty
        currentLevel
      }
      roomDetails {
        roomNumber
        hallName
        bedSpace
        roomId
        hallId
        bedId
        location
        roomType
      }
      rrr
      successful
    }
  }
`;

const GetAdminAllocation = gql`
  query adminAllocationBySession($session: String!) {
    adminAllocationBySession(session: $session) {
      session
      date
      regNumber
      student {
        dept
        faculty
        currentLevel
      }
      name
      phoneNumber
      alloctedBy
      roomNumber
      hallName
      bedNumber
    }
  }
`;

const GetHostelsByName = gql`
  query hostelDetailsByName($hostelName: String!) {
    hostelDetailsByName(hostelName: $hostelName) {
      id
      hallName
      type
      location
      hostelFee
      rooms {
        roomNumber
        totalBedSpace
        hallName
        hallId
        location
        roomType
      }
      status
      occupiedBy {
        facultyName
        levels
      }
    }
  }
`;

const GetHostelById = gql`
  query GetHostelById($hallId: ID!) {
    getOneHall(hallId: $hallId) {
      id
      hallName
      type
      location
      hostelFee
      rooms {
        roomNumber
        totalBedSpace
        hallName
        hallId
        location
        roomType
      }
      status
      occupiedBy {
        facultyName
        levels
      }
    }
  }
`;

const GetAllHallsWithRoomDetails = gql`
  query getAllHalls {
    getAllHalls {
      id
      hallName
      rooms {
        roomNumber
        totalBedSpace
        id
      }
    }
  }
`;

const GetSMSCreditAvailable = gql`
  query checkCredit {
    checkCredit {
      sms_credits
    }
  }
`

export {
  GetSMSCreditAvailable,
  GetHostelById,
  CheckphoneIfThePersonHasTriedsMoreThanThreeTimes,
  ContactUniuyoPortal,
  LoginUser,
  GetReservedBedSpace,
  StudentTransaction,
  AllocationToStudent,
  GetHostelByType,
  GetRoomInHall,
  AllSessions,
  CheckPhoneNumberConfirmation,
  GetAllHalls,
  BedsInRoom,
  GetAllocationByRoom,
  GetStudentData,
  GetAllFaculties,
  GetSessionById,
  GetHostelByTypeAndLocation,
  GetConfirmedAllocationByRoom,
  GetBedStatusTotal,
  GetLockedBedSpace,
  ConfirmTransactionUsingRRR,
  GetTransactionUsingRRR,
  GetAdminAllocation,
  TotalAndReservedBedStatistic,
  GetHostelsByName,
  GetAllHallsWithRoomDetails,
};
