'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import api from '@/utils/api';

export default function WarehousesPage() {
    const router = useRouter();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await api.get('/inventory/warehouses/');
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item: any) => {
        router.push(`/dashboard/inventory/warehouses/${item.id}`);
    };

    const handleDelete = async (item: any) => {
        if (confirm('آیا از حذف این مورد اطمینان دارید؟')) {
            try {
                await api.delete(`/inventory/warehouses/${item.id}/`);
                fetchItems();
            } catch (error) {
                console.error('Error deleting item:', error);
                alert('خطا در حذف');
            }
        }
    };

        const columns = [
        { key: 'id', label: 'شناسه' },
        { key: 'name', label: 'نام انبار' },
        { key: 'code', label: 'کد انبار' },
        { key: 'location', label: 'موقعیت' },
        { key: 'is_active', label: 'وضعیت', render: (value: boolean) => <span className={`px-2 py-1 rounded text-xs ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{value ? 'فعال' : 'غیرفعال'}</span> }
    ];

    return (
        <div>
            <PageHeader
                title="انبارها"
                subtitle="مدیریت انبارها"
                action={
                    <button
                        onClick={() => router.push('/dashboard/inventory/warehouses/create')}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        افزودن انبار جدید
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
