import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { formatCurrency } from "../utils/formatters";
import { SectionCard } from "./SectionCard";

export const CategoryLimitsCard = ({
  categories,
  onSaveLimit,
  savingCategory,
}) => {
  const [drafts, setDrafts] = useState({});

  useEffect(() => {
    const initialDrafts = {};
    categories.forEach((item) => {
      initialDrafts[item.category] = item.limit ?? "";
    });
    setDrafts(initialDrafts);
  }, [categories]);

  const handleSubmit = async (category) => {
    await onSaveLimit(category, drafts[category]);
  };

  return (
    <SectionCard
      title="Category Limits & Alerts"
      subtitle="Set a budget guardrail for each expense category."
      className="h-full"
    >
      <div className="space-y-3">
        {categories.map((item) => (
          <div
            key={item.category}
            className={`rounded-[24px] border p-4 transition ${
              item.exceeded
                ? "border-rose-200 bg-rose-50/70"
                : "border-slate-200 bg-slate-50/80"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-800">{item.category}</h3>
                  {item.exceeded && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-1 text-[11px] font-semibold text-rose-600">
                      <AlertCircle className="h-3 w-3" />
                      Limit crossed
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  Amount spent:{" "}
                  <span className="font-semibold text-slate-800">
                    {formatCurrency(item.spent)}
                  </span>
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Limit:{" "}
                  <span className="font-semibold text-slate-800">
                    {item.limit !== null ? formatCurrency(item.limit) : "Not set"}
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                type="number"
                min="0"
                value={drafts[item.category] ?? ""}
                onChange={(event) =>
                  setDrafts((current) => ({
                    ...current,
                    [item.category]: event.target.value,
                  }))
                }
                placeholder="Enter limit"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-300"
              />
              <button
                type="button"
                disabled={savingCategory === item.category}
                onClick={() => handleSubmit(item.category)}
                className="rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {savingCategory === item.category ? "Saving..." : "Set Limit"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
};
