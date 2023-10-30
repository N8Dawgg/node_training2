const express = require("express");
const router = express.Router();
const path = require("path");
const employeeController = require("../../controllers/employeeController.js");

router
  .route("/")
  .get(employeeController.getAllEmployees) //verifyJWT is checked first
  .post(employeeController.createNewEmployee)
  .put(employeeController.updateEmployee)
  .delete(employeeController.deleteEmployee);

router.route("/:id").get(employeeController.getEmployee);

module.exports = router;
