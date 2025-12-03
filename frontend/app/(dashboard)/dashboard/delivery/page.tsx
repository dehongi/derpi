'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import { getDeliveries, getDrivers, getPendingDeliveries, getInTransitDeliveries } from '@/lib/api/delivery';

export default function DeliveryDashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        deliveries: { total: 0, pending: 0, in_transit: 0, delivered: 0 },
        drivers: { total: 0, available: 0, busy: 0 }
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [deliveriesRes, driversRes, pendingRes, inTransitRes] = await Promise.all([
                getDeliveries(),
                getDrivers(),
                getPendingDeliveries(),
                getInTransitDeliveries()
            ]);

            const deliveries = deliveriesRes.data;
            const drivers = driversRes.data;

            setStats({
                deliveries: {
                    total: deliveries.length,
                    pending: pendingRes.data.length,
                    in_transit: inTransitRes.data.length,
                    delivered: deliveries.filter((d: any) => d.status === 'delivered').length
                },
                drivers: {
                    total: drivers.length,
                    available: drivers.filter((d: any) => d.status === 'available' && d.is_active).length,
                    busy: drivers.filter((d: any) => d.status === 'busy').length
                }
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, subtitle, color = 'blue', onClick }: any) => (
        <div
            onClick={onClick}
            className={`bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow border-t-4 border-${color}-500`}
        >
            <h3 className="text-gray-500 text-sm font-medium mb-2">{title}</h3>
            <p className="text-3xl font-bold text-gray-800 mb-1">{value}</p>
            {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        </div>
    );

    const QuickLinkCard = ({ title, description, icon, onClick, color = 'blue' }: any) => (
        <div
            onClick={onClick}
            className={`bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow hover:border-${color}-500 border-2 border-transparent`}
        >
            <div className="flex items-start">
                <div className={`text-4xl mb-4 text-${color}-600`}>{icon}</div>
                <div className="mr-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
                    <p className="text-sm text-gray-600">{description}</p>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-500">در حال بارگذاری...</div>
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                title="داشبورد حمل و نقل"
                subtitle="مدیریت حواله‌ها، رانندگان و مسیرهای حمل"
            />

            {/* Statistics Overview */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">آمار کلی</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="کل حواله‌ها"
                        value={stats.deliveries.total}
                        subtitle={`${stats.deliveries.pending} در انتظار، ${stats.deliveries.delivered} تحویل شده`}
                        color="blue"
                        onClick={() => router.push('/dashboard/delivery/deliveries')}
                    />
                    <StatCard
                        title="در حال حمل"
                        value={stats.deliveries.in_transit}
                        subtitle="حواله‌های در مسیر"
                        color="orange"
                        onClick={() => router.push('/dashboard/delivery/deliveries')}
                    />
                    <StatCard
                        title="رانندگان"
                        value={stats.drivers.total}
                        subtitle={`${stats.drivers.available} آماده، ${stats.drivers.busy} مشغول`}
                        color="green"
                        onClick={() => router.push('/dashboard/delivery/drivers')}
                    />
                    <StatCard
                        title="در انتظار"
                        value={stats.deliveries.pending}
                        subtitle="حواله‌های بدون راننده"
                        color="red"
                        onClick={() => router.push('/dashboard/delivery/deliveries')}
                    />
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">دسترسی سریع</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <QuickLinkCard
                        title="حواله‌ها"
                        description="مشاهده و مدیریت حواله‌های حمل"
                        icon="📦"
                        color="blue"
                        onClick={() => router.push('/dashboard/delivery/deliveries')}
                    />
                    <QuickLinkCard
                        title="رانندگان"
                        description="مدیریت رانندگان و وضعیت آنها"
                        icon="👤"
                        color="green"
                        onClick={() => router.push('/dashboard/delivery/drivers')}
                    />
                    <QuickLinkCard
                        title="مسیرهای حمل"
                        description="برنامه‌ریزی و پیگیری مسیرها"
                        icon="🗺️"
                        color="purple"
                        onClick={() => router.push('/dashboard/delivery/routes')}
                    />
                </div>
            </div>

            {/* Create New Actions */}
            <div>
                <h2 className="text-xl font-semibold mb-4">ایجاد جدید</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => router.push('/dashboard/delivery/deliveries/create')}
                        className="bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        + حواله جدید
                    </button>
                    <button
                        onClick={() => router.push('/dashboard/delivery/drivers/create')}
                        className="bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                        + راننده جدید
                    </button>
                    <button
                        onClick={() => router.push('/dashboard/delivery/routes/create')}
                        className="bg-purple-600 text-white px-6 py-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                    >
                        + مسیر جدید
                    </button>
                </div>
            </div>
        </div>
    );
}
