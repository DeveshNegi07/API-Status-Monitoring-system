const mongoose = require("mongoose");

const apiConfigSchema = new mongoose.Schema(
  {
    apiName: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    apiDisabled: {
      type: Boolean,
      default: false,
    },
    tracerDisabled: {
      type: Boolean,
      default: false,
    },
    requestLimitEnabled: {
      type: Boolean,
      default: false,
    },
    limit: {
      requestNumber: { type: Number, default: 0 },
      rate: { type: String, enum: ["sec", "hour", "day"], default: "sec" },
    },
    scheduleOnOffEnabled: {
      type: Boolean,
      default: false,
    },
    onOffTime: {
      startTime: { type: String, default: "09:00" },
      endTime: { type: String, default: "12:00" },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = apiConfig = mongoose.model("apiConfig", apiConfigSchema);
