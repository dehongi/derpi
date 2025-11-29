'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import api from '@/utils/api';

export default function ChartOfAccountsPage() {
    const router = useRouter();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creatingDefault, setCreatingDefault] = useState(false);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await api.get('/accounting/accounts/');
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item: any) => {
        router.push(`/dashboard/accounting/accounts/${item.id}`);
    };

    const handleDelete = async (item: any) => {
        if (confirm('آیا از حذف این مورد اطمینان دارید؟')) {
            try {
                await api.delete(`/accounting/accounts/${item.id}/`);
                fetchItems();
            } catch (error) {
                console.error('Error deleting item:', error);
                alert('خطا در حذف');
            }
        }
    };

    const createDefaultChart = async () => {
        if (!confirm('آیا می‌خواهید دفتر حساب‌های پیش‌فرض ایجاد شود؟')) {
            return;
        }

        setCreatingDefault(true);
        try {
            const response = await api.post('/accounting/accounts/create-default/');
            alert(response.data.message || 'دفتر حساب‌های پیش‌فرض با موفقیت ایجاد شد');
            fetchItems();
        } catch (error: any) {
            console.error('Error creating default chart:', error);
            alert(error.response?.data?.error || 'خطا در ایجاد دفتر حساب‌های پیش‌فرض');
        } finally {
            setCreatingDefault(false);
        }
    };

    const accountTypeLabels: Record<string, string> = {
        'asset': 'دارایی',
        'liability': 'بدهی',
        'equity': 'حقوق صاحبان سهام',
        'revenue': 'درآمد',
        'expense': 'هزینه'
    };

    const columns = [
        { key: 'id', label: 'شناسه' },
        { key: 'code', label: 'کد حساب' },
        { key: 'name', label: 'نام حساب' },
        { key: 'account_type', label: 'نوع حساب', render: (value: string) => accountTypeLabels[value] || value },
        { key: 'is_active', label: 'وضعیت', render: (value: boolean) => <span className={`px-2 py-1 rounded text-xs ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{value ? 'فعال' : 'غیرفعال'}</span> }
    ];

    return (
        <div>
            <PageHeader
                title="دفتر حساب‌ها"
                subtitle="مدیریت دفتر حساب‌ها"
                action={
                    <div className="flex gap-2">
                        {items.length === 0 && !loading && (
                            <button
                                onClick={createDefaultChart}
                                disabled={creatingDefault}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
                            >
                                {creatingDefault ? 'در حال ایجاد...' : 'ایجاد دفتر حساب‌های پیش‌فرض'}
                            </button>
                        )}
                        <button
                            onClick={() => router.push('/dashboard/accounting/accounts/create')}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            افزودن حساب جدید
                        </button>
                    </div>
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
