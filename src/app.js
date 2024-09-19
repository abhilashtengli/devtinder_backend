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
    console.log(userSkils);

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

app.put("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const userSkills = await User.findById(userId, "skills");
    // console.log(userSkills.skills);

    const ALLOWED_UPDATES = [
      "photoUrl",
      "age",
      "gender",
      "skills",
      "about",
      "firstName",
      "lastName",
    ];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Updates are not allowed");
    }
    const isSkillPresent = data.skills.some((k) =>
      userSkills.skills.includes(k)
    );
    if (isSkillPresent) {
      throw new Error("Some of the Skills already exist");
    }
    await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    res.send("User Updated successfully");
  } catch (err) {
    res.status(400).send("Something went wrong " + err.message);
  }
});

app.put("/updateUserByEmail", async (req, res) => {
  const email = req.body.emailId;
  const data = req.body;

  try {
    const user = await User.updateOne({ emailId: email }, data, {
      runValidators: true,
    });

    if (user.matchedCount === 0) {
      res.status(404).send("User not found with email " + emailId);
    }
    res.send("User updated successfully by emailId");
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
