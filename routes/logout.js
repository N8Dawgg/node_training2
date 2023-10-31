const express = require("express");
const router = express.Router();
const logOutController = require("../controllers/logOutController.js");

router.put("/", logOutController.handleLogOut);

module.exports = router;
