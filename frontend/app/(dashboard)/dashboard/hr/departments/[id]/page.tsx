'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import { getDepartment, updateDepartment, deleteDepartment } from '@/lib/api/hr';
import { Department } from '@/lib/types/hr';

export default function EditDepartmentPage() {
    const router = useRouter();
    const params = useParams();
    const id = Number(params.id);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState<Partial<Department>>({});

    useEffect(() => {
        if (id) {
            fetchItem();
        }
    }, [id]);

    const fetchItem = async () => {
        try {
            const response = await getDepartment(id);
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
        setFormData(prev => ({
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
            await updateDepartment(id, formData);
            setSuccess('تغییرات با موفقیت ذخیره شد');
            setTimeout(() => {
                router.push('/dashboard/hr/departments');
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
                await deleteDepartment(id);
                router.push('/dashboard/hr/departments');
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
                title="ویرایش بخش"
                subtitle="ویرایش اطلاعات بخش"
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
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">نام بخش</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            value={formData.name || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">توضیحات</label>
                        <textarea
                            name="description"
                            id="description"
                            rows={3}
                            value={formData.description || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="is_active"
                            id="is_active"
                            checked={formData.is_active || false}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                            فعال
                        </label>
                    </div>
                </div>

                <div className="mt-6 flex gap-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard/hr/departments')}
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
