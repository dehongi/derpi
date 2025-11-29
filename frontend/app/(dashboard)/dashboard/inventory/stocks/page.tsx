'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import api from '@/utils/api';

export default function StocksPage() {
    const router = useRouter();
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStocks();
    }, []);

    const fetchStocks = async () => {
        try {
            const response = await api.get('/inventory/stocks/');
            setStocks(response.data);
        } catch (error) {
            console.error('Error fetching stocks:', error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { key: 'id', label: 'شناسه' },
        { key: 'item_name', label: 'کالا' },
        { key: 'warehouse_name', label: 'انبار' },
        { key: 'quantity', label: 'موجودی کل', render: (value: number) => value?.toLocaleString('fa-IR') },
        { key: 'reserved', label: 'رزرو شده', render: (value: number) => value?.toLocaleString('fa-IR') },
        { key: 'available', label: 'موجودی قابل فروش', render: (value: number) => <span className="font-bold text-green-600">{value?.toLocaleString('fa-IR')}</span> },
    ];

    return (
        <div>
            <PageHeader
                title="موجودی انبار"
                subtitle="مشاهده موجودی کالاها در انبارها"
                action={
                    <button
                        onClick={() => router.push('/dashboard/inventory/movements/create')}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        ثبت گردش کالا
                    </button>
                }
            />

            <DataTable
                columns={columns}
                data={stocks}
                loading={loading}
            // Stocks are usually managed via movements, so maybe no direct edit/delete here?
            // But if needed, we can add them. For now, I'll leave them out or just view.
            />
        </div>
    );
}
