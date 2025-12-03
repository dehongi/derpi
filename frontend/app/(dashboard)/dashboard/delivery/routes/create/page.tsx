'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import JalaliDatePicker from '@/components/JalaliDatePicker';
import { createDeliveryRoute } from '@/lib/api/delivery';
import { getDrivers } from '@/lib/api/delivery';
import { getCurrentGregorianDate } from '@/utils/dateUtils';

export default function CreateRoutePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [drivers, setDrivers] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        route_name: '',
        driver: '',
        date: getCurrentGregorianDate(),
        status: 'planned',
        start_location: '',
        end_location: '',
        total_distance: '0',
        estimated_duration: '0',
        notes: '',
        company: '1'
    });

    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        try {
            const response = await getDrivers();
            setDrivers(response.data.filter((d: any) => d.is_active));
        } catch (error) {
            console.error('Error fetching drivers:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date: string) => {
        setFormData(prev => ({ ...prev, date }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createDeliveryRoute(formData);
            alert('مسیر با موفقیت ایجاد شد');
            router.push('/dashboard/delivery/routes');
        } catch (error) {
            console.error('Error creating route:', error);
            alert('خطا در ایجاد مسیر');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <PageHeader title="مسیر جدید" subtitle="ایجاد مسیر حمل جدید" />
            <div className="bg-white rounded-lg shadow p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">نام مسیر <span className="text-red-500">*</span></label>
                            <input type="text" name="route_name" value={formData.route_name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">راننده</label>
                            <select name="driver" value={formData.driver} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                <option value="">انتخاب کنید</option>
                                {drivers.map(d => <option key={d.id} value={d.id}>{d.name} - {d.phone}</option>)}
                            </select>
                        </div>
                        <div>
                            <JalaliDatePicker label="تاریخ" value={formData.date} onChange={handleDateChange} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">وضعیت</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                <option value="planned">برنامه‌ریزی شده</option>
                                <option value="in_progress">در حال انجام</option>
                                <option value="completed">تکمیل شده</option>
                                <option value="cancelled">لغو شده</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">مسافت کل (کیلومتر)</label>
                            <input type="number" step="0.01" name="total_distance" value={formData.total_distance} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">زمان تخمینی (دقیقه)</label>
                            <input type="number" name="estimated_duration" value={formData.estimated_duration} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">نقطه شروع</label>
                        <textarea name="start_location" value={formData.start_location} onChange={handleChange} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">نقطه پایان</label>
                        <textarea name="end_location" value={formData.end_location} onChange={handleChange} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">یادداشت‌ها</label>
                        <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={() => router.back()} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">انصراف</button>
                        <button type="submit" disabled={loading} className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400">{loading ? 'در حال ذخیره...' : 'ذخیره'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
