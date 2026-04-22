import mongoose from "mongoose";
import { Transaction } from "../models/Transaction.js";
import { INCOME_CATEGORY } from "../utils/constants.js";

export const createTransaction = async (req, res) => {
  try {
    const { type, amount, category, date, description } = req.body;

    if (!type || amount === undefined || amount === null || !date) {
      return res
        .status(400)
        .json({ message: "Type, amount, and date are required." });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({ message: "Invalid transaction type." });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({ message: "Amount must be greater than zero." });
    }

    if (type === "expense" && !category) {
      return res.status(400).json({ message: "Expense category is required." });
    }

    const transaction = await Transaction.create({
      userId: req.user._id,
      type,
      amount: Number(amount),
      category: type === "income" ? INCOME_CATEGORY : category,
      date,
      description: description?.trim() ?? "",
    });

    return res.status(201).json(transaction);
  } catch (error) {
    return res.status(400).json({ message: "Unable to create transaction." });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({
      date: -1,
      createdAt: -1,
    });

    return res.json(transactions);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch transactions." });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid transaction id." });
    }

    const transaction = await Transaction.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found." });
    }

    return res.json({ message: "Transaction deleted." });
  } catch (error) {
    return res.status(500).json({ message: "Unable to delete transaction." });
  }
};
