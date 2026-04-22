export const LoadingSpinner = ({ label = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="h-11 w-11 animate-spin rounded-full border-4 border-slate-200 border-t-slate-600" />
      <p className="text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
};
