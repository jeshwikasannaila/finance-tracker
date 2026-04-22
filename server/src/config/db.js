import mongoose from "mongoose";

export const connectDatabase = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not configured.");
  }

  if (mongoUri.includes("YOUR_REAL_PASSWORD")) {
    throw new Error(
      "MONGO_URI still contains the placeholder password. Update server/.env with a real MongoDB password or switch to a local MongoDB URI."
    );
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");
};
