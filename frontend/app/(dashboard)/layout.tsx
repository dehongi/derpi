"use client";

import { useState, useEffect } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Prevent body scroll when mobile sidebar is open
    useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [sidebarOpen]);

    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100" dir="rtl">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 right-0 z-50
                w-72 bg-white shadow-xl border-l border-gray-200 
                flex flex-col
                transform transition-transform duration-300 lg:transform-none
                ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold gradient-text">داشبورد</h2>
                        <p className="text-sm text-gray-500 mt-1">مدیریت سیستم</p>
                    </div>
                    {/* Close button for mobile */}
                    <button
                        onClick={closeSidebar}
                        className="lg:hidden p-2 text-gray-700 hover:text-purple-600 transition-colors"
                        aria-label="Close sidebar"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <nav className="flex-1 p-4 overflow-y-auto">
                    <ul className="space-y-1">
                        <li>
                            <a href="/dashboard" onClick={closeSidebar} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 rounded-lg transition-all group">
                                <span className="text-xl">📊</span>
                                <span className="font-medium">پیشخوان</span>
                            </a>
                        </li>

                        {/* Core Modules */}
                        <li className="pt-6">
                            <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                ماژول‌های اصلی
                            </div>
                        </li>
                        <li>
                            <a href="/dashboard/inventory" onClick={closeSidebar} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-700 rounded-lg transition-all group">
                                <span className="text-xl">📦</span>
                                <span className="font-medium">انبار</span>
                            </a>
                        </li>
                        <li>
                            <a href="/dashboard/sales" onClick={closeSidebar} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-700 rounded-lg transition-all group">
                                <span className="text-xl">💰</span>
                                <span className="font-medium">فروش</span>
                            </a>
                        </li>
                        <li>
                            <a href="/dashboard/procurement" onClick={closeSidebar} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 hover:text-orange-700 rounded-lg transition-all group">
                                <span className="text-xl">🛒</span>
                                <span className="font-medium">خرید</span>
                            </a>
                        </li>
                        <li>
                            <a href="/dashboard/pos" onClick={closeSidebar} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 rounded-lg transition-all group">
                                <span className="text-xl">🏪</span>
                                <span className="font-medium">صندوق</span>
                            </a>
                        </li>
                        <li>
                            <a href="/dashboard/delivery" onClick={closeSidebar} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 hover:text-amber-700 rounded-lg transition-all group">
                                <span className="text-xl">🚚</span>
                                <span className="font-medium">حمل و نقل</span>
                            </a>
                        </li>

                        {/* Support Modules */}
                        <li className="pt-6">
                            <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                پشتیبانی
                            </div>
                        </li>
                        <li>
                            <a href="/dashboard/hr" onClick={closeSidebar} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700 rounded-lg transition-all group">
                                <span className="text-xl">👥</span>
                                <span className="font-medium">منابع انسانی</span>
                            </a>
                        </li>
                        <li>
                            <a href="/dashboard/crm" onClick={closeSidebar} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 hover:text-pink-700 rounded-lg transition-all group">
                                <span className="text-xl">🤝</span>
                                <span className="font-medium">CRM</span>
                            </a>
                        </li>
                        <li>
                            <a href="/dashboard/accounting" onClick={closeSidebar} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 hover:text-yellow-700 rounded-lg transition-all group">
                                <span className="text-xl">💵</span>
                                <span className="font-medium">حسابداری</span>
                            </a>
                        </li>
                        <li>
                            <a href="/dashboard/contacts" onClick={closeSidebar} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50 hover:text-teal-700 rounded-lg transition-all group">
                                <span className="text-xl">📇</span>
                                <span className="font-medium">مخاطبین</span>
                            </a>
                        </li>

                        {/* Additional Modules */}
                        <li className="pt-6">
                            <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                سایر
                            </div>
                        </li>
                        <li>
                            <a href="/dashboard/ecommerce" onClick={closeSidebar} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 rounded-lg transition-all group">
                                <span className="text-xl">🛍️</span>
                                <span className="font-medium">فروشگاه</span>
                            </a>
                        </li>
                        <li>
                            <a href="/dashboard/website" onClick={closeSidebar} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 hover:text-violet-700 rounded-lg transition-all group">
                                <span className="text-xl">🌐</span>
                                <span className="font-medium">وب‌سایت</span>
                            </a>
                        </li>

                        {/* Settings */}
                        <li className="pt-6">
                            <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                تنظیمات
                            </div>
                        </li>
                        <li>
                            <a href="/dashboard/profile" onClick={closeSidebar} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 hover:text-gray-900 rounded-lg transition-all group">
                                <span className="text-xl">👤</span>
                                <span className="font-medium">پروفایل کاربری</span>
                            </a>
                        </li>
                        <li>
                            <a href="/dashboard/company" onClick={closeSidebar} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 hover:text-gray-900 rounded-lg transition-all group">
                                <span className="text-xl">🏢</span>
                                <span className="font-medium">اطلاعات شرکت</span>
                            </a>
                        </li>
                    </ul>
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <a href="/" onClick={closeSidebar} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-all">
                        <span className="text-xl">🏠</span>
                        <span className="font-medium">بازگشت به خانه</span>
                    </a>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header with Hamburger */}
                <div className="lg:hidden bg-white border-b border-gray-200 p-4 sticky top-0 z-30">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 text-gray-700 hover:text-purple-600 transition-colors"
                            aria-label="Open sidebar"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h1 className="text-xl font-bold gradient-text">داشبورد</h1>
                        <div className="w-10"></div> {/* Spacer for centering */}
                    </div>
                </div>

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-4 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
