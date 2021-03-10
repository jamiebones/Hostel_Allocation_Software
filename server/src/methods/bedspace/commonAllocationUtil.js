import models from "../../models";

export const checkIfSpaceIsOnHold = async (
  regNumber,
  activeSession,
  session,
  conn
) => {
  const findDoc = await conn.models.OnHoldBed.findOne({
    regNumber,
    session: activeSession,
  }).session(session);
  if (findDoc) {
    throw new Error("You already have a bed space on hold");
  }
};

export const getReservedBedSpace = async (regNumber, activeSession, conn) => {
  const bed = await conn.models.OnHoldBed.findOne({
    regNumber,
    session: activeSession,
  });
  return bed;
};

export const checkIfSpaceAlreadyAllocatedToStudentThatSession = async (
  regNumber,
  activeSession,
  session,
  conn
) => {
  const findDoc = await conn.models.BedSpaceAllocation.findOne({
    regNumber,
    session: activeSession,
  }).session(session);
  if (findDoc) {
    throw new Error("You already have an assign bed space");
  }
};

export const confirmSpaceOnHoldThatSession = async (
  regNumber,
  activeSession,
  session,
  conn
) => {
  const findDoc = await conn.models.BedSpaceAllocation.findOne({
    regNumber,
    session: activeSession,
  }).session(session);
  if (findDoc) {
    return findDoc;
  }
};

export const searchVacantRoomsByLocationCriteria = async (
  sex,
  facultyLocation,
  session,
  conn
) => {
  const criteria = {
    roomType: sex,
    location: facultyLocation,
    bedStatus: "vacant",
  };
  const vacantBeds = await conn.models.BedSpace.find(criteria).session(session);

  return vacantBeds;
};

export const totalSpaceAvailableByLocation = async (conn) => {
  const pipeline = [
    {
      $match: {
        bedStatus: "vacant",
      },

      $group: {
        _id: {
          location: "$location",
          roomType: "$roomType",
        },
        total: { $sum: 1 },
      },
    },
  ];
  const totalSpace = await conn.models.BedSpace.aggregate(pipeline);
  return totalSpace;
};

export const saveBedSpaceOnHold = async (
  id,
  regNumber,
  activeSession,
  session,
  conn
) => {
  const now = new Date();
  const newOnHoldBedSpace = new conn.models.OnHoldBed({
    bedId: id,
    regNumber,
    session: activeSession,
    lockStart: now,
  });
  const [_, bedOnHold] = await Promise.all([
    newOnHoldBedSpace.save({ session: session }),
    conn.models.BedSpace.findOneAndUpdate(
      { _id: id },
      { bedStatus: "onHold", lockStart: now },
      {
        new: true,
      }
    ).session(session),
  ]);
  return bedOnHold;
};

export const findSpaceByLevelAndLocation = async (student, session, conn) => {
  const { levelType, sex, campusLocation } = student;
  if (levelType === "final year") {
    let bed = await conn.models.BedSpace.findOne({
      $or: [{ bedNumber: /^\dA/ }, { bedNumber: /^\dS/ }],
      bedStatus: "vacant",
      location: campusLocation,
      roomType: sex,
    }).session(session);
    if (bed) {
      return bed;
    }
    return null;
  }

  if (levelType === "first year") {
    let bed = await conn.models.BedSpace.findOne({
      $or: [{ bedNumber: /^\dB/ }, { bedNumber: /^\dS/ }],
      bedStatus: "vacant",
      location: campusLocation,
      roomType: sex,
    }).session(session);
    if (bed) {
      return bed;
    }
    return null;
  }

  if (levelType == "other years") {
    //tie down a random room here
    let bed = await conn.models.BedSpace.findOne({
      $or: [{ bedNumber: /^\dB/ }, { bedNumber: /^\dS/ }],
      bedStatus: "vacant",
      location: campusLocation,
      roomType: sex,
    }).session(session);
    if (bed) {
      return bed;
    }
  }
};

export const findSpaceByLevel = async (student, session, conn) => {
  const { levelType, sex } = student;
  if (levelType === "final year") {
    let bed = await conn.models.BedSpace.findOne({
      $or: [{ bedNumber: /^\dA/ }, { bedNumber: /^\dS/ }],
      bedStatus: "vacant",
      roomType: sex,
      bedStatusType: "normal",
    }).session(session);
    if (bed) {
      return bed;
    }
    return null;
  }

  if (levelType === "first year") {
    let bed = await conn.models.BedSpace.findOne({
      $or: [{ bedNumber: /^\dB/ }, { bedNumber: /^\dS/ }],
      bedStatus: "vacant",
      roomType: sex,
      bedStatusType: "normal",
    }).session(session);
    if (bed) {
      return bed;
    }
    return null;
  }

  if (levelType == "other years") {
    //tie down a random room here
    let bed = await conn.models.BedSpace.findOne({
      $or: [{ bedNumber: /^\dB/ }, { bedNumber: /^\dS/ }],
      bedStatus: "vacant",
      roomType: sex,
      bedStatusType: "normal",
    }).session(session);
    if (bed) {
      return bed;
    }
  }
};

export const searchVacantRoomByType = async (sex, conn) => {
  const criteria = {
    roomType: sex,
    bedStatus: "vacant",
  };
  const vacantBeds = await conn.models.BedSpace.find(criteria);

  return vacantBeds;
};

export const searchSpecialRoomType = async (
  sex,
  hostelId,
  studentLevel,
  session,
  conn
) => {
  //get all the hostels saved as special room

  let bed;
  switch (studentLevel) {
    case studentLevel === "final year":
      bed = await conn.models.BedSpace.findOne({
        hallId: hostelId,
        bedStatus: "vacant",
        roomType: sex,
        $or: [{ bedNumber: /^\dS/ }, { bedNumber: /^\dA/ }],
        bedStatusType: "special",
      }).session(session);
      break;
    case studentLevel === "other years":
      bed = await conn.models.BedSpace.findOne({
        hallId: hostelId,
        bedStatus: "vacant",
        roomType: sex,
        $or: [{ bedNumber: /^\dS/ }, { bedNumber: /^\dB/ }],
        bedStatusType: "special",
      }).session(session);
      break;
    default:
      bed = await conn.models.BedSpace.findOne({
        hallId: hostelId,
        bedStatus: "vacant",
        roomType: sex,
        bedStatusType: "special",
      }).session(session);
      break;
  }

  return bed;
};

const _returnLevels = (level, duration, entryMode) => {
  let levelSplit;
  const splitLevelString = level[0];
  switch (entryMode.toLowerCase()) {
    case "direct entry":
      if (+duration == +splitLevelString) {
        levelSplit = "final year";
      } else if (+splitLevelString == +duration - (duration - 2)) {
        levelSplit = "first year";
      } else {
        levelSplit = "other years";
      }
      break;
    case "utme":
      if (+duration == +splitLevelString) {
        levelSplit = "final year";
      } else if (+splitLevelString == duration - (duration - 1)) {
        levelSplit = "first year";
      } else {
        levelSplit = "other years";
      }
      break;
    default:
      break;
  }

  return levelSplit;
};

export const getLevelExplanation = ({
  studentLevel,
  programDuration,
  entryMode,
}) => {
  return _returnLevels(studentLevel, programDuration, entryMode);
};

export const checkAvailableSpace = async ({ level, faculty, conn }) => {
  const activeSession = await conn.models.SessionTable.findOne({
    active: true,
  });
  const facultyAllocation = activeSession.facultyAllocation;
  const levelAllocation = activeSession.levelAllocation;
  //get the student faculty data
  const facultyData = facultyAllocation.find((fac) => {
    return fac.facultyName.toLowerCase() == faculty.toLowerCase();
  });

  if (!facultyData) {
    //return saying no allocation for your faculty
    throw new Error(`No hostel allocation reserved for ${faculty} students.`);
  }

  const levelData = levelAllocation.find((ele) => {
    return ele.level.toLowerCase() == level.toLowerCase();
  });

  //check the level if there is still available space for the person
  let hasSpace;
  if (
    levelData.totalAllocation > levelData.totalOccupied &&
    facultyData.totalAllocation > facultyData.totalOccupied
  ) {
    //increment here
    hasSpace = true;
  } else {
    //no more available space
    hasSpace = false;
  }

  //returning an annonymous function here

  return () => {
    return {
      sessionData: activeSession,
      levelData: levelData,
      facultyData: facultyData,
      hasSpace,
    };
  };
};

export const incrementRoomStats = async ({
  levelData,
  facultyData,
  sessionData,
  session,
  conn,
}) => {
  //get active session from cache
  const { facultyAllocation, levelAllocation, _id } = sessionData;
  let facultyArray = [];
  let levelArray = [];
  facultyAllocation.map((fac) => {
    if (
      fac.facultyName.toLowerCase() == facultyData.facultyName.toLowerCase()
    ) {
      //increment the value
      fac.totalOccupied = fac.totalOccupied + 1;
    }
    facultyArray.push(fac);
  });

  levelAllocation.map((ele) => {
    if (ele.level.toLowerCase() == levelData.level.toLowerCase()) {
      //increment the value
      ele.totalOccupied = ele.totalOccupied + 1;
    }
    levelArray.push(ele);
  });

  //update the session data here with the new allocation remaining
  await conn.models.SessionTable.updateOne(
    { _id },
    { levelAllocation: levelArray, facultyAllocation: facultyArray }
  ).session(session);

  // await sessionData
  //   .updateOne({ levelAllocation: levelArray, facultyAllocation: facultyArray })
  //   .session(session);
};

export const specialHostelCheck = async (student, session, conn) => {
  //get all hostels mark as special
  const { faculty, currentLevel } = student;
  const specialHostel = await conn.models.Hostel.find({
    status: "special",
  }).session(session);

  //find if the student is the one that are to stay in a special hostel

  //loop and find if the student is among those belongs
  //to the special consideration group

  let eligibleHostel = null;
  specialHostel.map((hostel) => {
    //check the occupiedByArray if the student qualifies;
    hostel.map(({ facultyName, levels }) => {
      let foundEligibleHostel = false;

      if (facultyName.toLowerCase() === faculty.toLowerCase()) {
        foundEligibleHostel = true;
      }
      levels.map((level) => {
        if (level.toLowerCase() === currentLevel.toLowerCase()) {
          if (foundEligibleHostel) {
            eligibleHostel = hostel;
            return eligibleHostel;
          }
        }
      });
    });
  });

  if (eligibleHostel) {
    return {
      hostel: eligibleHostel,
      eligible: true,
    };
  }

  return null;
};

export const getReservedBedDetails = async (bedId, conn) => {
  const bed = await conn.models.BedSpace.findOne({ _id: bedId });
  return bed;
};
