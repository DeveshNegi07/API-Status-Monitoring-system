const express = require("express");
const router = express.Router();

const {
  getStats,
  getUptimeOverTime,
} = require("../controllers/statsController");

router.get("/", getStats);

router.get("/uptimeovertimegraph", getUptimeOverTime);

module.exports = router;
