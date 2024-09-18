const express = require("express");
const { adminAuth, userAuth } = require("./middlerware/auth");
const app = express();

app.use("/admin", adminAuth);

app.get("/admin", (req, res, next) => {
  res.send("admin authorised");
});

app.get("/user", userAuth, (req, res, next) => {
  res.send({
    firstName: "Abhilash",
    lastName: "Tengli",
  });
});

app.get("/getAllData", adminAuth, (req, res) => {
  // throw new Error("fv");
  res.send([
    {
      firstName: "Abhilash",
      lastName: "Tengli",
      age: "26",
    },
    {
      firstName: "Rahul",
      lastName: "Kumar",
      age: "25",
    },
    {
      firstName: "Suresh",
      lastName: "shetty",
      age: "30",
    },
  ]);
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Something went wrong");
  }
});

app.listen(4000, () => {
  console.log("Server is listening on port 4000");
});
