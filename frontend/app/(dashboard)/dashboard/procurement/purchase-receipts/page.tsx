'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import { JalaliDateDisplay } from '@/components/JalaliDatePicker';
import api from '@/utils/api';

export default function PurchaseReceiptsPage() {
    const router = useRouter();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await api.get('/procurement/purchase-receipts/');
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item: any) => {
        router.push(`/dashboard/procurement/purchase-receipts/${item.id}`);
    };

    const handleDelete = async (item: any) => {
        if (confirm('آیا از حذف این مورد اطمینان دارید؟')) {
            try {
                await api.delete(`/procurement/purchase-receipts/${item.id}/`);
                fetchItems();
            } catch (error) {
                console.error('Error deleting item:', error);
                alert('خطا در حذف');
            }
        }
    };

    const columns = [
        { key: 'id', label: 'شناسه' },
        { key: 'receipt_number', label: 'شماره رسید' },
        { key: 'date', label: 'تاریخ', render: (value: string) => <JalaliDateDisplay date={value} /> },
        { key: 'purchase_order', label: 'سفارش خرید', render: (value: any) => value ? `PO-${value}` : '-' },
    ];

    return (
        <div>
            <PageHeader
                title="رسیدهای خرید"
                subtitle="مدیریت رسیدهای خرید"
                action={
                    <button
                        onClick={() => router.push('/dashboard/procurement/purchase-receipts/create')}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        افزودن رسید خرید جدید
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
