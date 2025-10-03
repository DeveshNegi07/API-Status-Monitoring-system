const apiConfig = require("../models/apiConfigModel");

const getAllConfig = async (req, res) => {
  try {
    const configData = await apiConfig.find().sort({ startDate: -1 });
    res.status(200).json(configData);
  } catch (error) {
    res.status(400).json({ Error: error.message });
  }
};

const getConfigByApiName = async (req, res) => {
  const apiName = req.params.apiName;
  try {
    const configData = await apiConfig.findOne({ apiName });
    res.status(200).json(configData);
  } catch (error) {
    res.status(400).json({ Error: error.message });
  }
};

const createConfig = async (req, res) => {
  const { apiName, startDate } = req.body;
  try {
    const configData = await apiConfig.create({ apiName, startDate });
    res.status(201).json(configData);
  } catch (error) {
    res.status(400).json({ Error: error.message });
  }
};

const updateConfig = async (req, res) => {
  const id = req.params.id;
  try {
    const configData = await apiConfig.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(configData);
  } catch (error) {
    res.status(400).json({ Error: error.message });
  }
};

module.exports = {
  getAllConfig,
  createConfig,
  updateConfig,
  getConfigByApiName,
};
