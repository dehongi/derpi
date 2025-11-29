'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import { getLeads, deleteLead } from '@/lib/api/crm';

export default function LeadsPage() {
    const router = useRouter();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await getLeads();
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item: any) => {
        router.push(`/dashboard/crm/leads/${item.id}`);
    };

    const handleDelete = async (item: any) => {
        if (confirm('آیا از حذف این سرنخ اطمینان دارید؟')) {
            try {
                await deleteLead(item.id);
                fetchItems();
            } catch (error) {
                console.error('Error deleting item:', error);
                alert('خطا در حذف');
            }
        }
    };

    const getStatusBadge = (status: string) => {
        const statusMap: any = {
            'new': { label: 'جدید', color: 'bg-blue-100 text-blue-800' },
            'contacted': { label: 'تماس گرفته شده', color: 'bg-yellow-100 text-yellow-800' },
            'qualified': { label: 'واجد شرایط', color: 'bg-green-100 text-green-800' },
            'lost': { label: 'از دست رفته', color: 'bg-red-100 text-red-800' }
        };
        const statusInfo = statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
        return <span className={`px-2 py-1 rounded text-xs font-medium ${statusInfo.color}`}>{statusInfo.label}</span>;
    };

    const getSourceLabel = (source: string) => {
        const sourceMap: any = {
            'website': 'وب‌سایت',
            'referral': 'معرفی',
            'cold_call': 'تماس سرد',
            'social_media': 'شبکه‌های اجتماعی',
            'other': 'سایر'
        };
        return sourceMap[source] || source;
    };

    const columns = [
        { key: 'id', label: 'شناسه' },
        { key: 'name', label: 'نام' },
        { key: 'email', label: 'ایمیل' },
        { key: 'phone', label: 'تلفن' },
        {
            key: 'source',
            label: 'منبع',
            render: (item: any) => getSourceLabel(item.source)
        },
        {
            key: 'status',
            label: 'وضعیت',
            render: (item: any) => getStatusBadge(item.status)
        },
        {
            key: 'created_at',
            label: 'تاریخ ایجاد',
            render: (item: any) => new Date(item.created_at).toLocaleDateString('fa-IR')
        }
    ];

    return (
        <div>
            <PageHeader
                title="سرنخ‌ها"
                subtitle="مدیریت سرنخ‌های فروش"
                action={
                    <button
                        onClick={() => router.push('/dashboard/crm/leads/create')}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        + افزودن سرنخ جدید
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
