'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import api from '@/utils/api';

export default function GlobalPagesPage() {
    const router = useRouter();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await api.get('/website/global-pages/');
            setItems(response.data);
        } catch (error: any) {
            console.error('Error fetching items:', error);
            if (error.response?.status === 403) {
                setError('شما دسترسی به این بخش ندارید. فقط سوپریوزرها می‌توانند صفحات سراسری را مدیریت کنند.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item: any) => {
        router.push(`/dashboard/website/global-pages/${item.id}`);
    };

    const handleDelete = async (item: any) => {
        if (confirm('آیا از حذف این مورد اطمینان دارید؟')) {
            try {
                await api.delete(`/website/global-pages/${item.id}/`);
                fetchItems();
            } catch (error) {
                console.error('Error deleting item:', error);
                alert('خطا در حذف');
            }
        }
    };

    const columns = [
        { key: 'id', label: 'شناسه' },
        { key: 'title', label: 'عنوان' },
        { key: 'slug', label: 'نامک' },
        { key: 'order', label: 'ترتیب' },
        { key: 'is_published', label: 'منتشر شده', render: (value: boolean) => <span className={`px-2 py-1 rounded text-xs ${value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{value ? 'بله' : 'خیر'}</span> }
    ];

    if (error) {
        return (
            <div>
                <PageHeader
                    title="صفحات سراسری"
                    subtitle="مدیریت صفحات سراسری وب‌سایت"
                />
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                title="صفحات سراسری"
                subtitle="مدیریت صفحات سراسری وب‌سایت (فقط سوپریوزر)"
                action={
                    <button
                        onClick={() => router.push('/dashboard/website/global-pages/create')}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        افزودن صفحه سراسری جدید
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
