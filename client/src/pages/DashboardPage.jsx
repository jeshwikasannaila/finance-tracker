import {
  Landmark,
  LogOut,
  PiggyBank,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { startTransition, useEffect, useState } from "react";
import api from "../api/axios";
import { CategoryLimitsCard } from "../components/CategoryLimitsCard";
import { CategoryPieCard } from "../components/CategoryPieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { MonthlyChartCard } from "../components/MonthlyChartCard";
import { MonthlyComparisonCard } from "../components/MonthlyComparisonCard";
import { RecentTransactionsCard } from "../components/RecentTransactionsCard";
import { SummaryCard } from "../components/SummaryCard";
import { TransactionForm } from "../components/TransactionForm";
import { useAuth } from "../context/AuthContext";
import { expenseCategories } from "../utils/constants";
import { formatCurrency } from "../utils/formatters";

const getErrorMessage = (error) =>
  error.response?.data?.message || "Something went wrong while loading your data.";

export const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [summary, setSummary] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState({ categories: [], pieData: [] });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [submittingType, setSubmittingType] = useState("");
  const [savingCategory, setSavingCategory] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const loadDashboard = async (showLoader = false) => {
    if (showLoader) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    setError("");

    try {
      const [summaryResponse, monthlyResponse, categoriesResponse, transactionsResponse] =
        await Promise.all([
          api.get("/analytics/summary"),
          api.get("/analytics/monthly"),
          api.get("/analytics/categories"),
          api.get("/transactions"),
        ]);

      startTransition(() => {
        setSummary(summaryResponse.data);
        setMonthlyData(monthlyResponse.data);
        setCategoryData(categoriesResponse.data);
        setTransactions(transactionsResponse.data);
      });
    } catch (requestError) {
      if (requestError.response?.status === 401) {
        logout();
        return;
      }

      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard(true);
  }, []);

  const handleAddTransaction = async (payload) => {
    setSubmittingType(payload.type);

    try {
      await api.post("/transactions", payload);
      await loadDashboard();
    } catch (requestError) {
      throw new Error(getErrorMessage(requestError));
    } finally {
      setSubmittingType("");
    }
  };

  const handleSaveLimit = async (category, limit) => {
    setSavingCategory(category);

    try {
      await api.put("/analytics/categories/limits", {
        category,
        limit: limit === "" ? null : Number(limit),
      });
      await loadDashboard();
    } catch (requestError) {
      throw new Error(getErrorMessage(requestError));
    } finally {
      setSavingCategory("");
    }
  };

  const handleDeleteTransaction = async (id) => {
    setDeletingId(id);

    try {
      await api.delete(`/transactions/${id}`);
      await loadDashboard();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setDeletingId("");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <LoadingSpinner label="Building your dashboard..." />
      </div>
    );
  }

  return (
    <main className="relative overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="absolute left-[-50px] top-8 h-44 w-44 rounded-full bg-emerald-200/50 blur-3xl" />
      <div className="absolute right-[-70px] top-24 h-60 w-60 rounded-full bg-violet-200/40 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-sky-200/50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl space-y-6">
        <header className="card-surface animate-fadeIn flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 animate-float items-center justify-center rounded-[22px] bg-gradient-to-br from-slate-900 via-indigo-700 to-sky-500 text-white shadow-lg">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Finance Tracker</p>
              <h1 className="font-display text-2xl font-semibold text-slate-900">
                Hello, {user?.name?.split(" ")[0] || "there"}
              </h1>
              <p className="text-sm text-slate-500">
                {refreshing ? "Refreshing your latest numbers..." : "Your money dashboard is ready."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </header>

        {error && (
          <div className="card-surface animate-fadeIn border-rose-100 bg-rose-50/90 p-4 text-sm font-medium text-rose-600">
            {error}
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Total Income"
            value={formatCurrency(summary?.totalIncome)}
            detail="All income recorded so far"
            icon={TrendingUp}
            iconClassName="bg-emerald-100 text-emerald-600"
            valueClassName="text-emerald-600"
          />
          <SummaryCard
            title="Total Expenses"
            value={formatCurrency(summary?.totalExpenses)}
            detail="Every outgoing amount in one view"
            icon={TrendingDown}
            iconClassName="bg-rose-100 text-rose-500"
            valueClassName="text-rose-500"
          />
          <SummaryCard
            title="Balance"
            value={formatCurrency(summary?.balance)}
            detail="Income minus expenses"
            icon={Landmark}
            iconClassName="bg-sky-100 text-sky-600"
            valueClassName="text-sky-600"
          />
          <SummaryCard
            title="Savings Rate"
            value={`${summary?.savingsRate ?? 0}%`}
            detail="How much income you keep"
            icon={PiggyBank}
            iconClassName="bg-violet-100 text-violet-600"
            valueClassName="text-violet-600"
          />
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <MonthlyChartCard data={monthlyData} />
          <CategoryPieCard data={categoryData.pieData} />
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <TransactionForm
            type="expense"
            categories={expenseCategories}
            onSubmit={handleAddTransaction}
            isSubmitting={submittingType === "expense"}
          />
          <TransactionForm
            type="income"
            onSubmit={handleAddTransaction}
            isSubmitting={submittingType === "income"}
          />
        </section>

        <section className="grid gap-4 xl:grid-cols-[0.75fr_1.25fr]">
          <MonthlyComparisonCard
            thisMonthSpending={summary?.thisMonthSpending ?? 0}
            lastMonthSpending={summary?.lastMonthSpending ?? 0}
            spendingStatus={summary?.spendingStatus ?? "No change"}
          />
          <CategoryLimitsCard
            categories={categoryData.categories}
            savingCategory={savingCategory}
            onSaveLimit={handleSaveLimit}
          />
        </section>

        <RecentTransactionsCard
          transactions={transactions.slice(0, 8)}
          deletingId={deletingId}
          onDelete={handleDeleteTransaction}
        />
      </div>
    </main>
  );
};
