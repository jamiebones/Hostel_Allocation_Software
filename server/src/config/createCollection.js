import conn from "../connections";
import models from "../models";

const collectionArray = await conn.fastConn.db.listCollections().toArray();

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
