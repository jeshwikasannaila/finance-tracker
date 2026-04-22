import mongoose from "mongoose";
import { EXPENSE_CATEGORIES, INCOME_CATEGORY } from "../utils/constants.js";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      default: INCOME_CATEGORY,
      validate: {
        validator(value) {
          if (this.type === "income") {
            return value === INCOME_CATEGORY;
          }

          return EXPENSE_CATEGORIES.includes(value);
        },
        message: "Invalid transaction category.",
      },
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 200,
    },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);
