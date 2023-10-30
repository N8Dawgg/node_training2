const express = require("express");
const router = express.Router();
const authenticationController = require("../controllers/authenticationController.js");

router.post("/", authenticationController.authenticateUsernameAndPassword);

module.exports = router;
