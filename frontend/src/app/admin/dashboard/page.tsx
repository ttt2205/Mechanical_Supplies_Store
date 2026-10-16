// app/admin/dashboard/page.tsx
"use client";
import React, { useState } from "react";
import { Eye, Users, Package, FileText, RotateCw } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { StatCard } from "@/components/admin/StatCard";
import { ViewsTrendChart } from "@/components/admin/ViewsTrendChart";
import { TopProductsTable } from "@/components/admin/TopProductsTable";

export default function DashboardPage() {
  const { overview, timeSeries, topProducts, isLoading, isError, refresh } = useDashboardStats();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600 flex items-center justify-between">
        <span>Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.</span>
        <button
          type="button"
          onClick={handleRefresh}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-bold transition-colors"
        >
          <RotateCw size={14} className={isRefreshing ? "animate-spin" : ""} />
          Thử lại
        </button>
      </div>
    );
  }

  if (isLoading || !overview) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Tổng quan hệ thống</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Báo cáo tổng hợp số liệu tương tác, người dùng và sản phẩm.</p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isLoading || isRefreshing}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 text-xs font-bold transition-all shadow-xs hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          title="Tải lại số liệu"
        >
          <RotateCw
            size={15}
            className={`text-slate-600 transition-transform ${isLoading || isRefreshing ? "animate-spin text-brand-primary" : ""}`}
          />
          <span>{isLoading || isRefreshing ? "Đang tải..." : "Tải lại"}</span>
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Lượt xem" value={overview.totalViews.toLocaleString("vi-VN")}
          growthPercent={overview.totalViewsGrowthPercent} icon={<Eye size={18} />} />
        <StatCard label="Người dùng mới" value={overview.newUsers.toLocaleString("vi-VN")}
          growthPercent={overview.newUsersGrowthPercent} icon={<Users size={18} />} />
        <StatCard label="Sản phẩm đang bán" value={overview.totalActiveProducts.toLocaleString("vi-VN")}
          icon={<Package size={18} />} />
        <StatCard label="Bài viết" value={overview.totalPosts.toLocaleString("vi-VN")}
          icon={<FileText size={18} />} />
      </div>

      {timeSeries && <ViewsTrendChart data={timeSeries} />}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {topProducts && <TopProductsTable products={topProducts} />}
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-100" />
      ))}
    </div>
  );
}
