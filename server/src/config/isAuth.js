import jwt from "jsonwebtoken";
import keys from "./keys";

export default (req) => {
  //const token = req.headers.authorization || "";
  const authHeader = req.headers.authorization || "";

  if (!authHeader) {
    return null;
  }
  const token = authHeader.split(" ")[1];
  if (!token || token === "") {
    return null;
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, keys.secret);
  } catch (error) {
    return null;
  }

  if (!decodedToken) {
    return null;
  }
  const { id, email, regNumber, accessLevel, active, userType } = decodedToken;

  if (!active) {
    return null;
  }

  return {
    id,
    email,
    regNumber,
    accessLevel,
    active,
    userType
  };
};
