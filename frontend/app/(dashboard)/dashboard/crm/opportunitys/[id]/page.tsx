'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import api from '@/utils/api';

export default function EditOpportunityPage() {
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
            const response = await api.get(`/crm/opportunitys/${id}/`);
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
            await api.put(`/crm/opportunitys/${id}/`, formData);
            setSuccess('تغییرات با موفقیت ذخیره شد');
            setTimeout(() => {
                router.push('/dashboard/crm/opportunitys');
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
                await api.delete(`/crm/opportunitys/${id}/`);
                router.push('/dashboard/crm/opportunitys');
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
                <div className="text-gray-500 text-center py-8">
                    فرم ویرایش - فیلدها باید بر اساس مدل تکمیل شوند
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
                        onClick={() => router.push('/dashboard/crm/opportunitys')}
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
