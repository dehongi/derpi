'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import ProductForm from '@/components/ProductForm';
import api from '@/utils/api';

export default function EditProductPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id;

    const [loading, setLoading] = useState(true);
    const [item, setItem] = useState<any>(null);

    useEffect(() => {
        if (id) {
            fetchItem();
        }
    }, [id]);

    const fetchItem = async () => {
        try {
            const response = await api.get(`/ecommerce/products/${id}/`);
            setItem(response.data);
        } catch (error) {
            console.error('Error fetching item:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (confirm('آیا از حذف این مورد اطمینان دارید؟')) {
            try {
                await api.delete(`/ecommerce/products/${id}/`);
                router.push('/dashboard/ecommerce/products');
            } catch (error) {
                console.error('Error deleting item:', error);
                alert('خطا در حذف');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-500">در حال بارگذاری...</div>
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                title="ویرایش محصول"
                subtitle={`ویرایش محصول: ${item?.name}`}
                action={
                    <button
                        onClick={handleDelete}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        حذف محصول
                    </button>
                }
            />

            <ProductForm initialData={item} isEditing={true} />
        </div>
    );
}
