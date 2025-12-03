'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import { JalaliDateDisplay } from '@/components/JalaliDatePicker';
import { getLeaves, deleteLeave } from '@/lib/api/hr';
import { Leave } from '@/lib/types/hr';

export default function LeavesPage() {
    const router = useRouter();
    const [items, setItems] = useState<Leave[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await getLeaves();
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item: Leave) => {
        router.push(`/dashboard/hr/leaves/${item.id}`);
    };

    const handleDelete = async (item: Leave) => {
        if (confirm('آیا از حذف این مورد اطمینان دارید؟')) {
            try {
                await deleteLeave(item.id);
                fetchItems();
            } catch (error) {
                console.error('Error deleting item:', error);
                alert('خطا در حذف');
            }
        }
    };

    const columns = [
        { key: 'id', label: 'شناسه' },
        { key: 'leave_type', label: 'نوع مرخصی' },
        { key: 'start_date', label: 'تاریخ شروع', render: (value: string) => <JalaliDateDisplay date={value} /> },
        { key: 'end_date', label: 'تاریخ پایان', render: (value: string) => <JalaliDateDisplay date={value} /> },
        { key: 'days', label: 'تعداد روز' },
        { key: 'status', label: 'وضعیت' }
    ];

    return (
        <div>
            <PageHeader
                title="مرخصی‌ها"
                subtitle="مدیریت مرخصی‌ها"
                action={
                    <button
                        onClick={() => router.push('/dashboard/hr/leaves/create')}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        افزودن مرخصی جدید
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
