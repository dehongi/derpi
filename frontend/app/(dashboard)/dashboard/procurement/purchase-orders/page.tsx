'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import api from '@/utils/api';

export default function PurchaseOrdersPage() {
    const router = useRouter();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await api.get('/procurement/purchase-orders/');
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item: any) => {
        router.push(`/dashboard/procurement/purchase-orders/${item.id}`);
    };

    const handleDelete = async (item: any) => {
        if (confirm('آیا از حذف این مورد اطمینان دارید؟')) {
            try {
                await api.delete(`/procurement/purchase-orders/${item.id}/`);
                fetchItems();
            } catch (error) {
                console.error('Error deleting item:', error);
                alert('خطا در حذف');
            }
        }
    };

        const columns = [
        { key: 'id', label: 'شناسه' },
        { key: 'po_number', label: 'شماره سفارش' },
        { key: 'date', label: 'تاریخ' },
        { key: 'total', label: 'مبلغ کل', render: (value: number) => value?.toLocaleString('fa-IR') + ' ریال' },
        { key: 'status', label: 'وضعیت' }
    ];

    return (
        <div>
            <PageHeader
                title="سفارش‌های خرید"
                subtitle="مدیریت سفارش‌های خرید"
                action={
                    <button
                        onClick={() => router.push('/dashboard/procurement/purchase-orders/create')}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        افزودن سفارش خرید جدید
                    </button>
                }
            />

            <DataTable
                columns={columns}
                data={items}
                onEdit={handleEdit}
                onDelete={handleDelete}
                loading={loading}
            />
        </div>
    );
}
