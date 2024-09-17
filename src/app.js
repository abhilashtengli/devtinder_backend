const express = require("express");

const app = express();

app.delete("/user", (req, res) => {
  res.send("User data deleted successfully!");
});

app.get("/user", (req, res) => {
  res.send({
    firstName: "Abhilash",
    lastName: "Tengli",
  });
});

app.post("/user", (req, res) => {
  res.send("Data saved successfully!");
});

app.listen(4000, () => {
  console.log("Server is listening on port 4000");
});
