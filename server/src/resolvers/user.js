import methods from "../methods";
import { combineResolvers } from "graphql-resolvers";
import {
  isAuthenticated,
  isAdmin,
  isSuperAdmin,
  isStudent,
} from "./authorization";
import _ from "lodash";
import bcrypt from "bcrypt";
const saltRounds = 10;

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
    searchStudentAccount: combineResolvers(
      isAuthenticated,
      isSuperAdmin,
      async (parent, { regNumber }, { fastConn }) => {
        const users = await fastConn.models.User.find({
          regNumber: { $regex: regNumber, $options: "i" },
        }).limit(100);
        return users;
      }
    ),
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
    createStaffUserAccountByAdmin: combineResolvers(
      isAuthenticated,
      isSuperAdmin,
      async (parent, { email, password, role, name }, { fastConn }) => {
        //find if we have an account with that email
        const findAccount = await fastConn.models.User.findOne({
          email: email.toLowerCase(),
        });

        if (findAccount) {
          throw new Error(
            `An account with email: ${email} already exists. Please use another email address`
          );
        }
        const hash = await bcrypt.hash(password, saltRounds);
        await fastConn.models.User.create([
          {
            email: email.toLowerCase(),
            password: hash,
            userType: "staff",
            accessLevel: role,
            name: name,
            active: true,
          },
        ]);
        return true;
      }
    ),
    activateDeactivateUser: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (parent, { userId }, { fastConn }) => {
        const updateUser = await fastConn.models.User.findOne({ _id: userId });
        updateUser.active = !updateUser.active;
        await updateUser.save();
        return true;
      }
    ),
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
