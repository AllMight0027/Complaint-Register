const express = require("express");
const router = express.Router();

const {
  getUser,
  getUserById,
  deleteUser,
  updateUser,
  getAllUser,
  getUserByPhone,
} = require("../controllers/user");
const {
  isSignedIn,
  isAuthenticated,
  isAdmin,
  isHelpDesk,
} = require("../controllers/auth");

//middleware to get param and populate req.ptofile
router.param("userId", getUserById);

//route to get user by id
router.get("/:userId", isSignedIn, getUser);

//route to get all users
router.get("/all/:userId", isSignedIn, isAuthenticated, isAdmin, getAllUser);

//route to get all users
router.post(
  "/helpdesk/:userId",
  isSignedIn,
  isAuthenticated,
  isHelpDesk,
  getUserByPhone
);

//route to get all users
router.get("/lco/all", getAllUser);

//route to delete user by id
router.delete("/:userId", isSignedIn, isAuthenticated, deleteUser);

//route to update user by id
router.put("/:userId", isSignedIn, isAuthenticated, updateUser);

module.exports = router;
