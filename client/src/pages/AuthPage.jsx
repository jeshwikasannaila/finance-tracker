import { ShieldCheck, TrendingUp, Wallet } from "lucide-react";
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const featureNotes = [
  {
    title: "Simple daily tracking",
    description: "Log expenses in seconds with clean, card-based flows.",
    icon: Wallet,
  },
  {
    title: "Budget visibility",
    description: "See category-level limits before you overspend.",
    icon: ShieldCheck,
  },
  {
    title: "Smarter decisions",
    description: "Monthly charts and trends help you plan ahead.",
    icon: TrendingUp,
  },
];

export const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login, register } = useAuth();
  const [mode, setMode] = useState("signin");
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const redirectTarget = location.state?.from?.pathname || "/dashboard";

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (mode === "signin") {
        await login({
          email: formState.email,
          password: formState.password,
        });
      } else {
        await register({
          name: formState.name,
          email: formState.email,
          password: formState.password,
        });
      }

      navigate(redirectTarget, { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="absolute left-[-60px] top-16 h-40 w-40 rounded-full bg-emerald-200/50 blur-3xl" />
      <div className="absolute right-[-40px] top-0 h-56 w-56 rounded-full bg-sky-200/60 blur-3xl" />
      <div className="absolute bottom-0 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-rose-200/50 blur-3xl" />

      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl items-center gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="card-surface relative overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="absolute right-6 top-6 h-20 w-20 rounded-full bg-gradient-to-br from-emerald-200 to-sky-200 opacity-70 blur-2xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-3 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                <Wallet className="h-5 w-5" />
              </span>
              Finance Tracker
            </div>

            <h1 className="mt-8 max-w-xl font-display text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Track your expenses, set budgets, and take control of your finances
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-slate-500">
              A soft, focused space for keeping tabs on income, expenses, trends,
              and category budgets without the clutter.
            </p>

            <div className="mt-8 grid gap-3">
              {featureNotes.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 rounded-[24px] border border-white/80 bg-white/70 p-4 shadow-sm animate-fadeIn"
                    style={{ animationDelay: `${index * 120}ms` }}
                  >
                    <div className="rounded-2xl bg-gradient-to-br from-violet-100 to-sky-100 p-3 text-slate-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-slate-900">{item.title}</h2>
                      <p className="mt-1 text-sm text-slate-500">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="card-surface p-6 sm:p-8">
          <div className="rounded-full bg-slate-100 p-1">
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => setMode("signin")}
                className={`rounded-full px-4 py-3 text-sm font-semibold transition ${
                  mode === "signin"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`rounded-full px-4 py-3 text-sm font-semibold transition ${
                  mode === "signup"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="font-display text-3xl font-semibold text-slate-900">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {mode === "signin"
                ? "Sign in to review your dashboard, limits, and recent activity."
                : "Sign up to start tracking your money with a calm, focused workflow."}
            </p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-600">
                  Full Name
                </span>
                <input
                  type="text"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  placeholder="Aarav Sharma"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-300 focus:bg-white"
                  required={mode === "signup"}
                />
              </label>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-600">Email</span>
              <input
                type="email"
                name="email"
                value={formState.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-300 focus:bg-white"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-600">
                Password
              </span>
              <input
                type="password"
                name="password"
                value={formState.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-300 focus:bg-white"
                required
                minLength={8}
              />
            </label>

            {error && (
              <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-700 to-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting
                ? mode === "signin"
                  ? "Signing In..."
                  : "Creating Account..."
                : mode === "signin"
                  ? "Sign In"
                  : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            {mode === "signin" ? "Need an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="font-semibold text-indigo-600"
            >
              {mode === "signin" ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </section>
      </div>
    </main>
  );
};
