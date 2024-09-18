const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://tengliabhilash:8N254BSE266jCX2I@learningnode.qiglb.mongodb.net/devTinder"
  );
};

module.exports = connectDb;
