const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // eslint-disable-next-line no-console
    console.log(`MongoDB connected with : ${conn.connection.host}`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(`MongoDB connection failed due to error - ${error.message}`);
  }
};

module.exports = connectDB;
