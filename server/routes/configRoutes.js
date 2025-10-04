const express = require("express");
const router = express.Router();
const apiKeyAuth = require("../middleware/apiKeyAuth");

const {
  getAllConfig,
  createConfig,
  updateConfig,
  getConfigByApiName,
} = require("../controllers/configController");

router.get("/", getAllConfig);

router.get("/:apiName", getConfigByApiName);

router.post("/", apiKeyAuth, createConfig);

router.patch("/:id", updateConfig);

module.exports = router;
