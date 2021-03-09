import methods from "../methods";

export default {
  Query: {
    users: async (parent, args, { fastConn }) => {
      return await fastConn.models.User.find();
    },
    user: async (parent, { id }, { fastConn }) => {
      return await fastConn.models.User.findOne(id);
    },
    me: (parent, args, { me }) => {
      return me;
    },
    loginUser: async (
      parent,
      { regNumber, password, email },
      { fastConn, config }
    ) => {
      const userDetails = {
        regNumber,
        password,
        email,
      };
      const user = await methods.userMethod.loginUser(userDetails, {
        conn: fastConn,
        config,
      });

      return user;
    },
  },
  Mutation: {
    createUser: async (user, { username }, { fastConn }) => {
      const newUser = new fastConn.models.User({
        username,
      });
      await newUser.save();
      return newUser;
    },
  },
  LoginUserResult: {
    __resolveType(obj) {
      if (obj.type) {
        return "Error";
      }
      if (obj.name) {
        return "User";
      }
    },
  },
};
