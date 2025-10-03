const TracerLog = require("../models/tracerLogModel");

const getApiStatus = async (req, res) => {
  const apiName = req.params.apiName;
  const { from, to } = req.query;
  try {
    let fromDate, toDate;

    if (from) {
      fromDate = new Date(from); // e.g. 2025-09-27 → 2025-09-27T00:00:00.000Z
    }

    if (to) {
      toDate = new Date(to);
      // Move to end of day 23:59:59.999
      toDate.setHours(23, 59, 59, 999);
    }

    const filter = { apiName };
    if (fromDate || toDate) {
      filter.timestamp = {};
      if (fromDate) filter.timestamp.$gte = fromDate;
      if (toDate) filter.timestamp.$lte = toDate;
    }

    const data = await TracerLog.find(filter, {
      timestamp: 1,
      statusCode: 1,
      _id: 0,
    }).sort({ timestamp: 1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ Error: error.message });
  }
};

module.exports = getApiStatus;
