'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import { JalaliDateDisplay } from '@/components/JalaliDatePicker';
import { getDeliveries, deleteDelivery } from '@/lib/api/delivery';

export default function DeliveriesPage() {
    const router = useRouter();
    const [deliveries, setDeliveries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchDeliveries();
    }, [filter]);

    const fetchDeliveries = async () => {
        setLoading(true);
        try {
            const params = filter !== 'all' ? { status: filter } : {};
            const response = await getDeliveries(params);
            setDeliveries(response.data);
        } catch (error) {
            console.error('Error fetching deliveries:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('آیا از حذف این حواله اطمینان دارید؟')) {
            try {
                await deleteDelivery(id);
                fetchDeliveries();
            } catch (error) {
                console.error('Error deleting delivery:', error);
                alert('خطا در حذف حواله');
            }
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig: any = {
            pending: { label: 'در انتظار', color: 'bg-yellow-100 text-yellow-800' },
            assigned: { label: 'تخصیص داده شده', color: 'bg-blue-100 text-blue-800' },
            picked_up: { label: 'برداشته شده', color: 'bg-indigo-100 text-indigo-800' },
            in_transit: { label: 'در حال حمل', color: 'bg-orange-100 text-orange-800' },
            delivered: { label: 'تحویل شده', color: 'bg-green-100 text-green-800' },
            cancelled: { label: 'لغو شده', color: 'bg-red-100 text-red-800' },
            failed: { label: 'ناموفق', color: 'bg-gray-100 text-gray-800' }
        };

        const config = statusConfig[status] || statusConfig.pending;
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>{config.label}</span>;
    };

    return (
        <div>
            <PageHeader
                title="حواله‌ها"
                subtitle="مدیریت حواله‌های حمل و نقل"
            />

            <div className="mb-6 flex justify-between items-center">
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        همه
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 rounded-lg ${filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        در انتظار
                    </button>
                    <button
                        onClick={() => setFilter('in_transit')}
                        className={`px-4 py-2 rounded-lg ${filter === 'in_transit' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        در حال حمل
                    </button>
                    <button
                        onClick={() => setFilter('delivered')}
                        className={`px-4 py-2 rounded-lg ${filter === 'delivered' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        تحویل شده
                    </button>
                </div>
                <button
                    onClick={() => router.push('/dashboard/delivery/deliveries/create')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    + حواله جدید
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
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">شماره حواله</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">مشتری</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">راننده</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاریخ برنامه‌ریزی</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">وضعیت</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">هزینه ارسال</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">عملیات</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {deliveries.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                        حواله‌ای یافت نشد
                                    </td>
                                </tr>
                            ) : (
                                deliveries.map((delivery) => (
                                    <tr key={delivery.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {delivery.delivery_number}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {delivery.customer_name || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {delivery.driver_name || 'تخصیص نیافته'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <JalaliDateDisplay date={delivery.scheduled_date} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {getStatusBadge(delivery.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {parseFloat(delivery.delivery_fee).toLocaleString()} ریال
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => router.push(`/dashboard/delivery/deliveries/${delivery.id}`)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    ویرایش
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(delivery.id)}
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
