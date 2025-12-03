'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import { getDriver, updateDriver } from '@/lib/api/delivery';

export default function EditDriverPage() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '', phone: '', email: '', vehicle_type: '', vehicle_plate: '',
        license_number: '', status: 'available', is_active: true, notes: '', company: '1'
    });

    useEffect(() => {
        fetchDriver();
    }, []);

    const fetchDriver = async () => {
        try {
            const response = await getDriver(params.id as string);
            setFormData(response.data);
        } catch (error) {
            console.error('Error fetching driver:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateDriver(params.id as string, formData);
            alert('راننده با موفقیت بروزرسانی شد');
            router.push('/dashboard/delivery/drivers');
        } catch (error) {
            console.error('Error updating driver:', error);
            alert('خطا در بروزرسانی راننده');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64"><div className="text-gray-500">در حال بارگذاری...</div></div>;

    return (
        <div>
            <PageHeader title="ویرایش راننده" subtitle="ویرایش اطلاعات راننده" />
            <div className="bg-white rounded-lg shadow p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">نام راننده <span className="text-red-500">*</span></label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">تلفن <span className="text-red-500">*</span></label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ایمیل</label>
                            <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">نوع وسیله نقلیه</label>
                            <input type="text" name="vehicle_type" value={formData.vehicle_type || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">پلاک خودرو</label>
                            <input type="text" name="vehicle_plate" value={formData.vehicle_plate || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">شماره گواهینامه</label>
                            <input type="text" name="license_number" value={formData.license_number || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">وضعیت</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                <option value="available">آماده</option>
                                <option value="busy">مشغول</option>
                                <option value="off_duty">خارج از خدمت</option>
                            </select>
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                            <label className="mr-2 block text-sm text-gray-900">فعال</label>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">یادداشت‌ها</label>
                        <textarea name="notes" value={formData.notes || ''} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={() => router.back()} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">انصراف</button>
                        <button type="submit" disabled={saving} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400">{saving ? 'در حال ذخیره...' : 'ذخیره'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
