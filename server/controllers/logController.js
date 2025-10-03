const TracerLog = require("../models/tracerLogModel");

const createLog = async (req, res) => {
  const {
    apiName,
    statusCode,
    responseTime,
    httpMethod,
    endpoint,
    timestamp,
    consoleData,
  } = req.body;

  try {
    const tracerLogData = await TracerLog.create({
      apiName,
      statusCode,
      responseTime,
      httpMethod,
      endpoint,
      timestamp,
      consoleData,
    });
    res.status(201).json(tracerLogData);
  } catch (error) {
    res.status(400).json({ Error: error.message });
  }
};

const getLog = async (req, res) => {
  try {
    const tracerLogData = await TracerLog.find({}).sort({ timestamp: -1 });
    res.status(200).json(tracerLogData);
  } catch (error) {
    res.status(400).json({ Error: error.message });
  }
};

module.exports = { createLog, getLog };
