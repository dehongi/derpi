'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import { getAttendances, deleteAttendance } from '@/lib/api/hr';
import { Attendance } from '@/lib/types/hr';

export default function AttendancesPage() {
    const router = useRouter();
    const [items, setItems] = useState<Attendance[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await getAttendances();
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item: Attendance) => {
        router.push(`/dashboard/hr/attendances/${item.id}`);
    };

    const handleDelete = async (item: Attendance) => {
        if (confirm('آیا از حذف این مورد اطمینان دارید؟')) {
            try {
                await deleteAttendance(item.id);
                fetchItems();
            } catch (error) {
                console.error('Error deleting item:', error);
                alert('خطا در حذف');
            }
        }
    };

    const columns = [
        { key: 'id', label: 'شناسه' },
        { key: 'employee', label: 'کارمند' },
        { key: 'date', label: 'تاریخ' },
        { key: 'check_in', label: 'ورود' },
        { key: 'check_out', label: 'خروج' },
        { key: 'status', label: 'وضعیت' }
    ];

    return (
        <div>
            <PageHeader
                title="حضور و غیاب"
                subtitle="مدیریت حضور و غیاب"
                action={
                    <button
                        onClick={() => router.push('/dashboard/hr/attendances/create')}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        ثبت حضور و غیاب
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
