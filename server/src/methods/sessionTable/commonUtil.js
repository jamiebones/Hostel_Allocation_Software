export const getActiveSession = async (conn) => {
  const session = await conn.models.SessionTable.findOne({ active: true });
  return session;
};
