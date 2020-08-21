const User = require("../models/User");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const { check, validationResult } = require("express-validator");
const twilio = require("twilio");
const _ = require("lodash");

//twilio
const accountSid = "AC66e13e8feae364f1130f63b9fa48212e";
const authToken = "ce232bf4ca7daae947ec5d3b6d140ad7";
const client = new twilio(accountSid, authToken);

//signup controller
exports.signup = (req, res) => {
  User.findOne({ phone: req.body.phone })
    .then((user) => {
      if (user)
        return res.json({
          status: "Failed",
          error: "Phone number already exists",
        });
      else {
        //validation
        if (req.body.password.length < 8)
          return res.json({
            status: "Failed",
            error: "Minimum password length is 8",
          });
        if (req.body.phone.toString().length !== 10)
          return res.json({ status: "Failed", error: "Enter a valid number" });
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({
            status: "Failed",
            message: errors.array()[0].msg,
          });
        }
        //save in db
        const newUser = new User(req.body);
        newUser
          .save()
          .then((resUser) => {
            console.log(resUser);
            res.json(resUser);
          })
          .catch((err) => console.log(err));
      }
    })
    .catch((err) => console.log(err));
};

//signin controller
exports.signin = (req, res) => {
  const { phone, password } = req.body;
  User.findOne({ phone })
    .then((user) => {
      //validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({
          status: "Failed",
          message: errors.array()[0].msg,
        });
      }

      //chech if email exists in db
      if (!user)
        return res
          .status(500)
          .json({ status: "Failed", error: "Phone number is not registered" });

      //check password
      if (!user.authenticate(password))
        return res
          .status(500)
          .json({ status: "Failed", error: "Password doesn't match" });

      //create token
      const token =
        "Bearer " + jwt.sign({ _id: user._id }, process.env.SECRET).toString();

      //put token in cookies
      res.cookie("token", token);

      //send res to frontend
      const { _id, name, address, phone, role, lco, vc, stopped } = user;
      return res.status(200).json({
        token,
        user: { _id, name, address, phone, role, lco, vc, stopped },
      });
    })
    .catch((err) => console.log(err));
};

//signout controller
exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({ status: "Success", message: "Signed Out" });
};

//Reset password
exports.forgotPassword = (req, res) => {
  const { phone } = req.body;
  console.log(req.body, phone);
  User.findOne({ phone }).then((user) => {
    if (!user)
      return res
        .status(401)
        .json({ status: "Failed", error: "Phone number is not registered" });

    //create token
    const str = jwt
      .sign({ _id: user._id }, process.env.SECRET, { expiresIn: "15m" })
      .toString();

    const token = str.slice(6, 16) + str.slice(-20, -10);

    return user.updateOne({ resetLink: token }).then((user) => {
      if (user) {
        client.messages
          .create({
            body: `DEN account password reset link: ${process.env.CLIENT_URL}/authentication/reset-password/${token}`,
            to: "+91" + phone,
            from: "+18304693492",
          })
          .then((e) => {
            console.log(e.body);
            return res.status(401).json({
              message:
                "Reset Link Has Been Sent To Your Registered Mobile Number",
            });
          })
          .catch((e) => console.log(e));
      }
    });
  });
};

exports.resetPassword = (req, res) => {
  const { resetLink, newPassword } = req.body;
  if (resetLink) {
    User.findOne({ resetLink }).then((user) => {
      if (!user) {
        return res.status(400).json({
          status: "Failed",
          error: "Session Expired",
        });
      }
      user = _.extend(user, { password: newPassword, resetLink: "" });
      user.save((err, result) => {
        if (err) {
          console.log(err);
          return res
            .status(400)
            .json({ status: "Failed", error: "Password didn't reset" });
        } else {
          return res.status(200).json({
            status: "Success",
            message: "Password was updated successfully",
          });
        }
      });
    });
  } else {
    return res
      .status(401)
      .json({ status: "Failed", error: "Authentication Error" });
  }
};

//middlewares
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});

exports.isAuthenticated = (req, res, next) => {
  let checker = req.process && req.auth && req.process._id == req.auth._id;
  if (checker)
    return res.status(403).json({ status: "Failed", error: "Access Denied" });
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role !== 2)
    return res
      .status(403)
      .json({ status: "Failed", error: "Admin Access Denied" });
  next();
};

exports.isTechnician = (req, res, next) => {
  if (req.profile.role === 0)
    return res
      .status(403)
      .json({ status: "Failed", error: "Technician Access Denied" });
  next();
};

exports.isHelpDesk = (req, res, next) => {
  if (req.profile.role !== 1.5)
    return res
      .status(403)
      .json({ status: "Failed", error: "Admin Access Denied" });
  next();
};
