import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SectionCard } from "./SectionCard";

export const MonthlyChartCard = ({ data }) => {
  const chartData = data.map((item) => ({
    ...item,
    balance: item.income - item.expense,
  }));

  return (
    <SectionCard
      title="Income vs Expenses (Last 6 Months)"
      subtitle="A quick read on how money is flowing in and out over time."
      className="h-full"
    >
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} width={58} />
            <Tooltip
              contentStyle={{
                borderRadius: "18px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 16px 34px rgba(15, 23, 42, 0.12)",
              }}
            />
            <Legend />
            <Bar dataKey="income" name="Income" fill="#10b981" radius={[10, 10, 0, 0]} />
            <Bar
              dataKey="expense"
              name="Expenses"
              fill="#fb7185"
              radius={[10, 10, 0, 0]}
            />
            <Line
              type="monotone"
              dataKey="balance"
              name="Net"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
};
