// components/admin/StatCard.tsx
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  growthPercent?: number;
  icon: React.ReactNode;
}

export function StatCard({ label, value, growthPercent, icon }: StatCardProps) {
  const isPositive = (growthPercent ?? 0) >= 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">{label}</span>
        <div className="rounded-lg bg-brand-primary/10 p-2 text-brand-primary">
          {icon}
        </div>
      </div>
      <div className="mt-3 text-2xl font-bold text-slate-900">{value}</div>
      {growthPercent !== undefined && (
        <div
          className={`mt-1 flex items-center gap-1 text-sm ${
            isPositive ? "text-emerald-600" : "text-red-600"
          }`}
        >
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(growthPercent)}% so với kỳ trước
        </div>
      )}
    </div>
  );
}
