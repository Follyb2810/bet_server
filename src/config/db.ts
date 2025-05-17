import mongoose from "mongoose";

export const connectDb = async (): Promise<any> => {
  try {
    mongoose.set("strictQuery", true);

    const db = await mongoose.connect(
      "mongodb://follyb:follyb2810@localhost:27017/",
      {
        authSource: "admin",
      }
    );

    console.log("db is connected");
    return db;
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};
