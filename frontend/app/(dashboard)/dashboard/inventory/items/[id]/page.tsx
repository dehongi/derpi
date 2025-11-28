'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import api from '@/utils/api';

export default function EditItemPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        if (id) {
            fetchItem();
        }
    }, [id]);

    const fetchItem = async () => {
        try {
            const response = await api.get(`/inventory/items/${id}/`);
            setFormData(response.data);
        } catch (error) {
            console.error('Error fetching item:', error);
            setError('خطا در بارگذاری اطلاعات');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev: any) => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            await api.put(`/inventory/items/${id}/`, formData);
            setSuccess('تغییرات با موفقیت ذخیره شد');
            setTimeout(() => {
                router.push('/dashboard/inventory/items');
            }, 1500);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'خطا در ذخیره تغییرات');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (confirm('آیا از حذف این مورد اطمینان دارید؟')) {
            try {
                await api.delete(`/inventory/items/${id}/`);
                router.push('/dashboard/inventory/items');
            } catch (error) {
                console.error('Error deleting item:', error);
                alert('خطا در حذف');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-500">در حال بارگذاری...</div>
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                title="ویرایش"
                subtitle="ویرایش اطلاعات"
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            نام کالا <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name || ''}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            کد کالا (SKU) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="sku"
                            value={formData.sku || ''}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            بارکد
                        </label>
                        <input
                            type="text"
                            name="barcode"
                            value={formData.barcode || ''}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            دسته‌بندی
                        </label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category || ''}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            واحد <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="unit"
                            value={formData.unit || 'piece'}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                            onChange={handleChange}
                        >
                            <option value="piece">عدد</option>
                            <option value="kg">کیلوگرم</option>
                            <option value="liter">لیتر</option>
                            <option value="meter">متر</option>
                            <option value="box">جعبه</option>
                            <option value="pack">بسته</option>
                        </select>
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            قیمت تمام شده
                        </label>
                        <input
                            type="number"
                            name="cost"
                            value={formData.cost || 0}
                            min="0"
                            step="0.01"
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            حداقل موجودی
                        </label>
                        <input
                            type="number"
                            name="min_stock"
                            value={formData.min_stock || 0}
                            min="0"
                            step="0.01"
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            حداکثر موجودی
                        </label>
                        <input
                            type="number"
                            name="max_stock"
                            value={formData.max_stock || 0}
                            min="0"
                            step="0.01"
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            توضیحات
                        </label>
                        <textarea
                            name="description"
                            rows={3}
                            value={formData.description || ''}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-span-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={formData.is_active || false}
                                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                onChange={handleChange}
                            />
                            <span className="text-sm text-gray-700">کالا فعال است</span>
                        </label>
                    </div>
                </div>

                <div className="mt-8 flex gap-4 border-t pt-6">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard/inventory/items')}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300"
                    >
                        انصراف
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 mr-auto"
                    >
                        حذف
                    </button>
                </div>
            </form>
        </div>
    );
}
