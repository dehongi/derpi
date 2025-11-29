'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import api from '@/utils/api';

export default function StockMovementDetailPage() {
    const router = useRouter();
    const params = useParams();
    const [movement, setMovement] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMovement();
    }, []);

    const fetchMovement = async () => {
        try {
            const response = await api.get(`/inventory/movements/${params.id}/`);
            setMovement(response.data);
        } catch (error) {
            console.error('Error fetching movement:', error);
            router.push('/dashboard/inventory/movements');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>در حال بارگذاری...</div>;
    if (!movement) return <div>یافت نشد</div>;

    return (
        <div>
            <PageHeader
                title={`جزئیات گردش کالا #${movement.id}`}
                subtitle="مشاهده جزئیات ورود و خروج"
                action={
                    <button
                        onClick={() => router.push('/dashboard/inventory/movements')}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                    >
                        بازگشت
                    </button>
                }
            />

            <div className="bg-white rounded shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border-b pb-2">
                        <span className="text-gray-500 block text-sm">نوع حرکت</span>
                        <span className="font-medium">{movement.movement_type_display}</span>
                    </div>
                    <div className="border-b pb-2">
                        <span className="text-gray-500 block text-sm">تاریخ</span>
                        <span className="font-medium">{new Date(movement.date).toLocaleDateString('fa-IR')}</span>
                    </div>
                    <div className="border-b pb-2">
                        <span className="text-gray-500 block text-sm">انبار</span>
                        <span className="font-medium">{movement.warehouse_name}</span>
                    </div>
                    <div className="border-b pb-2">
                        <span className="text-gray-500 block text-sm">کالا</span>
                        <span className="font-medium">{movement.item_name}</span>
                    </div>
                    <div className="border-b pb-2">
                        <span className="text-gray-500 block text-sm">تعداد</span>
                        <span className="font-medium">{Number(movement.quantity).toLocaleString('fa-IR')}</span>
                    </div>
                    <div className="border-b pb-2">
                        <span className="text-gray-500 block text-sm">شماره مرجع</span>
                        <span className="font-medium">{movement.reference_number || '-'}</span>
                    </div>
                    <div className="col-span-2 border-b pb-2">
                        <span className="text-gray-500 block text-sm">یادداشت‌ها</span>
                        <span className="font-medium">{movement.notes || '-'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
