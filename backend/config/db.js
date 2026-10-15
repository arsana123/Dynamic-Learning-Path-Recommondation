import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/dynamic-learning-path";
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("\n❌ Could not connect to MongoDB at:", uri.replace(/\/\/.*@/, "//<hidden>@"));
    console.error("   Reason:", err.message);
    console.error("\n   Fix it with ONE of these:");
    console.error("   1) Start local MongoDB (install MongoDB Community, then run `mongod`)");
    console.error("   2) Run with Docker:  docker compose up -d   (from the project root)");
    console.error("   3) Use MongoDB Atlas (free) and paste its connection string into backend/.env as MONGO_URI\n");
    process.exit(1);
  }
};

export default connectDB;
