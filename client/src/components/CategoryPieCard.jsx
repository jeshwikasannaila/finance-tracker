import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { pieColors } from "../utils/constants";
import { SectionCard } from "./SectionCard";

export const CategoryPieCard = ({ data }) => {
  return (
    <SectionCard
      title="Category-wise Expenses (This Month)"
      subtitle="See which categories are taking the largest slice."
      className="h-full"
    >
      {data.length === 0 ? (
        <div className="flex h-72 items-center justify-center rounded-[24px] bg-slate-50 text-center text-sm font-medium text-slate-500">
          No expenses recorded this month
        </div>
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={4}
              >
                {data.map((item, index) => (
                  <Cell key={item.name} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "18px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 16px 34px rgba(15, 23, 42, 0.12)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </SectionCard>
  );
};
