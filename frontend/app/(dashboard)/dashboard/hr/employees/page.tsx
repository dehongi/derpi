'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import { getEmployees, deleteEmployee } from '@/lib/api/hr';
import { Employee } from '@/lib/types/hr';

export default function EmployeesPage() {
    const router = useRouter();
    const [items, setItems] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await getEmployees();
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item: Employee) => {
        router.push(`/dashboard/hr/employees/${item.id}`);
    };

    const handleDelete = async (item: Employee) => {
        if (confirm('آیا از حذف این مورد اطمینان دارید؟')) {
            try {
                await deleteEmployee(item.id);
                fetchItems();
            } catch (error) {
                console.error('Error deleting item:', error);
                alert('خطا در حذف');
            }
        }
    };

    const columns = [
        { key: 'id', label: 'شناسه' },
        { key: 'employee_number', label: 'شماره پرسنلی' },
        { key: 'first_name', label: 'نام' },
        { key: 'last_name', label: 'نام خانوادگی' },
        { key: 'position', label: 'سمت' },
        { key: 'status', label: 'وضعیت' }
    ];

    return (
        <div>
            <PageHeader
                title="کارمندان"
                subtitle="مدیریت کارمندان"
                action={
                    <button
                        onClick={() => router.push('/dashboard/hr/employees/create')}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        افزودن کارمند جدید
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
