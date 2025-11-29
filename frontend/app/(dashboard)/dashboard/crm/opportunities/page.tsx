'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import { getOpportunities, deleteOpportunity } from '@/lib/api/crm';

export default function OpportunitiesPage() {
    const router = useRouter();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await getOpportunities();
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item: any) => {
        router.push(`/dashboard/crm/opportunities/${item.id}`);
    };

    const handleDelete = async (item: any) => {
        if (confirm('آیا از حذف این فرصت اطمینان دارید؟')) {
            try {
                await deleteOpportunity(item.id);
                fetchItems();
            } catch (error) {
                console.error('Error deleting item:', error);
                alert('خطا در حذف');
            }
        }
    };

    const getStageBadge = (stage: string) => {
        const stageMap: any = {
            'prospecting': { label: 'جستجو', color: 'bg-blue-100 text-blue-800' },
            'qualification': { label: 'ارزیابی', color: 'bg-indigo-100 text-indigo-800' },
            'proposal': { label: 'پیشنهاد', color: 'bg-purple-100 text-purple-800' },
            'negotiation': { label: 'مذاکره', color: 'bg-orange-100 text-orange-800' },
            'closed_won': { label: 'بسته شده - برنده', color: 'bg-green-100 text-green-800' },
            'closed_lost': { label: 'بسته شده - بازنده', color: 'bg-red-100 text-red-800' }
        };
        const stageInfo = stageMap[stage] || { label: stage, color: 'bg-gray-100 text-gray-800' };
        return <span className={`px-2 py-1 rounded text-xs font-medium ${stageInfo.color}`}>{stageInfo.label}</span>;
    };

    const columns = [
        { key: 'id', label: 'شناسه' },
        { key: 'title', label: 'عنوان' },
        {
            key: 'value',
            label: 'ارزش',
            render: (item: any) => `${parseFloat(item.value).toLocaleString()} ریال`
        },
        {
            key: 'probability',
            label: 'احتمال',
            render: (item: any) => `${item.probability}%`
        },
        {
            key: 'weighted_value',
            label: 'ارزش موزون',
            render: (item: any) => {
                const weighted = (parseFloat(item.value) * item.probability) / 100;
                return `${weighted.toLocaleString()} ریال`;
            }
        },
        {
            key: 'stage',
            label: 'مرحله',
            render: (item: any) => getStageBadge(item.stage)
        },
        {
            key: 'expected_close_date',
            label: 'تاریخ بسته شدن',
            render: (item: any) => item.expected_close_date
                ? new Date(item.expected_close_date).toLocaleDateString('fa-IR')
                : '-'
        }
    ];

    return (
        <div>
            <PageHeader
                title="فرصت‌ها"
                subtitle="مدیریت فرصت‌های فروش"
                action={
                    <button
                        onClick={() => router.push('/dashboard/crm/opportunities/create')}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        + افزودن فرصت جدید
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
