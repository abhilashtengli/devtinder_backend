const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());

//Post
app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User Date saved successfully");
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});

app.get("/user", async (req, res) => {
  const userEmailId = req.body.emailId;

  try {
    const users = await User.find({ emailId: userEmailId });
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//Feed API - Get/feed - get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).send("Invalid User ID");
    }

    await User.findByIdAndDelete(userId);
    res.send("User with userId " + userId + " deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.put("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;

  try {
    await User.findByIdAndUpdate({ _id: userId }, data);
    res.send("User Updated successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
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
