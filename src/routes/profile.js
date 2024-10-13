const express = require("express");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlerware/auth");
const { validateProfileData } = require("../utils/Validation");
const validator = require("validator");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

profileRouter.put("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileData(req)) {
      return "Provided Data is not valid";
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).json({ error: "ERROR: " + err.message });
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("Keep Strong Password");
    }

    const isOldPasswordValid = await loggedInUser.validatePassword(oldPassword);

    if (!isOldPasswordValid) {
      throw new Error("Invalid old password");
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);

    loggedInUser.password = passwordHash;

    loggedInUser.save();
    res.send("New password saved successfully");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});
module.exports = profileRouter;
