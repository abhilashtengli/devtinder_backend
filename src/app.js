const express = require("express");

const app = express();

app.delete("/user", (req, res) => {
  res.send("User data deleted successfully!");
});

app.get(
  "/user",
  (req, res, next) => {
    // res.send({
    //   firstName: "Abhilash",
    //   lastName: "Tengli",
    // });
    next();
  },
  (req, res, next) => {
    // res.send("2nd Response executed");
    next();
  },
  (req, res) => {
    res.send("3rd Response executed");
  }
);

app.listen(4000, () => {
  console.log("Server is listening on port 4000");
});
