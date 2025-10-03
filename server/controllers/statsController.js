const TracerLog = require("../models/tracerLogModel");

const getStats = async (req, res) => {
  try {
    const stats = await TracerLog.aggregate([
      {
        $group: {
          _id: null,
          totalRequests: { $sum: 1 },
          successCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$statusCode", 200] },
                    { $lt: ["$statusCode", 300] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          errorCount: {
            $sum: {
              $cond: [{ $gte: ["$statusCode", 400] }, 1, 0],
            },
          },
          avgResponseTime: { $avg: "$responseTime" },
        },
      },
    ]);

    const { totalRequests, successCount, errorCount, avgResponseTime } =
      stats[0];
    const uptimePercentage = (successCount / totalRequests) * 100;
    const errorRate = (errorCount / totalRequests) * 100;

    //most common error
    const commonErrorLog = await TracerLog.aggregate([
      { $match: { statusCode: { $gte: 400 } } },
      { $group: { _id: "$statusCode", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    // Last downtime timestamp
    const lastDowntimeLog = await TracerLog.findOne(
      { statusCode: { $gte: 400, $lte: 599 } },
      { timestamp: 1, _id: 0 }
    ).sort({ timestamp: -1 });

    const statsData = {
      totalRequests,
      avgResponseTime,
      uptimePercentage,
      errorRate,
      mostCommonError: commonErrorLog.length > 0 ? commonErrorLog[0]._id : null,
      lastDowntimeTimestamp: lastDowntimeLog ? lastDowntimeLog.timestamp : null,
    };

    res.status(200).json(statsData);
  } catch (error) {
    res.status(400).json({ Error: error.message });
  }
};

const getUptimeOverTime = async (req, res) => {
  try {
    const graphData = await TracerLog.aggregate([
      {
        $group: {
          _id: { $dateTrunc: { date: "$timestamp", unit: "day" } },
          totalRequests: { $sum: 1 },
          successCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$statusCode", 200] },
                    { $lt: ["$statusCode", 300] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$_id" } },
          uptimePercentage: {
            $multiply: [{ $divide: ["$successCount", "$totalRequests"] }, 100],
          },
          _id: 0,
        },
      },
      { $limit: 10 },
    ]).sort({ date: 1 });
    res.status(200).json(graphData);
  } catch (error) {
    res.status(400).json({ Error: error.message });
  }
};

module.exports = { getStats, getUptimeOverTime };
