export default function DashboardPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4 text-gray-800">پیشخوان</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded shadow">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700">کاربران فعال</h3>
                    <p className="text-3xl font-bold text-blue-600">120</p>
                </div>
                <div className="bg-white p-6 rounded shadow">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700">فروش امروز</h3>
                    <p className="text-3xl font-bold text-green-600">5,000,000 ریال</p>
                </div>
                <div className="bg-white p-6 rounded shadow">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700">سفارشات جدید</h3>
                    <p className="text-3xl font-bold text-orange-600">15</p>
                </div>
            </div>
        </div>
    );
}
