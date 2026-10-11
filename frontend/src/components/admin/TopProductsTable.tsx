// components/admin/TopProductsTable.tsx
import Image from "next/image";
import type { TopItem } from "@/hooks/useDashboardStats";

export function TopProductsTable({ products }: { products: TopItem[] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="mb-4 text-base font-bold text-slate-900">
        Top 5 sản phẩm được xem nhiều nhất
      </h3>
      <div className="divide-y divide-slate-100">
        {products.map((p, idx) => (
          <div key={p.id} className="flex items-center gap-3 py-3">
            <span className="w-5 text-sm font-medium text-slate-400">
              {idx + 1}
            </span>
            <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-slate-200">
              {p.imageUrl ? (
                <Image src={p.imageUrl} alt={p.name} fill sizes="40px" className="object-cover" />
              ) : (
                <div className="h-full w-full bg-slate-100 flex items-center justify-center text-slate-400">Img</div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900 font-semibold line-clamp-1">{p.name}</p>
              <p className="text-xs text-slate-500">{p.viewCount.toLocaleString("vi-VN")} lượt xem</p>
            </div>
            {p.price && (
              <span className="text-sm font-semibold text-brand-primary">
                {p.price.toLocaleString("vi-VN")}₫
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
