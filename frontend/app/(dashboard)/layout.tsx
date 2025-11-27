export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex bg-gray-100" dir="rtl">
            <aside className="w-64 bg-white shadow-md">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">داشبورد</h2>
                </div>
                <nav className="p-4">
                    <ul className="space-y-2">
                        <li>
                            <a href="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded">
                                پیشخوان
                            </a>
                        </li>

                        {/* Core Modules */}
                        <li className="pt-4">
                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                                ماژول‌های اصلی
                            </div>
                        </li>
                        <li>
                            <a href="/dashboard/inventory" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded">
                                انبار
                            </a>
                        </li>
                        <li>
                            <a href="/dashboard/sales" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded">
                                فروش
                            </a>
                        </li>
                        <li>
                            <a href="/dashboard/procurement" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded">
                                خرید
                            </a>
                        </li>
                        <li>
                            <a href="/dashboard/pos" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded">
                                صندوق
                            </a>
                        </li>

                        {/* Support Modules */}
                        <li className="pt-4">
                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                                پشتیبانی
                            </div>
                        </li>
                        <li>
                            <a href="/dashboard/hr" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded">
                                منابع انسانی
                            </a>
                        </li>
                        <li>
                            <a href="/dashboard/crm" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded">
                                CRM
                            </a>
                        </li>
                        <li>
                            <a href="/dashboard/accounting" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded">
                                حسابداری
                            </a>
                        </li>
                        <li>
                            <a href="/dashboard/contacts" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded">
                                مخاطبین
                            </a>
                        </li>

                        {/* Additional Modules */}
                        <li className="pt-4">
                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                                سایر
                            </div>
                        </li>
                        <li>
                            <a href="/dashboard/ecommerce" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded">
                                فروشگاه
                            </a>
                        </li>
                        <li>
                            <a href="/dashboard/website" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded">
                                وب‌سایت
                            </a>
                        </li>

                        {/* Settings */}
                        <li className="pt-4">
                            <a href="/dashboard/profile" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded">
                                پروفایل کاربری
                            </a>
                        </li>
                        <li>
                            <a href="/dashboard/company" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded">
                                اطلاعات شرکت
                            </a>
                        </li>
                    </ul>
                </nav>
            </aside>
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}
