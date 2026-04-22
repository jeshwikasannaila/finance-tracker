import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { formatCurrency } from "../utils/formatters";
import { SectionCard } from "./SectionCard";

const statusMap = {
  Increased: {
    icon: TrendingUp,
    className: "bg-rose-50 text-rose-600",
  },
  Decreased: {
    icon: TrendingDown,
    className: "bg-emerald-50 text-emerald-600",
  },
  "No change": {
    icon: Minus,
    className: "bg-slate-100 text-slate-600",
  },
};

export const MonthlyComparisonCard = ({
  thisMonthSpending,
  lastMonthSpending,
  spendingStatus,
}) => {
  const status = statusMap[spendingStatus] || statusMap["No change"];
  const Icon = status.icon;

  return (
    <SectionCard
      title="Monthly Comparison"
      subtitle="A side-by-side snapshot of your recent spending pace."
      className="h-full"
    >
      <div className="space-y-4">
        <div className="rounded-[22px] bg-slate-50 p-4">
          <p className="text-sm text-slate-500">This Month total spending</p>
          <p className="mt-2 font-display text-2xl font-semibold text-slate-900">
            {formatCurrency(thisMonthSpending)}
          </p>
        </div>

        <div className="rounded-[22px] bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Last Month total spending</p>
          <p className="mt-2 font-display text-2xl font-semibold text-slate-900">
            {formatCurrency(lastMonthSpending)}
          </p>
        </div>

        <div
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${status.className}`}
        >
          <Icon className="h-4 w-4" />
          {spendingStatus}
        </div>
      </div>
    </SectionCard>
  );
};
