
export default (db) => {
  const schemas = [
    "AdminRoomAllocation",
    "BedSpace",
    "BedSpaceAllocation",
    "ConfirmPhoneNumber",
    "Department",
    "Faculty",
    "Hostel",
    "Message",
    "OnHoldBed",
    "Room",
    "SessionTable",
    "StudentBio",
    "Transaction",
    "User"
  ];
  for (const schema of schemas) {
    const schemaInLowerForm = schema[0].toLowerCase() + schema.substr(1,schema.length)
    db.model(schema, import (`./${schemaInLowerForm}.js`));
  }
  return db;
};
