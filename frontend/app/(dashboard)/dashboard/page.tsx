export default function DashboardPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">پیشخوان</h1>
                <p className="text-gray-600">خلاصه‌ای از وضعیت سیستم</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white text-2xl">
                            👥
                        </div>
                        <span className="text-sm font-medium text-gray-500">کاربران</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">120</h3>
                    <p className="text-sm text-gray-600">کاربران فعال</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-2xl">
                            💰
                        </div>
                        <span className="text-sm font-medium text-gray-500">فروش</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">5,000,000</h3>
                    <p className="text-sm text-gray-600">فروش امروز (ریال)</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white text-2xl">
                            📦
                        </div>
                        <span className="text-sm font-medium text-gray-500">سفارشات</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">15</h3>
                    <p className="text-sm text-gray-600">سفارشات جدید</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center text-white text-2xl">
                            📊
                        </div>
                        <span className="text-sm font-medium text-gray-500">محصولات</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">248</h3>
                    <p className="text-sm text-gray-600">کالاهای موجود</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl">
                            🤝
                        </div>
                        <span className="text-sm font-medium text-gray-500">مشتریان</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">89</h3>
                    <p className="text-sm text-gray-600">مشتریان فعال</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center text-white text-2xl">
                            ⚠️
                        </div>
                        <span className="text-sm font-medium text-gray-500">هشدارها</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">3</h3>
                    <p className="text-sm text-gray-600">موارد نیازمند توجه</p>
                </div>
            </div>
        </div>
    );
}
