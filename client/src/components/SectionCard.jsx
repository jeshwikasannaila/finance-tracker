export const SectionCard = ({ title, subtitle, action, children, className = "" }) => {
  return (
    <section className={`card-surface animate-fadeIn p-5 sm:p-6 ${className}`}>
      {(title || subtitle || action) && (
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            {title && (
              <h2 className="font-display text-lg font-semibold text-slate-900">
                {title}
              </h2>
            )}
            {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
};
