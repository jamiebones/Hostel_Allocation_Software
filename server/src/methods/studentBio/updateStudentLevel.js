import bedSpaceMethods from "../bedspace";

const { getLevelExplanation } = bedSpaceMethods.common;

export default async (student, session, conn) => {
  const {
    regNumber,
    dept,
    currentLevel,
    currentSession,
    faculty,
    programDuration,
    entryMode,
  } = student;

  const faculties = await _getFaculties(conn);
  let activeSession = await _getActiveSession(conn);
  //else we need to update the student level
  let newLevel;
  let studentLevel = currentLevel.split(" ")[0].split("")[0];

  if (!activeSession) {
    throw new Error(
      "No session is currently active. Please contact the Administrator"
    );
  }

  if (activeSession.shouldUpdateLevel) {
    if (programDuration == studentLevel) {
      throw new Error(`${regNumber} should have graduated`);
    }
    //check the last level the student was using the current session
    //before the student level is updated
    const studentSessionSplit = currentSession.trim().split("/")[1];
    const activeSessionSplit = activeSession.session.trim().split("/")[1];
    if (+activeSessionSplit > +studentSessionSplit) {
      //we need to update the student level based on the active session
      if (programDuration > studentLevel) {
        const levelDifference = activeSessionSplit - studentSessionSplit;
        newLevel = `${+studentLevel + levelDifference}00 level`;
      }
    } else if (+activeSessionSplit === +studentSessionSplit) {
      //we do not need to update anything here
      //the student is in the normal session so no increment in session

      if (programDuration > studentLevel) {
        newLevel = `${+studentLevel}00 level`;
      }
    }
  } else {
    //we probably had a strike no need to increment student level here
    newLevel = `${studentLevel}00 level`;
  }

  //save the student data and insert it into the cache here
  const levelType = getLevelExplanation({
    studentLevel: newLevel,
    entryMode: entryMode,
    programDuration: programDuration,
  });

  const studentFaculty = faculties.find((currentIndex) => {
    return currentIndex.facultyName.toLowerCase() == faculty.toLowerCase();
  });
  //we get the level like first year final year and other years here

  //update the student data here
  const updateStudent = await conn.models.StudentBio.findOne({
    regNumber: regNumber.toLowerCase(),
  }).session(session);

  updateStudent.currentLevel = newLevel;
  updateStudent.currentSession = activeSession.session;
  await updateStudent.save({ session: session });

  const { email, sex, name, phoneNumber, profileImage } = updateStudent;
  const newStudentObj = {
    regNumber: regNumber,
    email,
    sex,
    name,
    dept: dept,
    faculty: faculty,
    phoneNumber,
    currentLevel: newLevel,
    currentSession: activeSession.session,
    entryMode,
    profileImage,
    levelType,
    campusLocation: studentFaculty && studentFaculty.location,
  };

  return newStudentObj;
};

const _getActiveSession = async (conn) => {
  const session = await conn.models.SessionTable.findOne({ active: true });
  return session;
};

const _getFaculties = async (conn) => {
  const fac = await conn.models.Faculty.find();
  return fac;
};
