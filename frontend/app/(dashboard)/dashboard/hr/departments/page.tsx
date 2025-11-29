'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import { getDepartments, deleteDepartment } from '@/lib/api/hr';
import { Department } from '@/lib/types/hr';

export default function DepartmentsPage() {
    const router = useRouter();
    const [items, setItems] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await getDepartments();
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item: Department) => {
        router.push(`/dashboard/hr/departments/${item.id}`);
    };

    const handleDelete = async (item: Department) => {
        if (confirm('آیا از حذف این مورد اطمینان دارید؟')) {
            try {
                await deleteDepartment(item.id);
                fetchItems();
            } catch (error) {
                console.error('Error deleting item:', error);
                alert('خطا در حذف');
            }
        }
    };

    const columns = [
        { key: 'id', label: 'شناسه' },
        { key: 'name', label: 'نام بخش' },
        { key: 'description', label: 'توضیحات' },
        { key: 'is_active', label: 'وضعیت', render: (value: boolean) => <span className={`px-2 py-1 rounded text-xs ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{value ? 'فعال' : 'غیرفعال'}</span> }
    ];

    return (
        <div>
            <PageHeader
                title="بخش‌ها"
                subtitle="مدیریت بخش‌ها"
                action={
                    <button
                        onClick={() => router.push('/dashboard/hr/departments/create')}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        افزودن بخش جدید
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
