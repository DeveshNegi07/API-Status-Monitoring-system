const express = require("express");
const router = express.Router();

const getApiStatus = require("../controllers/statusController");

router.get("/:apiName/status", getApiStatus);

module.exports = router;
