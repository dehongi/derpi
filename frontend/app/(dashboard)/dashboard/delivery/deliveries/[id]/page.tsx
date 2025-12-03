'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import JalaliDatePicker from '@/components/JalaliDatePicker';
import { getDelivery, updateDelivery } from '@/lib/api/delivery';
import { getContacts } from '@/lib/api/crm';
import { getSalesOrders } from '@/lib/api/sales';
import { getDrivers } from '@/lib/api/delivery';

export default function EditDeliveryPage() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [customers, setCustomers] = useState<any[]>([]);
    const [salesOrders, setSalesOrders] = useState<any[]>([]);
    const [drivers, setDrivers] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        delivery_number: '', sales_order: '', customer: '', driver: '', pickup_address: '', delivery_address: '',
        customer_phone: '', scheduled_date: '', scheduled_time: '', status: 'pending', priority: 1, distance: '',
        delivery_fee: '0', tracking_code: '', notes: '', internal_notes: '', company: '1'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [deliveryRes, customersRes, salesOrdersRes, driversRes] = await Promise.all([
                getDelivery(params.id as string),
                getContacts(),
                getSalesOrders(),
                getDrivers()
            ]);
            setFormData(deliveryRes.data);
            setCustomers(customersRes.data);
            setSalesOrders(salesOrdersRes.data);
            setDrivers(driversRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date: string) => {
        setFormData(prev => ({ ...prev, scheduled_date: date }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateDelivery(params.id as string, formData);
            alert('حواله با موفقیت بروزرسانی شد');
            router.push('/dashboard/delivery/deliveries');
        } catch (error) {
            console.error('Error updating delivery:', error);
            alert('خطا در بروزرسانی حواله');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64"><div className="text-gray-500">در حال بارگذاری...</div></div>;

    return (
        <div>
            <PageHeader title="ویرایش حواله" subtitle="ویرایش اطلاعات حواله" />
            <div className="bg-white rounded-lg shadow p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">شماره حواله <span className="text-red-500">*</span></label>
                            <input type="text" name="delivery_number" value={formData.delivery_number} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">مشتری <span className="text-red-500">*</span></label>
                            <select name="customer" value={formData.customer} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                <option value="">انتخاب کنید</option>
                                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">سفارش فروش</label>
                            <select name="sales_order" value={formData.sales_order || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                <option value="">انتخاب کنید</option>
                                {salesOrders.map(so => <option key={so.id} value={so.id}>{so.order_number}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">راننده</label>
                            <select name="driver" value={formData.driver || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                <option value="">انتخاب کنید</option>
                                {drivers.filter(d => d.is_active).map(d => <option key={d.id} value={d.id}>{d.name} - {d.phone}</option>)}
                            </select>
                        </div>
                        <div>
                            <JalaliDatePicker label="تاریخ برنامه‌ریزی" value={formData.scheduled_date} onChange={handleDateChange} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">زمان برنامه‌ریزی</label>
                            <input type="time" name="scheduled_time" value={formData.scheduled_time || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">وضعیت</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                <option value="pending">در انتظار</option>
                                <option value="assigned">تخصیص داده شده</option>
                                <option value="picked_up">برداشته شده</option>
                                <option value="in_transit">در حال حمل</option>
                                <option value="delivered">تحویل شده</option>
                                <option value="cancelled">لغو شده</option>
                                <option value="failed">ناموفق</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">هزینه ارسال (ریال)</label>
                            <input type="number" name="delivery_fee" value={formData.delivery_fee} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">آدرس مبدا <span className="text-red-500">*</span></label>
                        <textarea name="pickup_address" value={formData.pickup_address} onChange={handleChange} required rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">آدرس مقصد <span className="text-red-500">*</span></label>
                        <textarea name="delivery_address" value={formData.delivery_address} onChange={handleChange} required rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">یادداشت‌ها</label>
                        <textarea name="notes" value={formData.notes || ''} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={() => router.back()} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">انصراف</button>
                        <button type="submit" disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400">{saving ? 'در حال ذخیره...' : 'ذخیره'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
