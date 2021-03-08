import bcrypt from "bcrypt";
import util from "../utils";
let saltRounds = 10;

const Initialization = async (conn) => {
  new InitTask(conn);
};

export default Initialization;

class InitTask {
  constructor(conn) {
    this._createAdmin(conn);
    this._createDepartmentsAndFaculties(conn);
    this._uploadStudentData(conn);
  }

  async _createAdmin(conn) {
    try {
      const { models } = conn;
      const findAdmin = await models.User.findOne({
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
        const adminUser = new models.User(admin);
        await adminUser.save();
        console.log("admin saved");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async _createDepartmentsAndFaculties(conn) {
    const { models } = conn;
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

  async _uploadStudentData(conn) {
    const { models } = conn;
    const findStudent = await models.StudentBio.findOne({});
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
        const newStudentBio = new models.StudentBio();

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
