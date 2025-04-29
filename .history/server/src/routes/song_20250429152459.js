const express = require("express");

const controller = require("../controllers/songs");
const validateMongoId = require("../middleware/validateMongoId");
const authenicateWithJwt = require("../middleware/authenticateWithJwt");
const validatePaginateQueryParams = require("../middleware/validatePaginateQueryParams");
const Song = require("");

const router = express.Router();

// List all, and create task are protected routes
router
  .route("/") //
  .all(authenicateWithJwt)
  .get(validatePaginateQueryParams, controller.list)
  .post(controller.create);

// Get particular task is unprotected
router.route("/:id").all(validateMongoId("id")).get(controller.detail);

// Update and delete task is protected
router
  .route("/:id")
  .all(authenicateWithJwt)
  .all(validateMongoId("id"))
  .put(controller.update)
  .delete(controller.delete);

module.exports = router;
