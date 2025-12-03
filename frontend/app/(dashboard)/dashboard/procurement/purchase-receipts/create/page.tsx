'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import JalaliDatePicker from '@/components/JalaliDatePicker';
import api from '@/utils/api';

export default function CreatePurchaseReceiptPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [formData, setFormData] = useState({
        receipt_number: '',
        purchase_order: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
    });

    useEffect(() => {
        fetchPurchaseOrders();
    }, []);

    const fetchPurchaseOrders = async () => {
        try {
            // TODO: Filter for confirmed POs only?
            const response = await api.get('/procurement/purchase-orders/');
            setPurchaseOrders(response.data);
        } catch (error) {
            console.error('Error fetching purchase orders:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/procurement/purchase-receipts/', formData);
            router.push(`/dashboard/procurement/purchase-receipts/${response.data.id}`);
        } catch (error) {
            console.error('Error creating purchase receipt:', error);
            alert('خطا در ایجاد رسید خرید');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <PageHeader
                title="افزودن رسید خرید جدید"
                subtitle="ایجاد رسید خرید برای سفارش‌های خرید"
            />

            <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                شماره رسید
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
                                value={formData.receipt_number}
                                onChange={(e) => setFormData({ ...formData, receipt_number: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                سفارش خرید
                            </label>
                            <select
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
                                value={formData.purchase_order}
                                onChange={(e) => setFormData({ ...formData, purchase_order: e.target.value })}
                            >
                                <option value="">انتخاب کنید...</option>
                                {purchaseOrders.map((po: any) => (
                                    <option key={po.id} value={po.id}>
                                        {po.po_number} - {po.supplier_name || `Supplier ${po.supplier}`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <JalaliDatePicker
                                label="تاریخ"
                                value={formData.date}
                                onChange={(date) => setFormData({ ...formData, date })}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            یادداشت‌ها
                        </label>
                        <textarea
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            انصراف
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'در حال ثبت...' : 'ثبت رسید'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
