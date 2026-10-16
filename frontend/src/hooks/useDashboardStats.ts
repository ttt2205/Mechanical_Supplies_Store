import useSWR from "swr";
import { fetchApi } from "@/lib/api";

const apiFetcher = (endpoint: string) => fetchApi<any>(endpoint);

export interface OverviewData {
  totalViews: number;
  totalViewsGrowthPercent: number;
  newUsers: number;
  newUsersGrowthPercent: number;
  totalActiveProducts: number;
  totalPosts: number;
  totalRevenue: number;
  revenueGrowthPercent: number;
}

export interface TimeSeriesPoint {
  date: string;
  views: number;
  newUsers: number;
  revenue: number;
}

export interface TopItem {
  id: number;
  name: string;
  imageUrl?: string;
  viewCount: number;
  price?: number;
}

export function useDashboardStats(range: { from?: string; to?: string } = {}) {
  const query = new URLSearchParams(range as Record<string, string>).toString();

  const overview = useSWR<OverviewData>(
    `/admin/dashboard/overview?${query}`,
    apiFetcher,
    { refreshInterval: 60_000 } // tự refresh mỗi 60s
  );

  const timeSeries = useSWR<TimeSeriesPoint[]>(
    `/admin/dashboard/timeseries?${query}`,
    apiFetcher,
    { refreshInterval: 60_000 }
  );

  const topProducts = useSWR<TopItem[]>(
    `/admin/dashboard/top-products`,
    apiFetcher
  );

  const topPosts = useSWR<TopItem[]>(
    `/admin/dashboard/top-posts`,
    apiFetcher
  );

  return {
    overview: overview.data,
    timeSeries: timeSeries.data,
    topProducts: topProducts.data,
    topPosts: topPosts.data,
    refresh: () => Promise.all([overview.mutate(), timeSeries.mutate(), topProducts.mutate(), topPosts.mutate()]),
    isLoading:
      overview.isLoading || timeSeries.isLoading || topProducts.isLoading,
    isError: overview.error || timeSeries.error || topProducts.error,
  };
}
