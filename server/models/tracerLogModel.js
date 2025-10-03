const mongoose = require("mongoose");

const tracerLogSchema = new mongoose.Schema(
  {
    apiName: {
      type: String,
      required: true,
    },
    statusCode: {
      type: Number,
      required: true,
    },
    responseTime: {
      type: Number,
      required: true,
    },
    httpMethod: {
      type: String,
      required: true,
    },
    endpoint: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      required: true,
    },
    consoleData: [
      {
        timestamp: { type: Date, required: true },
        consoleType: {
          type: String,
          required: true,
        },
        message: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = TracerLog = mongoose.model("tracerLog", tracerLogSchema);
