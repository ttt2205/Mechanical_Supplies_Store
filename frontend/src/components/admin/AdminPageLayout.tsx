import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface AdminPageLayoutProps<T> {
    title: string;
    description: string;
    actionButton?: React.ReactNode;
    data: T[];
    searchKey?: (item: T) => string; // Function to get search string from item
    searchPlaceholder?: string;
    filters?: React.ReactNode;
    tableHeader: React.ReactNode;
    renderRow: (item: T, index: number) => React.ReactNode;
    isLoading?: boolean;
    colSpan?: number; // Used for "No data" message spanning
}

export function AdminPageLayout<T>({
    title,
    description,
    actionButton,
    data,
    searchKey,
    searchPlaceholder = "Tìm kiếm...",
    filters,
    tableHeader,
    renderRow,
    isLoading = false,
    colSpan = 5
}: AdminPageLayoutProps<T>) {
    const [searchTerm, setSearchTerm] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // 1. Filter data based on search term
    const filteredData = useMemo(() => {
        if (!searchTerm || !searchKey) return data || [];
        const lowerTerm = searchTerm.toLowerCase();
        return (data || []).filter(item => searchKey(item).toLowerCase().includes(lowerTerm));
    }, [data, searchTerm, searchKey]);

    // 2. Pagination calculations
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / pageSize) || 1;
    
    // Ensure current page is valid after filtering or page size change
    const validCurrentPage = Math.min(currentPage, totalPages);
    if (validCurrentPage !== currentPage && validCurrentPage > 0) {
        setCurrentPage(validCurrentPage);
    }

    const startIndex = (validCurrentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    
    const paginatedData = filteredData.slice(startIndex, endIndex);

    // 3. Render pagination numbers
    const renderPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, validCurrentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                        i === validCurrentPage
                        ? 'bg-brand-primary text-white shadow-md'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    return (
        <div className="space-y-6">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{title}</h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">{description}</p>
                </div>
                {actionButton && (
                    <div>{actionButton}</div>
                )}
            </div>

            {/* Table section with integrated search */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                {/* Search Bar at Top Right */}
                <div className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-slate-50 bg-slate-50/50">
                    <div className="text-sm font-semibold text-slate-600">
                        {totalItems > 0 && `Hiển thị ${startIndex + 1}-${endIndex} / ${totalItems} mục`}
                    </div>
                    <div className="flex gap-4 items-center w-full sm:w-auto mt-4 sm:mt-0">
                        {filters && (
                            <div className="flex items-center gap-2">
                                {filters}
                            </div>
                        )}
                        {searchKey && (
                            <div className="relative w-full sm:w-64 md:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                    type="text" 
                                    placeholder={searchPlaceholder}
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1); // Reset to page 1 on search
                                    }}
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs font-semibold text-slate-600 uppercase tracking-wider bg-slate-50/80 border-b border-slate-100">
                            {tableHeader}
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={colSpan} className="px-6 py-10 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <div className="w-8 h-8 border-4 border-slate-200 border-t-brand-primary rounded-full animate-spin"></div>
                                            <span className="text-slate-500 font-bold">Đang tải dữ liệu...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan={colSpan} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-2">
                                            <Search className="text-slate-300 w-12 h-12 mb-2" />
                                            <span className="text-slate-500 font-bold text-lg">Không tìm thấy dữ liệu!</span>
                                            <span className="text-slate-400 text-sm">Vui lòng thử lại với từ khóa khác hoặc thêm mới.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((item, index) => renderRow(item, index))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                {totalItems > 0 && (
                    <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-slate-500">Hiển thị</span>
                            <select 
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-brand-primary/20 outline-none"
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                            <span className="text-sm font-medium text-slate-500">dòng</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={validCurrentPage === 1}
                                className="p-2 rounded-lg text-slate-500 hover:bg-slate-200 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            
                            <div className="flex items-center gap-1">
                                {renderPageNumbers()}
                            </div>

                            <button 
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={validCurrentPage === totalPages}
                                className="p-2 rounded-lg text-slate-500 hover:bg-slate-200 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
