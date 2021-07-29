
export const batchUsers = async (keys, conn) => {
  const users = await conn.models.User.find({ _id: { $in: keys } });
  return keys.map((key) => users.find((user) => user.id === key));
};