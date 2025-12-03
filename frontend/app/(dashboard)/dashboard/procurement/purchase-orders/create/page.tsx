'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import JalaliDatePicker from '@/components/JalaliDatePicker';
import api from '@/utils/api';

export default function CreatePurchaseOrderPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [suppliers, setSuppliers] = useState([]);

    const [formData, setFormData] = useState({
        po_number: '',
        supplier: '',
        date: new Date().toISOString().split('T')[0],
        expected_delivery_date: '',
        status: 'draft',
        notes: ''
    });

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const response = await api.get('/procurement/suppliers/');
            setSuppliers(response.data);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        }
    };

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
            const response = await api.post('/procurement/purchase-orders/', formData);
            setSuccess('سفارش خرید با موفقیت ایجاد شد');
            setTimeout(() => {
                // Redirect to edit page to add items
                router.push(`/dashboard/procurement/purchase-orders/${response.data.id}`);
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
                title="افزودن سفارش خرید جدید"
                subtitle="ایجاد سفارش خرید جدید در سیستم"
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            شماره سفارش
                        </label>
                        <input
                            type="text"
                            name="po_number"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
                            value={formData.po_number}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            تامین‌کننده
                        </label>
                        <select
                            name="supplier"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
                            value={formData.supplier}
                            onChange={handleChange}
                        >
                            <option value="">انتخاب کنید...</option>
                            {suppliers.map((supplier: any) => (
                                <option key={supplier.id} value={supplier.id}>
                                    {supplier.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <JalaliDatePicker
                            label="تاریخ"
                            value={formData.date}
                            onChange={(date) => setFormData(prev => ({ ...prev, date }))}
                            required
                        />
                    </div>

                    <div>
                        <JalaliDatePicker
                            label="تاریخ تحویل مورد انتظار"
                            value={formData.expected_delivery_date}
                            onChange={(date) => setFormData(prev => ({ ...prev, expected_delivery_date: date }))}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            وضعیت
                        </label>
                        <select
                            name="status"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="draft">پیش‌نویس</option>
                            <option value="sent">ارسال شده</option>
                            <option value="confirmed">تایید شده</option>
                            <option value="received">دریافت شده</option>
                            <option value="cancelled">لغو شده</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            یادداشت‌ها
                        </label>
                        <textarea
                            name="notes"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
                            value={formData.notes}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="mt-6 flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {loading ? 'در حال ذخیره...' : 'ذخیره و ادامه'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard/procurement/purchase-orders')}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300"
                    >
                        انصراف
                    </button>
                </div>
            </form>
        </div>
    );
}
