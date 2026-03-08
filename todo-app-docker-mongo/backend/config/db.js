// config/db.js
// Kết nối MongoDB với Mongoose
const mongoose = require("mongoose");

let retries = 5;
const connectDB = async () => {
  while (retries) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      console.log(`📊 Database: ${conn.connection.name}`);
      break;
    } catch (error) {
      console.error(
        `❌ MongoDB Connection Error (${retries} retries left): ${error.message}`,
      );
      retries -= 1;
      if (retries === 0) {
        process.exit(1);
      }
      // Wait 3s before retrying
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
};

module.exports = connectDB;
