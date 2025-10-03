const express = require("express");
const router = express.Router();

const {
  getAllConfig,
  createConfig,
  updateConfig,
  getConfigByApiName,
} = require("../controllers/configController");

router.get("/", getAllConfig);

router.get("/:apiName", getConfigByApiName);

router.post("/", createConfig);

router.patch("/:id", updateConfig);

module.exports = router;
