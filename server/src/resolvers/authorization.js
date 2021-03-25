import { ForbiddenError } from "apollo-server";
import { skip } from "graphql-resolvers";

export const isAuthenticated = (parent, args, ctx) => {
  return ctx && ctx.user
    ? skip
    : new ForbiddenError("Not authenticated as user.");
};

export const isAdmin = (parent, args, { user }) => {
  if (user) {
    return user.accessLevel === "super-admin" || user.accessLevel === "admin"
      ? skip
      : new ForbiddenError("only an administrator can perform this task");
  } else {
    return new ForbiddenError("You must be authenticated to continue");
  }
};

export const isSuperAdmin = (parent, args, { user }) => {
  return user && user.accessLevel === "super-admin"
    ? skip
    : new ForbiddenError(
        "you must be login as a super administrator to continue."`1`
      );
};

export const isStudent = (parent, args, { user }) => {
  return user && user.userType === "student"
    ? skip
    : new ForbiddenError("only a student can perform this task.");
};
