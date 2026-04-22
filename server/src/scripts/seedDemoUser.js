import "../config/loadEnv.js";
import bcrypt from "bcryptjs";
import { connectDatabase } from "../config/db.js";
import { Transaction } from "../models/Transaction.js";
import { User } from "../models/User.js";

const seedDemoUser = async () => {
  await connectDatabase();

  const email = "demo@financetracker.app";
  await Transaction.deleteMany({});
  await User.deleteMany({});

  const user = await User.create({
    name: "Demo User",
    email,
    password: await bcrypt.hash("password123", 10),
    categoryLimits: [
      { category: "Rent", limit: 2500 },
      { category: "Insurance", limit: 5000 },
      { category: "Travel", limit: 1500 },
      { category: "EMI", limit: 6000 },
    ],
  });

  const now = new Date();

  await Transaction.insertMany([
    {
      userId: user._id,
      type: "income",
      amount: 100000,
      category: "Income",
      date: new Date(now.getFullYear(), now.getMonth(), 2),
      description: "Monthly salary",
    },
    {
      userId: user._id,
      type: "expense",
      amount: 2000,
      category: "Rent",
      date: new Date(now.getFullYear(), now.getMonth(), 3),
      description: "Apartment rent contribution",
    },
    {
      userId: user._id,
      type: "expense",
      amount: 4000,
      category: "Insurance",
      date: new Date(now.getFullYear(), now.getMonth(), 5),
      description: "Health insurance premium",
    },
    {
      userId: user._id,
      type: "expense",
      amount: 500,
      category: "Travel",
      date: new Date(now.getFullYear(), now.getMonth(), 9),
      description: "Cab rides",
    },
    {
      userId: user._id,
      type: "expense",
      amount: 5000,
      category: "EMI",
      date: new Date(now.getFullYear(), now.getMonth(), 12),
      description: "Laptop EMI",
    },
  ]);

  console.log("Demo user seeded");
  console.log(`Email: ${email}`);
  console.log("Password: password123");
  process.exit(0);
};

seedDemoUser().catch((error) => {
  console.error("Seeding failed", error.message);
  process.exit(1);
});
