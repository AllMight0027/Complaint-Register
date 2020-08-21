const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  signout,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");
const { check, validationResult } = require("express-validator");

//Signup route
router.post(
  "/signup",
  [check("password", "Minimum length of 8").isLength({ min: 8 })],
  signup
);

//Signin route
router.post(
  "/signin",
  [check("password", "Password is required").isLength({ min: 1 })],
  signin
);

//Signout route
router.get("/signout", signout);

//Reset password route
router.put("/forgot-password", forgotPassword);
router.put("/reset-password", resetPassword);

module.exports = router;
