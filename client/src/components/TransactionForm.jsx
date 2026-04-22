import { useState } from "react";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { getTodayInputValue } from "../utils/formatters";
import { SectionCard } from "./SectionCard";

export const TransactionForm = ({
  type,
  categories = [],
  onSubmit,
  isSubmitting,
}) => {
  const isExpense = type === "expense";
  const [formState, setFormState] = useState({
    amount: "",
    date: getTodayInputValue(),
    category: categories[0] || "",
    description: "",
  });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formState.amount || !formState.date || (isExpense && !formState.category)) {
      setError("Please fill in the required fields.");
      return;
    }

    try {
      await onSubmit({
        type,
        amount: Number(formState.amount),
        date: formState.date,
        category: isExpense ? formState.category : "Income",
        description: formState.description,
      });

      setFormState({
        amount: "",
        date: getTodayInputValue(),
        category: categories[0] || "",
        description: "",
      });
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  return (
    <SectionCard
      title={isExpense ? "Add Expense" : "Add Income"}
      subtitle={
        isExpense
          ? "Keep every purchase visible before it sneaks past the budget."
          : "Capture salary, freelance work, and any extra inflow."
      }
      className="h-full"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-600">
            Amount (₹)
          </span>
          <input
            type="number"
            name="amount"
            min="0"
            step="0.01"
            value={formState.amount}
            onChange={handleChange}
            placeholder="0"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-300 focus:bg-white"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-600">Date</span>
          <input
            type="date"
            name="date"
            value={formState.date}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-300 focus:bg-white"
          />
        </label>

        {isExpense && (
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-600">
              Category
            </span>
            <select
              name="category"
              value={formState.category}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-300 focus:bg-white"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-600">
            Description (optional)
          </span>
          <textarea
            rows="3"
            name="description"
            value={formState.description}
            onChange={handleChange}
            placeholder="Add a short note"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-300 focus:bg-white"
          />
        </label>

        {error && (
          <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-70 ${
            isExpense
              ? "bg-gradient-to-r from-rose-500 to-orange-400"
              : "bg-gradient-to-r from-emerald-500 to-teal-400"
          }`}
        >
          {isExpense ? (
            <ArrowDownCircle className="h-4 w-4" />
          ) : (
            <ArrowUpCircle className="h-4 w-4" />
          )}
          {isSubmitting
            ? isExpense
              ? "Saving Expense..."
              : "Saving Income..."
            : isExpense
              ? "Add Expense"
              : "Add Income"}
        </button>
      </form>
    </SectionCard>
  );
};
