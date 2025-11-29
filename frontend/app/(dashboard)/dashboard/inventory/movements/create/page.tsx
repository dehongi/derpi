'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import api from '@/utils/api';

export default function CreateStockMovementPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [items, setItems] = useState([]);
    const [warehouses, setWarehouses] = useState([]);

    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        movement_type: 'in',
        quantity: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [itemsRes, warehousesRes] = await Promise.all([
                    api.get('/inventory/items/'),
                    api.get('/inventory/warehouses/')
                ]);
                setItems(itemsRes.data);
                setWarehouses(warehousesRes.data);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };
        fetchData();
    }, []);

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
            await api.post('/inventory/movements/', formData);
            setSuccess('گردش کالا با موفقیت ثبت شد');
            setTimeout(() => {
                router.push('/dashboard/inventory/movements');
            }, 1500);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'خطا در ثبت');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <PageHeader
                title="ثبت گردش کالا"
                subtitle="ثبت ورود، خروج یا انتقال کالا"
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
                            نوع حرکت <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="movement_type"
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                            onChange={handleChange}
                            defaultValue="in"
                        >
                            <option value="in">ورود</option>
                            <option value="out">خروج</option>
                            <option value="transfer">انتقال</option>
                            <option value="adjustment">تعدیل</option>
                        </select>
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            تاریخ <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            name="date"
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                            onChange={handleChange}
                            defaultValue={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            انبار <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="warehouse"
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                            onChange={handleChange}
                        >
                            <option value="">انتخاب انبار...</option>
                            {warehouses.map((w: any) => (
                                <option key={w.id} value={w.id}>{w.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            کالا <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="item"
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                            onChange={handleChange}
                        >
                            <option value="">انتخاب کالا...</option>
                            {items.map((i: any) => (
                                <option key={i.id} value={i.id}>{i.name} ({i.sku})</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            تعداد <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="quantity"
                            required
                            min="0.01"
                            step="0.01"
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            شماره مرجع
                        </label>
                        <input
                            type="text"
                            name="reference_number"
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                            onChange={handleChange}
                            placeholder="مثلا شماره فاکتور یا حواله"
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            یادداشت‌ها
                        </label>
                        <textarea
                            name="notes"
                            rows={3}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="mt-8 flex gap-4 border-t pt-6">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {loading ? 'در حال ثبت...' : 'ثبت'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard/inventory/movements')}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300"
                    >
                        انصراف
                    </button>
                </div>
            </form>
        </div>
    );
}
