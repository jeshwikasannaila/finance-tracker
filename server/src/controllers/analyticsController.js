import { Transaction } from "../models/Transaction.js";
import { User } from "../models/User.js";
import { EXPENSE_CATEGORIES } from "../utils/constants.js";

const roundToTwo = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

const getMonthRange = (offset = 0) => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + offset + 1, 1);
  return { start, end };
};

export const getSummary = async (req, res) => {
  try {
    const totals = await Transaction.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);

    const totalIncome =
      totals.find((item) => item._id === "income")?.total ?? 0;
    const totalExpenses =
      totals.find((item) => item._id === "expense")?.total ?? 0;
    const balance = totalIncome - totalExpenses;
    const savingsRate =
      totalIncome > 0 ? roundToTwo((balance / totalIncome) * 100) : 0;

    const thisMonth = getMonthRange(0);
    const lastMonth = getMonthRange(-1);

    const monthlyComparison = await Transaction.aggregate([
      {
        $match: {
          userId: req.user._id,
          type: "expense",
          date: { $gte: lastMonth.start, $lt: thisMonth.end },
        },
      },
      {
        $project: {
          amount: 1,
          bucket: {
            $cond: [{ $lt: ["$date", thisMonth.start] }, "lastMonth", "thisMonth"],
          },
        },
      },
      {
        $group: {
          _id: "$bucket",
          total: { $sum: "$amount" },
        },
      },
    ]);

    const thisMonthSpending =
      monthlyComparison.find((item) => item._id === "thisMonth")?.total ?? 0;
    const lastMonthSpending =
      monthlyComparison.find((item) => item._id === "lastMonth")?.total ?? 0;

    let spendingStatus = "No change";
    if (thisMonthSpending > lastMonthSpending) {
      spendingStatus = "Increased";
    } else if (thisMonthSpending < lastMonthSpending) {
      spendingStatus = "Decreased";
    }

    return res.json({
      totalIncome,
      totalExpenses,
      balance,
      savingsRate,
      thisMonthSpending,
      lastMonthSpending,
      spendingStatus,
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch summary analytics." });
  }
};

export const getMonthlyAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const aggregates = await Transaction.aggregate([
      {
        $match: {
          userId: req.user._id,
          date: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
    ]);

    const rows = [];
    for (let i = 5; i >= 0; i -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const label = date.toLocaleString("en-IN", {
        month: "short",
      });

      const income =
        aggregates.find(
          (item) =>
            item._id.year === year &&
            item._id.month === month &&
            item._id.type === "income"
        )?.total ?? 0;

      const expense =
        aggregates.find(
          (item) =>
            item._id.year === year &&
            item._id.month === month &&
            item._id.type === "expense"
        )?.total ?? 0;

      rows.push({
        label,
        income,
        expense,
      });
    }

    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch monthly analytics." });
  }
};

export const getCategoryAnalytics = async (req, res) => {
  try {
    const currentMonth = getMonthRange(0);

    const aggregates = await Transaction.aggregate([
      {
        $match: {
          userId: req.user._id,
          type: "expense",
          date: { $gte: currentMonth.start, $lt: currentMonth.end },
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);

    const limitLookup = new Map(
      (req.user.categoryLimits ?? []).map((item) => [item.category, item.limit])
    );

    const categories = EXPENSE_CATEGORIES.map((category) => {
      const spent =
        aggregates.find((item) => item._id === category)?.total ?? 0;
      const limit = limitLookup.get(category) ?? null;

      return {
        category,
        spent,
        limit,
        exceeded: limit !== null && spent > limit,
      };
    });

    const pieData = categories
      .filter((item) => item.spent > 0)
      .map((item) => ({
        name: item.category,
        value: item.spent,
      }));

    return res.json({
      categories,
      pieData,
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch category analytics." });
  }
};

export const setCategoryLimit = async (req, res) => {
  try {
    const { category, limit } = req.body;

    if (!EXPENSE_CATEGORIES.includes(category)) {
      return res.status(400).json({ message: "Invalid category." });
    }

    const numericLimit =
      limit === null || limit === "" || Number.isNaN(Number(limit))
        ? null
        : Number(limit);

    if (numericLimit !== null && numericLimit < 0) {
      return res.status(400).json({ message: "Limit cannot be negative." });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const existingLimit = user.categoryLimits.find(
      (item) => item.category === category
    );

    if (existingLimit) {
      existingLimit.limit = numericLimit;
    } else {
      user.categoryLimits.push({ category, limit: numericLimit });
    }

    await user.save();
    return res.json({
      category,
      limit: user.categoryLimits.find((item) => item.category === category)?.limit ?? null,
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to save category limit." });
  }
};
