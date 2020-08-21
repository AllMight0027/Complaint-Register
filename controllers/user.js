const User = require("../models/User");

//extract user by id and populate req.profile (middleware)
exports.getUserById = (req, res, next, id) => {
  User.findById(id)
    .then((user) => {
      if (!user)
        return res
          .status(400)
          .json({ status: "Failed", message: "User id doesn't exists" });
      req.profile = user;
      next();
    })
    .catch((err) => console.log(err));
};

//throw req.profile to front end
exports.getUser = (req, res) => {
  //hiding critical info
  req.profile.salt = undefined;
  req.profile.encryptPassword = undefined;
  req.profile.updatedAt = undefined;
  req.profile.__v = undefined;
  res.status(200).json(req.profile);
};

//get all users
exports.getAllUser = (req, res) => {
  User.find()
    .then((users) => {
      if (users.length == 0)
        return res
          .status(200)
          .json({ status: "Success", message: "No users exists" });
      for (let i = 0; i < users.length; i++) {
        users[i].salt = undefined;
        users[i].encryptPassword = undefined;
        users[i].updatedAt = undefined;
        users[i].__v = undefined;
      }
      users.sort((a, b) =>
        a.name.toLowerCase() > b.name.toLowerCase()
          ? 1
          : b.name.toLowerCase() > a.name.toLowerCase()
          ? -1
          : 0
      );
      res.status(200).json(users);
    })
    .catch((err) => console.log(err));
};

//get user by phone
exports.getUserByPhone = (req, res) => {
  User.findOne({ phone: req.body.phone })
    .then((user) => {
      if (!user)
        return res.status(200).json({
          status: "Success",
          error: "No user registered with this phone number",
        });

      user.salt = undefined;
      user.encryptPassword = undefined;
      user.updatedAt = undefined;
      user.__v = undefined;
      res.status(200).json(user);
    })
    .catch((err) => console.log(err));
};

//update user by id
exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false }
  )
    .then((user) => {
      if (!user)
        return res
          .status(400)
          .json({ status: "Failed", message: "User id doesn't exists" });
      user.salt = undefined;
      user.encryptPassword = undefined;
      user.createdAt = undefined;
      user.updatedAt = undefined;
      user.__v = undefined;
      res.status(200).json(user);
    })
    .catch((err) => console.log(err));
};

//delete a user
exports.deleteUser = (req, res) => {
  User.findByIdAndDelete({ _id: req.profile._id })
    .then((user) => {
      return res
        .status(200)
        .json({ status: "Success", message: "User Deleted" });
    })
    .catch((err) => console.log(err));
};
