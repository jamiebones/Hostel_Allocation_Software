import methods from "../methods";

export default {
  Query: {
    users: async (parent, args, { models }) => {
      return await models.User.find();
    },
    user: async (parent, { id }, { models }) => {
      return await models.User.findOne(id);
    },
    me: (parent, args, { me }) => {
      return me;
    },
    loginUser: async (
      parent,
      { regNumber, password, email },
      { models, config }
    ) => {
      const userDetails = {
        regNumber,
        password,
        email,
      };
      const user = await methods.userMethod.loginUser(userDetails, {
        models,
        config,
      });

      return user;
    },
  },
  Mutation: {
    createUser: async (user, { username }, { models }) => {
      const newUser = new models.User({
        username,
      });
      await newUser.save();
      return newUser;
    },
  
  },
};
