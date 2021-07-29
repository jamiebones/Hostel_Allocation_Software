import jwt from "jsonwebtoken";

const _saveRefreshToken = async (tokenData, config) => {
  //lets sign another token for the user
  delete tokenData.iat;
  delete tokenData.exp;
  const newToken = jwt.sign(tokenData, config.secret, { expiresIn: "1h" });
  //save new refresh token
  const newRefreshToken = jwt.sign(tokenData, config.refreshSecret, {
    expiresIn: "7 days",
  });
  //add the refresh token to redis
  await config.redisClient.setAsync(tokenData.id, newRefreshToken);
  return newToken;
};

export default async (req, config) => {
  const authHeader = req.headers.authorization || "";
  const userId = req.headers.identity;
  if (!authHeader && !userId) {
    //return refreshtoken and null
    return { refreshToken: null, user: null };
  }
  const token = authHeader.split(" ")[1];
  if (!token || token === "") {
    return { refreshToken: null, user: null };
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, config.secret);
    return { refreshToken: null, user: decodedToken };
  } catch (error) {
    //check here if the token has expired
    if (error.message === "jwt expired") {
      //we can apply the refresh token stuff here
      //lets refresh our token here
      const refresh_token = await config.redisClient.getAsync(userId);
      if (refresh_token) {
        //lets verify the refresh_token
        try {
          let decodeData = jwt.verify(refresh_token, config.refreshSecret);
          //lets set another token here
          const newToken = await _saveRefreshToken(decodeData, config);
          //lets sign another token for the user
          return {
            refreshToken: newToken,
            user: decodeData,
          };
        } catch (error) {
          //we have an error here maybe the refresh token has expired
          //lets return an error here and logout from the system
          await config.redisClient.delAsync(userId);
          throw new Error("logout");
        }
      } else {
        //we do not have a token for this person
        throw new Error("logout");
      }
    } else {
      //we have an invalid token logout the user from the application
      throw new Error("logout");
    }
  }
};
