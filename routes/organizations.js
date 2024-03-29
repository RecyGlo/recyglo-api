const express = require("express");

const router = express.Router();
const auth = require("../controllers/auth");
const organizationController = require("../controllers/organization");

router.get("/", auth.checkAuth, organizationController.GET_ALL_ORGANIZATIONS);
router.get(
  "/locations",
  auth.checkAuth,
  organizationController.GET_ALL_LOCATIONS
);
router.get(
  "/:id",
  auth.checkAuth,
  organizationController.GET_SPECIFIC_ORGANIZATION
);
router.get(
  "/:id/location",
  auth.checkAuth,
  organizationController.GET_SPECIFIC_LOCATION
);
router.post("/", auth.checkAuth, organizationController.ADD_NEW_ORGANIZATION);
router.patch(
  "/:id",
  auth.checkAuth,
  organizationController.UPDATE_ORGANIZATION
);
router.delete(
  "/:id",
  auth.checkAuth,
  organizationController.DELETE_ORGANIZATION
);

module.exports = router;
