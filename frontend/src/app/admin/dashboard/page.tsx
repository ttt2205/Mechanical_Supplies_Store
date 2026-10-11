// app/admin/dashboard/page.tsx
"use client";
import { Eye, Users, Package, FileText } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { StatCard } from "@/components/admin/StatCard";
import { ViewsTrendChart } from "@/components/admin/ViewsTrendChart";
import { TopProductsTable } from "@/components/admin/TopProductsTable";

export default function DashboardPage() {
  const { overview, timeSeries, topProducts, isLoading, isError } = useDashboardStats();

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
        Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.
      </div>
    );
  }

  if (isLoading || !overview) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
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
