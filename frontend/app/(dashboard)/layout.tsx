"use client";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100" dir="rtl">
            <aside className="w-72 bg-white shadow-xl border-l border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold gradient-text">داشبورد</h2>
                    <p className="text-sm text-gray-500 mt-1">مدیریت سیستم</p>
                </div>

                <nav className="flex-1 p-4 overflow-y-auto">
                    <ul className="space-y-1">
                        <li>
                            <a href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 rounded-lg transition-all group">
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
                            <a href="/dashboard/inventory" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-700 rounded-lg transition-all group">
                                <span className="text-xl">📦</span>
                                <span className="font-medium">انبار</span>
                            </a>
                        </li>
                        <li>
                            <a href="/dashboard/sales" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-700 rounded-lg transition-all group">
                                <span className="text-xl">💰</span>
                                <span className="font-medium">فروش</span>
                            </a>
                        </li>
                        <li>
                            <a href="/dashboard/procurement" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 hover:text-orange-700 rounded-lg transition-all group">
                                <span className="text-xl">🛒</span>
                                <span className="font-medium">خرید</span>
                            </a>
                        </li>
                        <li>
                            <a href="/dashboard/pos" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 rounded-lg transition-all group">
                                <span className="text-xl">🏪</span>
                                <span className="font-medium">صندوق</span>
                            </a>
                        </li>

                        {/* Support Modules */}
                        <li className="pt-6">
                            <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                پشتیبانی
                            </div>
                        </li>
                        <li>
                            <a href="/dashboard/hr" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700 rounded-lg transition-all group">
                                <span className="text-xl">👥</span>
                                <span className="font-medium">منابع انسانی</span>
                            </a>
                        </li>
                        <li>
                            <a href="/dashboard/crm" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 hover:text-pink-700 rounded-lg transition-all group">
                                <span className="text-xl">🤝</span>
                                <span className="font-medium">CRM</span>
                            </a>
                        </li>
                        <li>
                            <a href="/dashboard/accounting" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 hover:text-yellow-700 rounded-lg transition-all group">
                                <span className="text-xl">💵</span>
                                <span className="font-medium">حسابداری</span>
                            </a>
                        </li>
                        <li>
                            <a href="/dashboard/contacts" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50 hover:text-teal-700 rounded-lg transition-all group">
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
                            <a href="/dashboard/ecommerce" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 rounded-lg transition-all group">
                                <span className="text-xl">🛍️</span>
                                <span className="font-medium">فروشگاه</span>
                            </a>
                        </li>
                        <li>
                            <a href="/dashboard/website" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 hover:text-violet-700 rounded-lg transition-all group">
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
                            <a href="/dashboard/profile" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 hover:text-gray-900 rounded-lg transition-all group">
                                <span className="text-xl">👤</span>
                                <span className="font-medium">پروفایل کاربری</span>
                            </a>
                        </li>
                        <li>
                            <a href="/dashboard/company" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 hover:text-gray-900 rounded-lg transition-all group">
                                <span className="text-xl">🏢</span>
                                <span className="font-medium">اطلاعات شرکت</span>
                            </a>
                        </li>
                    </ul>
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <a href="/" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-all">
                        <span className="text-xl">🏠</span>
                        <span className="font-medium">بازگشت به خانه</span>
                    </a>
                </div>
            </aside>

            <main className="flex-1 overflow-auto">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
