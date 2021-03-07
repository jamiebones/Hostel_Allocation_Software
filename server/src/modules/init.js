import dbConn from "../connections";
import bcrypt from "bcrypt";
import util from "../utils";
let saltRounds = 10;


class InitTask {
  constructor() {
    this._createAdmin();
    this._createDepartmentsAndFaculties();
    this._uploadStudentData()
  }

  async _createAdmin() {
    try {
      const findAdmin = await dbConn.fastConn.models.User.findOne({
        email: "jamiebones147@gmail.com",
      });

      if (findAdmin) {
        console.log("admin is found. no need creating admin again");
      } else {
        const hash = await bcrypt.hash("blazing147", saltRounds);
        const admin = {
          email: "jamiebones147@gmail.com",
          password: hash,
          accessLevel: "super-admin",
          userType: "staff",
          name: "James Oshomah",
        };
        const adminUser = new dbConn.fastConn.models.User(admin);
        await adminUser.save();
        console.log("admin saved");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async _createDepartmentsAndFaculties() {
    const findDept = await models.Department.findOne({});
    const findFaculty = await models.Faculty.findOne({});
    if (!findDept && !findFaculty) {
      const departments = util.Departments;
      const faculties = util.Faculties;
      Promise.all([
        await models.Department.insertMany(departments),
        await models.Faculty.insertMany(faculties),
      ]);
      console.log("departments and faculties inserted into database");
    }
  }

  async _uploadStudentData() {
    const findStudent = await dbConn.fastConn.models.StudentBio.findOne({});
    if (!findStudent) {
      let savedRecords = 0;
      const students = util.StudentData;
      const currentSession = "2019/2020";
      const levels = {
        1: "100 level",
        2: "200 level",
        3: "300 level",
        4: "400 level",
        5: "500 level",
        6: "600 level",
      };
      //loop through and insert the data into the database
      students.map((student) => {
        const {
          regNumber,
          studentName,
          duration,
          entryMode,
          admissionYear,
          sex,
          department,
          faculty,
          phoneNumber,
          nextOfKinAddress,
          nextOfKinPhone,
          nextOfKinName,
          passport,
          email,
        } = student;
        const newStudentBio = new dbConn.fastConn.models.StudentBio();

        let studentEntryMode;

        switch (entryMode) {
          case "DE(JUPEB)":
            studentEntryMode = "direct entry";
            break;
          case "UTME":
            studentEntryMode = "utme";
            break;
          case "Transfer (Intra)":
            studentEntryMode = "utme";
            break;
          case "Direct-Entry":
            studentEntryMode = "direct entry";
            break;
          case "UTME (Pre-Degree)":
            studentEntryMode = "utme";
            break;
          case "Transfer (Inter-DE)":
            studentEntryMode = "direct entry";
            break;
          default:
            studentEntryMode = "utme";
            break;
        }

        const splitCurrentSession = currentSession.split("/")[1];
        let level = +splitCurrentSession - +admissionYear;
        let studentLevel;

        if (studentEntryMode === "direct entry") {
          level = level + 1;
        }

        if (level >= +duration) {
          studentLevel = duration;
        } else {
          studentLevel = level;
        }

        const currentLevel = levels[studentLevel.toString()];

        newStudentBio.regNumber = regNumber;
        newStudentBio.email = email;
        newStudentBio.sex = sex === "M" ? "male" : "female";
        newStudentBio.name = studentName;
        newStudentBio.dept = department;
        newStudentBio.faculty = faculty;
        newStudentBio.programDuration = duration;
        newStudentBio.phoneNumber = phoneNumber;
        newStudentBio.currentLevel = currentLevel;
        newStudentBio.currentSession = currentSession;
        newStudentBio.nextofKin = {
          name: nextOfKinName,
          address: nextOfKinAddress,
          phone: nextOfKinPhone,
        };
        newStudentBio.entryMode = studentEntryMode;
        //const passport = "http://uniuyo.edu.ng/eportals/passports/";
        newStudentBio.profileImage = passport;
        newStudentBio.save();
        savedRecords++;
      });
      console.log("records saved", savedRecords);
    }
  }
}

export default new InitTask();
