import models from "../../models";
import config from "../../config/";
import bedSpaceMethods from "../bedspace";

const { getLevelExplanation } = bedSpaceMethods.common;

export default async (student, session) => {
  const {
    regNumber,
    dept,
    currentLevel,
    currentSession,
    faculty,
    programDuration,
    entryMode
  } = student;

  //get the current active session in the database
  let departments;
  departments = await config.redisClient.getAsync("departments");

  let faculties;
  faculties = await config.redisClient.getAsync("faculties");

  if (!departments) {
  //set department here in cache
  const departmentsToSave = await _getDepartments();
  if (departmentsToSave) {
  const dataToSave = JSON.stringify(departmentsToSave);
  await config.redisClient.setAsync("departments", dataToSave);
  }
  } else {
    departments = JSON.parse(departments);
  }

  if (!faculties) {
    //set department here in cache
    const facultiesToSave = await _getFaculties();
    if (facultiesToSave) {
      const dataToSave = JSON.stringify(facultiesToSave);
      await config.redisClient.setAsync("faculties", dataToSave);
    }
  } else {
    faculties = JSON.parse(faculties);
  }

  let activeSession;

  activeSession = await config.redisClient.getAsync("activeSession");

  if (!activeSession) {
    //set department here in cache
    const activeSessionTosave = await _getActiveSession();
    if (activeSessionTosave) {
      const dataToSave = JSON.stringify(activeSessionTosave);
      await config.redisClient.setAsync("activeSession", dataToSave);
    } else {
      //we can not find an active session. we report an error to abort procedings
      throw new Error("No active session enabled. Please contact admin.");
    }
  } else {
    activeSession = JSON.parse(activeSession);
  }

  //else we need to update the student level


  let studentLevel = currentLevel.split(" ")[0].split("")[0];
  let newLevel;
  if (programDuration == studentLevel) {
    throw new Error(
      `${regNumber} should have graduated`
    );
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
  //save the student data and insert it into the cache here
  const levelType = getLevelExplanation({
    studentLevel: newLevel,
    entryMode: entryMode,
    programDuration: programDuration,
  });

  console.log("levelType: ", levelType )

  const studentFaculty = faculties.find((currentIndex) => {
    return currentIndex.facultyName.toLowerCase() == faculty.toLowerCase();
  });
  //we get the level like first year final year and other years here

  const updateStudent = await models.StudentBio.findOne({
    regNumber: regNumber.toLowerCase(),
  }).session(session);

  updateStudent.currentLevel = newLevel;
  updateStudent.currentSession = activeSession.session;

  await updateStudent.save({ session: session });

  const {
    email,
    sex,
    name,
    phoneNumber,
    profileImage,
  } = updateStudent;
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
  //save the student in the redis cache
  const studentObject = JSON.stringify(newStudentObj);
  const regNumberLower = regNumber.toLowerCase();
  await config.redisClient.setAsync(regNumberLower, studentObject);
  return newStudentObj;
};

const _getActiveSession = async () => {
  const session = await models.SessionTable.findOne({ active: true });
  return session;
};

const _getDepartments = async () => {
  const depts = await models.Department.find();
  return depts;
};

const _getFaculties = async () => {
  const fac = await models.Faculty.find();
  return fac;
};
