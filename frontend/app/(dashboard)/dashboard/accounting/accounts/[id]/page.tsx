'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import api from '@/utils/api';

export default function EditChartOfAccountsPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id;

    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [accounts, setAccounts] = useState([]);

    const [formData, setFormData] = useState({
        code: '',
        name: '',
        account_type: 'asset',
        parent: '',
        is_active: true
    });

    useEffect(() => {
        if (id) {
            fetchAccount();
            fetchAccounts();
        }
    }, [id]);

    const fetchAccount = async () => {
        try {
            const response = await api.get(`/accounting/accounts/${id}/`);
            const data = response.data;
            setFormData({
                code: data.code || '',
                name: data.name || '',
                account_type: data.account_type || 'asset',
                parent: data.parent || '',
                is_active: data.is_active !== undefined ? data.is_active : true
            });
        } catch (error) {
            console.error('Error fetching account:', error);
            setError('خطا در بارگذاری اطلاعات');
        } finally {
            setFetchLoading(false);
        }
    };

    const fetchAccounts = async () => {
        try {
            const response = await api.get('/accounting/accounts/');
            setAccounts(response.data.filter((acc: any) => acc.id !== Number(id)));
        } catch (error) {
            console.error('Error fetching accounts:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const submitData = {
                ...formData,
                parent: formData.parent || null
            };
            await api.put(`/accounting/accounts/${id}/`, submitData);
            setSuccess('حساب با موفقیت بروزرسانی شد');
            setTimeout(() => {
                router.push('/dashboard/accounting/accounts');
            }, 1500);
        } catch (err: any) {
            setError(err.response?.data?.detail || JSON.stringify(err.response?.data) || 'خطا در بروزرسانی');
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return <div className="text-center py-8">در حال بارگذاری...</div>;
    }

    return (
        <div>
            <PageHeader
                title="ویرایش حساب"
                subtitle="ویرایش اطلاعات حساب"
            />

            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">کد حساب *</label>
                        <input
                            type="text"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">نام حساب *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">نوع حساب *</label>
                        <select
                            name="account_type"
                            value={formData.account_type}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="asset">دارایی</option>
                            <option value="liability">بدهی</option>
                            <option value="equity">حقوق صاحبان سهام</option>
                            <option value="revenue">درآمد</option>
                            <option value="expense">هزینه</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">حساب والد</label>
                        <select
                            name="parent"
                            value={formData.parent}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">بدون والد</option>
                            {accounts.map((account: any) => (
                                <option key={account.id} value={account.id}>
                                    {account.code} - {account.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            <span className="text-sm font-medium">فعال</span>
                        </label>
                    </div>
                </div>

                <div className="mt-6 flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {loading ? 'در حال ذخیره...' : 'ذخیره'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard/accounting/accounts')}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300"
                    >
                        انصراف
                    </button>
                </div>
            </form>
        </div>
    );
}
