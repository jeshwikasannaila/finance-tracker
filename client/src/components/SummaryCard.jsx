export const SummaryCard = ({
  title,
  value,
  detail,
  icon: Icon,
  iconClassName,
  valueClassName,
}) => {
  return (
    <div className="card-surface animate-fadeIn p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className={`mt-3 font-display text-2xl font-semibold ${valueClassName}`}>
            {value}
          </p>
          <p className="mt-2 text-xs text-slate-500">{detail}</p>
        </div>
        <div className={`rounded-2xl p-3 ${iconClassName}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};
