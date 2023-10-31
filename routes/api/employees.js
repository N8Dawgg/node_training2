const express = require("express");
const router = express.Router();
const employeeController = require("../../controllers/employeeController.js");
const ROLES_LIST = require("../../config/rolesList.js");
const verifyRoles = require("../../middleware/verifyRoles.js");

router
  .route("/")
  .get(employeeController.getAllEmployees) //verifyJWT is checked first
  .post(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    employeeController.createNewEmployee
  )
  .put(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    employeeController.updateEmployee
  )
  .delete(verifyRoles(ROLES_LIST.Admin), employeeController.deleteEmployee);

router.route("/:id").get(employeeController.getEmployee);

module.exports = router;
