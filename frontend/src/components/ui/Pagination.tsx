import React from 'react';
import { ArrowRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center pt-8 border-t border-slate-100">
        <div className="flex items-center gap-2 bg-white px-2 py-2 rounded-full border border-slate-100 shadow-sm">
            <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-all hover:bg-slate-50 disabled:opacity-30"
                aria-label="Trang trước"
            >
                <ArrowRight className="rotate-180" size={14} />
            </button>

            <div className="flex items-center gap-1 px-2">
            {Array.from({ length: totalPages }).map((_, index) => {
                const page = index + 1;
                // Basic logic to show current, first, last, and surrounding pages
                // If many pages, we should add ellipsis, but for now just show all if < 10,
                // or a smart subset if >= 10
                const isClose = Math.abs(page - currentPage) <= 1;
                const isEdge = page === 1 || page === totalPages;
                
                if (totalPages > 7 && !isClose && !isEdge) {
                  if (page === 2 || page === totalPages - 1) {
                    return <span key={index} className="text-slate-400 px-1">...</span>;
                  }
                  return null;
                }

                return (
                  <button
                  key={index}
                  onClick={() => onPageChange(page)}
                  className={`h-9 w-9 rounded-full text-sm font-medium transition-all ${
                      currentPage === page
                      ? "bg-slate-900 text-white shadow-md"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                  >
                  {page}
                  </button>
                );
            })}
            </div>

            <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-all hover:bg-slate-50 disabled:opacity-30"
                aria-label="Trang sau"
            >
                <ArrowRight size={14} />
            </button>
        </div>
    </div>
  );
}
