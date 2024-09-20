const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const bcrypt = require("bcrypt");
const { signupValidation } = require("./utils/Validation");
const validator = require("validator");
const cookieParser = require("cookie-parser");
// const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlerware/auth");
app.use(express.json());

app.use(cookieParser());
//Post
app.post("/signup", async (req, res) => {
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

    await user.save();
    res.send("User Date saved successfully");
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});

app.post("/login", async (req, res) => {
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
      res.send("Login Successful");
    } else {
      throw new Error("Invalid Credentials Ps");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established");

    app.listen(4000, () => {
      console.log("Server is listening on port 4000");
    });
  })
  .catch(() => {
    console.error("Database connection not established");
  });
