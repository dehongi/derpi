'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import { getActivities, deleteActivity } from '@/lib/api/crm';

export default function ActivitiesPage() {
    const router = useRouter();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'overdue'>('all');

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await getActivities();
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item: any) => {
        router.push(`/dashboard/crm/activities/${item.id}`);
    };

    const handleDelete = async (item: any) => {
        if (confirm('آیا از حذف این فعالیت اطمینان دارید؟')) {
            try {
                await deleteActivity(item.id);
                fetchItems();
            } catch (error) {
                console.error('Error deleting item:', error);
                alert('خطا در حذف');
            }
        }
    };

    const getActivityTypeBadge = (type: string) => {
        const typeMap: any = {
            'call': { label: '📞 تماس', color: 'bg-blue-100 text-blue-800' },
            'meeting': { label: '🤝 جلسه', color: 'bg-purple-100 text-purple-800' },
            'email': { label: '📧 ایمیل', color: 'bg-green-100 text-green-800' },
            'task': { label: '✓ وظیفه', color: 'bg-orange-100 text-orange-800' }
        };
        const typeInfo = typeMap[type] || { label: type, color: 'bg-gray-100 text-gray-800' };
        return <span className={`px-2 py-1 rounded text-xs font-medium ${typeInfo.color}`}>{typeInfo.label}</span>;
    };

    const isOverdue = (item: any) => {
        if (item.completed || !item.due_date) return false;
        return new Date(item.due_date) < new Date();
    };

    const getFilteredItems = () => {
        const now = new Date();
        switch (filter) {
            case 'pending':
                return items.filter((item: any) => !item.completed);
            case 'completed':
                return items.filter((item: any) => item.completed);
            case 'overdue':
                return items.filter((item: any) => !item.completed && item.due_date && new Date(item.due_date) < now);
            default:
                return items;
        }
    };

    const columns = [
        { key: 'id', label: 'شناسه' },
        {
            key: 'activity_type',
            label: 'نوع',
            render: (item: any) => getActivityTypeBadge(item.activity_type)
        },
        {
            key: 'subject',
            label: 'موضوع',
            render: (item: any) => (
                <span className={isOverdue(item) ? 'text-red-600 font-medium' : ''}>
                    {item.subject}
                    {isOverdue(item) && ' ⚠️'}
                </span>
            )
        },
        {
            key: 'related_to',
            label: 'مرتبط با',
            render: (item: any) => item.object_id ? `ID: ${item.object_id}` : '-'
        },
        {
            key: 'due_date',
            label: 'سررسید',
            render: (item: any) => item.due_date
                ? new Date(item.due_date).toLocaleDateString('fa-IR')
                : '-'
        },
        {
            key: 'completed',
            label: 'وضعیت',
            render: (item: any) => item.completed
                ? <span className="text-green-600 font-medium">✓ انجام شده</span>
                : <span className="text-gray-600">در انتظار</span>
        }
    ];

    const filteredItems = getFilteredItems();

    return (
        <div>
            <PageHeader
                title="فعالیت‌ها"
                subtitle="مدیریت تماس‌ها، جلسات، ایمیل‌ها و وظایف"
                action={
                    <button
                        onClick={() => router.push('/dashboard/crm/activities/create')}
                        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                    >
                        + افزودن فعالیت جدید
                    </button>
                }
            />

            {/* Filter Tabs */}
            <div className="mb-6 flex gap-2">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    همه ({items.length})
                </button>
                <button
                    onClick={() => setFilter('pending')}
                    className={`px-4 py-2 rounded ${filter === 'pending' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    در انتظار ({items.filter((i: any) => !i.completed).length})
                </button>
                <button
                    onClick={() => setFilter('completed')}
                    className={`px-4 py-2 rounded ${filter === 'completed' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    انجام شده ({items.filter((i: any) => i.completed).length})
                </button>
                <button
                    onClick={() => setFilter('overdue')}
                    className={`px-4 py-2 rounded ${filter === 'overdue' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    معوقه ({items.filter((i: any) => !i.completed && i.due_date && new Date(i.due_date) < new Date()).length})
                </button>
            </div>

            <DataTable
                columns={columns}
                data={filteredItems}
                onEdit={handleEdit}
                onDelete={handleDelete}
                loading={loading}
            />
        </div>
    );
}
