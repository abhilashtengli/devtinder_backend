const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { signupValidation } = require("../utils/Validation");
const validator = require("validator");

// const User_safe_data = "firstName lastName age skills gender photoUrl about";
const User_safe_data = [
  "firstName",
  "lastName",
  "age",
  "skills",
  "gender",
  "photoUrl",
  "about",
];

authRouter.post("/signup", async (req, res) => {
  try {
    signupValidation(req);
    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    const dataToSend = User_safe_data.reduce((obj, key) => {
      if (user[key] !== undefined) {
        obj[key] = user[key];
      }
      return obj;
    }, {});

    res.send(dataToSend);
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid email address : " + emailId);
    }

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 36000000),
      });

      const dataToSend = User_safe_data.reduce((obj, key) => {
        if (user[key] !== undefined) {
          obj[key] = user[key];
        }
        return obj;
      }, {});

      res.send(dataToSend);
    } else {
      throw new Error("Invalid Credentials Ps");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send(" You've been logged out");
});

module.exports = authRouter;
