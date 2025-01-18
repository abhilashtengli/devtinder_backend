const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
   process.env.mongoURL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );
};

module.exports = connectDb;
