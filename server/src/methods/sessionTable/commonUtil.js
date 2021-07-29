export const getActiveSession = async (conn) => {
  const session = await conn.models.SessionTable.findOne({
    active: true,
  }).lean();
  return session;
};
