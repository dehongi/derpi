'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import api from '@/utils/api';

export default function CreateJournalEntryPage() {
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
            await api.post('/accounting/journal-entrys/', formData);
            setSuccess('سند با موفقیت ایجاد شد');
            setTimeout(() => {
                router.push('/dashboard/accounting/journal-entrys');
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
                title="افزودن سند جدید"
                subtitle="ایجاد سند جدید در سیستم"
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
                    فرم ایجاد سند - فیلدها باید بر اساس مدل تکمیل شوند
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
                        onClick={() => router.push('/dashboard/accounting/journal-entrys')}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300"
                    >
                        انصراف
                    </button>
                </div>
            </form>
        </div>
    );
}
