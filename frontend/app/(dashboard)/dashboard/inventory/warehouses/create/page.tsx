'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import api from '@/utils/api';

export default function CreateWarehousePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await api.post('/inventory/warehouses/', formData);
            setSuccess('انبار با موفقیت ایجاد شد');
            setTimeout(() => {
                router.push('/dashboard/inventory/warehouses');
            }, 1500);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'خطا در ایجاد');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <PageHeader
                title="افزودن انبار جدید"
                subtitle="ایجاد انبار جدید در سیستم"
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
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            نام انبار <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            کد انبار <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="code"
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            موقعیت
                        </label>
                        <textarea
                            name="location"
                            rows={3}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="is_active"
                                defaultChecked={true}
                                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                            />
                            <span className="text-sm text-gray-700">انبار فعال است</span>
                        </label>
                    </div>
                </div>

                <div className="mt-8 flex gap-4 border-t pt-6">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {loading ? 'در حال ذخیره...' : 'ذخیره'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard/inventory/warehouses')}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300"
                    >
                        انصراف
                    </button>
                </div>
            </form>
        </div>
    );
}
