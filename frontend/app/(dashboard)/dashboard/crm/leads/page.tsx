'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import api from '@/utils/api';

export default function LeadsPage() {
    const router = useRouter();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await api.get('/crm/leads/');
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item: any) => {
        router.push(`/dashboard/crm/leads/${item.id}`);
    };

    const handleDelete = async (item: any) => {
        if (confirm('آیا از حذف این مورد اطمینان دارید؟')) {
            try {
                await api.delete(`/crm/leads/${item.id}/`);
                fetchItems();
            } catch (error) {
                console.error('Error deleting item:', error);
                alert('خطا در حذف');
            }
        }
    };

        const columns = [
        { key: 'id', label: 'شناسه' },
        { key: 'name', label: 'نام' },
        { key: 'email', label: 'ایمیل' },
        { key: 'phone', label: 'تلفن' },
        { key: 'source', label: 'منبع' },
        { key: 'status', label: 'وضعیت' }
    ];

    return (
        <div>
            <PageHeader
                title="سرنخ‌ها"
                subtitle="مدیریت سرنخ‌ها"
                action={
                    <button
                        onClick={() => router.push('/dashboard/crm/leads/create')}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        افزودن سرنخ جدید
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
