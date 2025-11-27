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
                        <li>
                            <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded">
                                کاربران
                            </a>
                        </li>
                        <li>
                            <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded">
                                تنظیمات
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
