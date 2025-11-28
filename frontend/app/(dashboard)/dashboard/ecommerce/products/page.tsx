'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import api from '@/utils/api';

export default function ProductsPage() {
    const router = useRouter();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await api.get('/ecommerce/products/');
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item: any) => {
        router.push(`/dashboard/ecommerce/products/${item.id}`);
    };

    const handleDelete = async (item: any) => {
        if (confirm('آیا از حذف این مورد اطمینان دارید؟')) {
            try {
                await api.delete(`/ecommerce/products/${item.id}/`);
                fetchItems();
            } catch (error) {
                console.error('Error deleting item:', error);
                alert('خطا در حذف');
            }
        }
    };

    const columns = [
        {
            key: 'images',
            label: 'تصویر',
            render: (value: any) => {
                const img = Array.isArray(value) && value.length > 0 ? value[0] : value;
                return img ? <img src={img} alt="" className="w-10 h-10 object-cover rounded" /> : <div className="w-10 h-10 bg-gray-200 rounded"></div>;
            }
        },
        { key: 'name', label: 'نام محصول' },
        { key: 'category_name', label: 'دسته‌بندی' },
        { key: 'sku', label: 'کد محصول' },
        { key: 'price', label: 'قیمت', render: (value: number) => value ? parseInt(value.toString()).toLocaleString('fa-IR') + ' ریال' : '-' },
        { key: 'stock_quantity', label: 'موجودی' },
        {
            key: 'is_active',
            label: 'وضعیت',
            render: (value: boolean) => (
                <span className={`px-2 py-1 rounded text-xs ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {value ? 'فعال' : 'غیرفعال'}
                </span>
            )
        }
    ];

    return (
        <div>
            <PageHeader
                title="محصولات"
                subtitle="مدیریت محصولات"
                action={
                    <button
                        onClick={() => router.push('/dashboard/ecommerce/products/create')}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        افزودن محصول جدید
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
