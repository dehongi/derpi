'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import api from '@/utils/api';

export default function BlogPostsPage() {
    const router = useRouter();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await api.get('/website/blog-posts/');
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item: any) => {
        router.push(`/dashboard/website/blog-posts/${item.id}`);
    };

    const handleDelete = async (item: any) => {
        if (confirm('آیا از حذف این مورد اطمینان دارید؟')) {
            try {
                await api.delete(`/website/blog-posts/${item.id}/`);
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
        { key: 'category', label: 'دسته‌بندی' },
        { key: 'views', label: 'بازدید' },
        { key: 'is_published', label: 'منتشر شده', render: (value: boolean) => <span className={`px-2 py-1 rounded text-xs ${value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{value ? 'بله' : 'خیر'}</span> }
    ];

    return (
        <div>
            <PageHeader
                title="پست‌های وبلاگ"
                subtitle="مدیریت پست‌های وبلاگ"
                action={
                    <button
                        onClick={() => router.push('/dashboard/website/blog-posts/create')}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        افزودن پست جدید
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
