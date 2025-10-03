const express = require("express");
const router = express.Router();
const apiKeyAuth = require("../middleware/apiKeyAuth");

const { createLog, getLog } = require("../controllers/logController");

router.get("/", getLog);

router.post("/", apiKeyAuth, createLog);

module.exports = router;
