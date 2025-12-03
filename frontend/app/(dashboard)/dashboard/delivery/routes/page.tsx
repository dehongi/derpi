'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import { JalaliDateDisplay } from '@/components/JalaliDatePicker';
import { getDeliveryRoutes, deleteDeliveryRoute } from '@/lib/api/delivery';

export default function RoutesPage() {
    const router = useRouter();
    const [routes, setRoutes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRoutes();
    }, []);

    const fetchRoutes = async () => {
        try {
            const response = await getDeliveryRoutes();
            setRoutes(response.data);
        } catch (error) {
            console.error('Error fetching routes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('آیا از حذف این مسیر اطمینان دارید؟')) {
            try {
                await deleteDeliveryRoute(id);
                fetchRoutes();
            } catch (error) {
                console.error('Error deleting route:', error);
                alert('خطا در حذف مسیر');
            }
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig: any = {
            planned: { label: 'برنامه‌ریزی شده', color: 'bg-blue-100 text-blue-800' },
            in_progress: { label: 'در حال انجام', color: 'bg-orange-100 text-orange-800' },
            completed: { label: 'تکمیل شده', color: 'bg-green-100 text-green-800' },
            cancelled: { label: 'لغو شده', color: 'bg-red-100 text-red-800' }
        };

        const config = statusConfig[status] || statusConfig.planned;
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>{config.label}</span>;
    };

    return (
        <div>
            <PageHeader
                title="مسیرهای حمل"
                subtitle="برنامه‌ریزی و پیگیری مسیرهای حمل"
            />

            <div className="mb-6 flex justify-end">
                <button
                    onClick={() => router.push('/dashboard/delivery/routes/create')}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                    + مسیر جدید
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="text-gray-500">در حال بارگذاری...</div>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">نام مسیر</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">راننده</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاریخ</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تعداد حواله</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">مسافت کل</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">وضعیت</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">عملیات</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {routes.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                        مسیری یافت نشد
                                    </td>
                                </tr>
                            ) : (
                                routes.map((route) => (
                                    <tr key={route.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {route.route_name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {route.driver_name || 'تخصیص نیافته'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <JalaliDateDisplay date={route.date} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {route.total_deliveries || 0}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {parseFloat(route.total_distance || 0).toLocaleString()} کیلومتر
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {getStatusBadge(route.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => router.push(`/dashboard/delivery/routes/${route.id}`)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    ویرایش
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(route.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    حذف
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
