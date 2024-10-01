const express = require("express");
const connectDB = require("./config/database");
const app = express();

const cors = require("cors");
const { signupValidation } = require("./utils/Validation");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use(
  cors({
    origin: "http://localhost:5173", //You need to whitelist the domain to avoid Cors
    credentials: true,
  })
);
app.options("*", cors());

app.use(express.json());
app.use(cookieParser());
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Database connection established");

    app.listen(4000, () => {
      console.log("Server is listening on port 4000");
    });
  })
  .catch((err) => {
    console.error("Database connection not established ");
  });
