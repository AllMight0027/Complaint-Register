const express = require("express");
const router = express.Router();

const { getUserById } = require("../controllers/user");
const {
  isSignedIn,
  isAuthenticated,
  isAdmin,
  isTechnician,
} = require("../controllers/auth");
const {
  getAllComplaints,
  getComplaint,
  getComplaintById,
  postComplaint,
  updateComplaint,
  deleteComplaint,
} = require("../controllers/complaint");

//middleware to get userId param and populate req.profile
router.param("userId", getUserById);

//middleware to get complaintId param
router.param("complaintId", getComplaintById);

//get category by id
router.get("/:complaintId", isSignedIn, isAuthenticated, getComplaint);

//post a category
router.post("/create/:userId", isSignedIn, postComplaint);

//get all categories
router.get("/all/:userId", isSignedIn, isAuthenticated, getAllComplaints);

//update a category
router.put(
  "/update/:complaintId/:userId",
  isSignedIn,
  isAuthenticated,
  isTechnician,
  updateComplaint
);

//dalete a category
router.delete(
  "/delete/:complaintId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteComplaint
);

module.exports = router;
