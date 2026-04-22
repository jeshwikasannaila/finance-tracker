import { Trash2 } from "lucide-react";
import { formatCurrency, formatDate } from "../utils/formatters";
import { SectionCard } from "./SectionCard";

export const RecentTransactionsCard = ({
  transactions,
  onDelete,
  deletingId,
}) => {
  return (
    <SectionCard
      title="Recent Transactions"
      subtitle="Your latest recorded income and expenses, all in one place."
    >
      {transactions.length === 0 ? (
        <div className="rounded-[24px] bg-slate-50 px-4 py-8 text-center text-sm font-medium text-slate-500">
          No transactions yet. Add your first income or expense to get started.
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => {
            const isIncome = transaction.type === "income";

            return (
              <div
                key={transaction._id}
                className="flex items-center gap-3 rounded-[24px] border border-slate-200 bg-slate-50/80 p-4"
              >
                <div
                  className={`rounded-2xl px-3 py-2 text-xs font-semibold ${
                    isIncome
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-600"
                  }`}
                >
                  {isIncome ? "Income" : "Expense"}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-semibold text-slate-800">
                      {transaction.description || transaction.category}
                    </p>
                    <span className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-slate-500">
                      {transaction.category}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{formatDate(transaction.date)}</p>
                </div>

                <div className="text-right">
                  <p
                    className={`font-display text-lg font-semibold ${
                      isIncome ? "text-emerald-600" : "text-rose-500"
                    }`}
                  >
                    {isIncome ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </p>
                  <button
                    type="button"
                    disabled={deletingId === transaction._id}
                    onClick={() => onDelete(transaction._id)}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-slate-400 transition hover:text-rose-500 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {deletingId === transaction._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
};
