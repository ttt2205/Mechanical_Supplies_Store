import React from 'react';
import Sidebar from '@/components/admin/Sidebar';
import SessionInitializer from '@/components/ui/SessionInitializer';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
        <SessionInitializer />
        
        {/* SIDEBAR */}
        <Sidebar />

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col min-w-0 relative">
            {/* PAGE CONTENT */}
            <main className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8">
                <div className="max-w-[1600px] mx-auto animate-fade-in">
                    {children}
                </div>
            </main>
        </div>
    </div>
  );
}
