"use client";

import { Search } from 'lucide-react';

export default function SearchHeader() {
    return (
        <div className="bg-white border border-gray-200 rounded-full px-4 py-2 flex items-center gap-2 w-full max-w-md ml-auto shadow-sm hover:shadow-md transition-all focus-within:ring-2 focus-within:ring-brand-accent/50">
            <Search size={16} className="text-brand-primary/60" />
            <input 
                type="text" 
                placeholder="Tìm kiếm linh kiện..." 
                className="bg-transparent border-none text-sm text-brand-primary placeholder:text-brand-primary/40 focus:ring-0 w-full outline-none font-medium"
            />
        </div>
    )
}
