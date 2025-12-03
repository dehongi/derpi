'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import { JalaliDateDisplay } from '@/components/JalaliDatePicker';
import api from '@/utils/api';

export default function StockMovementsPage() {
    const router = useRouter();
    const [movements, setMovements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMovements();
    }, []);

    const fetchMovements = async () => {
        try {
            const response = await api.get('/inventory/movements/');
            setMovements(response.data);
        } catch (error) {
            console.error('Error fetching movements:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleView = (item: any) => {
        router.push(`/dashboard/inventory/movements/${item.id}`);
    };

    const columns = [
        { key: 'id', label: 'شناسه' },
        { key: 'date', label: 'تاریخ', render: (value: string) => <JalaliDateDisplay date={value} /> },
        { key: 'movement_type_display', label: 'نوع' },
        { key: 'item_name', label: 'کالا' },
        { key: 'warehouse_name', label: 'انبار' },
        { key: 'quantity', label: 'تعداد', render: (value: number) => value?.toLocaleString('fa-IR') },
        { key: 'reference_number', label: 'شماره مرجع' },
    ];

    return (
        <div>
            <PageHeader
                title="گردش کالا"
                subtitle="تاریخچه ورود و خروج کالا"
                action={
                    <button
                        onClick={() => router.push('/dashboard/inventory/movements/create')}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        ثبت گردش جدید
                    </button>
                }
            />

            <DataTable
                columns={columns}
                data={movements}
                onEdit={handleView} // Using onEdit for view details
                loading={loading}
            />
        </div>
    );
}
