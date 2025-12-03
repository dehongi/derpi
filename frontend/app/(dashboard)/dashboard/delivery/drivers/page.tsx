'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import { getDrivers, deleteDriver } from '@/lib/api/delivery';

export default function DriversPage() {
    const router = useRouter();
    const [drivers, setDrivers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        try {
            const response = await getDrivers();
            setDrivers(response.data);
        } catch (error) {
            console.error('Error fetching drivers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('آیا از حذف این راننده اطمینان دارید؟')) {
            try {
                await deleteDriver(id);
                fetchDrivers();
            } catch (error) {
                console.error('Error deleting driver:', error);
                alert('خطا در حذف راننده');
            }
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig: any = {
            available: { label: 'آماده', color: 'bg-green-100 text-green-800' },
            busy: { label: 'مشغول', color: 'bg-orange-100 text-orange-800' },
            off_duty: { label: 'خارج از خدمت', color: 'bg-gray-100 text-gray-800' }
        };

        const config = statusConfig[status] || statusConfig.available;
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>{config.label}</span>;
    };

    return (
        <div>
            <PageHeader
                title="رانندگان"
                subtitle="مدیریت رانندگان و وضعیت آنها"
            />

            <div className="mb-6 flex justify-end">
                <button
                    onClick={() => router.push('/dashboard/delivery/drivers/create')}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                    + راننده جدید
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
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">نام راننده</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تلفن</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">نوع خودرو</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">پلاک</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">وضعیت</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">فعال</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">عملیات</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {drivers.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                        راننده‌ای یافت نشد
                                    </td>
                                </tr>
                            ) : (
                                drivers.map((driver) => (
                                    <tr key={driver.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {driver.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {driver.phone}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {driver.vehicle_type || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {driver.vehicle_plate || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {getStatusBadge(driver.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {driver.is_active ? (
                                                <span className="text-green-600">✓</span>
                                            ) : (
                                                <span className="text-red-600">✗</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => router.push(`/dashboard/delivery/drivers/${driver.id}`)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    ویرایش
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(driver.id)}
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
