'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import { JalaliDateDisplay } from '@/components/JalaliDatePicker';
import api from '@/utils/api';

export default function JournalEntriesPage() {
    const router = useRouter();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await api.get('/accounting/journal-entries/');
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item: any) => {
        router.push(`/dashboard/accounting/journals/${item.id}`);
    };

    const handleDelete = async (item: any) => {
        if (confirm('آیا از حذف این مورد اطمینان دارید؟')) {
            try {
                await api.delete(`/accounting/journal-entries/${item.id}/`);
                fetchItems();
            } catch (error) {
                console.error('Error deleting item:', error);
                alert('خطا در حذف');
            }
        }
    };

    const statusLabels: Record<string, string> = {
        'draft': 'پیش‌نویس',
        'posted': 'ثبت شده',
        'cancelled': 'لغو شده'
    };

    const columns = [
        { key: 'id', label: 'شناسه' },
        { key: 'entry_number', label: 'شماره سند' },
        { key: 'date', label: 'تاریخ', render: (value: string) => <JalaliDateDisplay date={value} /> },
        { key: 'description', label: 'شرح' },
        {
            key: 'status', label: 'وضعیت', render: (value: string) => {
                const colors: Record<string, string> = {
                    'draft': 'bg-yellow-100 text-yellow-800',
                    'posted': 'bg-green-100 text-green-800',
                    'cancelled': 'bg-red-100 text-red-800'
                };
                return <span className={`px-2 py-1 rounded text-xs ${colors[value] || ''}`}>{statusLabels[value] || value}</span>;
            }
        }
    ];

    return (
        <div>
            <PageHeader
                title="اسناد حسابداری"
                subtitle="مدیریت اسناد حسابداری"
                action={
                    <button
                        onClick={() => router.push('/dashboard/accounting/journals/create')}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        افزودن سند جدید
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
