// components/admin/ViewsTrendChart.tsx
"use client";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import type { TimeSeriesPoint } from "@/hooks/useDashboardStats";

export function ViewsTrendChart({ data }: { data: TimeSeriesPoint[] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="mb-4 text-base font-bold text-slate-900">
        Lượt xem & Người dùng mới (30 ngày)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="date"
            tickFormatter={(d) => new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })}
            fontSize={12}
          />
          <YAxis fontSize={12} />
          <Tooltip
            labelFormatter={(d: any) => new Date(d).toLocaleDateString("vi-VN")}
            formatter={(value: any, name: any) => [
              Number(value).toLocaleString("vi-VN"),
              name === "views" ? "Lượt xem" : "Người dùng mới",
            ]}
          />
          <Line type="monotone" dataKey="views" stroke="#1e3a5f" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="newUsers" stroke="#eab308" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
