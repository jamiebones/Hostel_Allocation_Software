import mongoose from "mongoose";
import models from "../models";
import bcrypt from "bcrypt";
import util from "../utils";
import config from "../config";
let saltRounds = 10;

const { DB_HOST, DB_PORT, DB_USER, DB_DATABASE, DB_PASSWORD } = process.env;

const collectionNames = [
  "rooms",
  "bedspaces",
  "confirmphonenumbers",
  "hostels",
  "adminroomallocations",
  "studentbios",
  "bedspaceallocations",
  "users",
  "messages",
  "faculties",
  "transactions",
  "onholdbeds",
  "sessiontables",
  "confirmphonetables",
  "departments",
];
class DbConnection {
  constructor() {
    this._connect();
    this._createAdmin();
    this._createDepartmentsAndFaculties();
    this._uploadStudentData();
  }

  async _createAdmin() {
    try {
      const findAdmin = await models.User.findOne({
        email: "jamiebones147@gmail.com",
      });

      if (findAdmin) {
        console.log("admin is found");
      } else {
        const hash = await bcrypt.hash("blazing147", saltRounds);
        const admin = {
          email: "jamiebones147@gmail.com",
          password: hash,
          accessLevel: "super-admin",
          userType: "staff",
        };
        const adminUser = new models.User(admin);
        await adminUser.save();
        console.log("admin saved");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async _connect() {
    try {
      let url;
      url = `mongodb://mongo1:27017,mongo2:27018,mongo3:27019/${DB_DATABASE}`;
      // mongodb://<HOSTNAME>:27017,<HOSTNAME>:27018,<HOSTNAME>:27019/<DBNAME>
      if ( process.env.NODE_ENV === "production"){
       // url = `mongodb://admin:blazing147server@mongo1:27017,mongo2:27018,mongo3:27019/${DB_DATABASE}`
      }
      const connection = await mongoose.connect(url, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true,
        keepAlive: true,
        //authSource: "admin",

        replicaSet: "rs0",
      });

      const conn = mongoose.connection;

      const collectionArray = await conn.db.listCollections().toArray();

      collectionArray.map((collection) => {
        const colName = collection.name;
        //check the index in the collection array
        const collectionIndex = collectionNames.indexOf(colName);

        if (collectionIndex === -1) {
          switch (colName) {
            case "rooms":
              models.Room.createCollection();
              break;
            case "bedspaces":
              models.BedSpace.createCollection();
              break;
            case "confirmphonenumbers":
              models.ConfirmPhoneNumber.createCollection();
              break;
            case "hostels":
              models.Hostel.createCollection();
              break;
            case "adminroomallocations":
              models.AdminRoomAllocation.createCollection();
              break;
            case "studentbios":
              models.StudentBio.createCollection();
              break;
            case "bedspaceallocations":
              models.BedSpaceAllocation.createCollection();
              break;
            case "users":
              models.User.createCollection();
              break;
            case "messages":
              models.Message.createCollection();
              break;
            case "faculties":
              models.Faculty.createCollection();
              break;
            case "transactions":
              models.Transaction.createCollection();
              break;
            case "onholdbeds":
              models.OnHoldBed.createCollection();
              break;
            case "sessiontables":
              models.SessionTable.createCollection();
              break;
            case "departments":
              models.Department.createCollection();
              break;
          }
        }
      });
      console.log("connection to database successful");
      return connection;
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

      //stringinfy the content before saving
      // const stringifyDepts = JSON.stringify(departments);
      // const stringifyFac = JSON.stringify(faculties);

      // await config.redisClient.setAsync("departments", stringifyDepts);
      // await config.redisClient.setAsync("faculties", stringifyFac);

      console.log("departments and faculties inserted into database");
    }
  }

  async _uploadStudentData() {
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

export default new DbConnection();
