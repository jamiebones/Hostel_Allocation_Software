export default async (conn) => {
  const pipeline = [
    {
      $group: {
        _id: {
          bedStatus: "$bedStatus",
          roomType: "$roomType",
        },
        total: { $sum: 1 },
      },
    },
  ];
  const totalSpace = await conn.models.BedSpace.aggregate(pipeline);
  return totalSpace;
};
