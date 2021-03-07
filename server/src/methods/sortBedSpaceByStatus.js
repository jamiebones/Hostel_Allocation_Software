import models from "../models"

export default async () => {
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
    const totalSpace = await models.BedSpace.aggregate(pipeline);
    return totalSpace;
  };