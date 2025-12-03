'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import JalaliDatePicker from '@/components/JalaliDatePicker';
import { getLeave, updateLeave, deleteLeave, getEmployees } from '@/lib/api/hr';
import { Leave, Employee } from '@/lib/types/hr';

export default function EditLeavePage() {
    const router = useRouter();
    const params = useParams();
    const id = Number(params.id);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState<Partial<Leave>>({});
    const [employees, setEmployees] = useState<Employee[]>([]);

    useEffect(() => {
        if (id) {
            fetchItem();
            fetchEmployees();
        }
    }, [id]);

    const fetchItem = async () => {
        try {
            const response = await getLeave(id);
            setFormData(response.data);
        } catch (error) {
            console.error('Error fetching item:', error);
            setError('خطا در بارگذاری اطلاعات');
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployees = async () => {
        try {
            const response = await getEmployees();
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            await updateLeave(id, formData);
            setSuccess('تغییرات با موفقیت ذخیره شد');
            setTimeout(() => {
                router.push('/dashboard/hr/leaves');
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
                await deleteLeave(id);
                router.push('/dashboard/hr/leaves');
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
                title="ویرایش مرخصی"
                subtitle="ویرایش اطلاعات مرخصی"
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
                        <label htmlFor="employee" className="block text-sm font-medium text-gray-700">کارمند</label>
                        <select name="employee" id="employee" required value={formData.employee || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">
                            <option value="">انتخاب کنید</option>
                            {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="leave_type" className="block text-sm font-medium text-gray-700">نوع مرخصی</label>
                        <select name="leave_type" id="leave_type" value={formData.leave_type || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">
                            <option value="annual">استحقاقی</option>
                            <option value="sick">استعلاجی</option>
                            <option value="unpaid">بدون حقوق</option>
                        </select>
                    </div>
                    <div>
                        <JalaliDatePicker
                            label="تاریخ شروع"
                            value={formData.start_date || ''}
                            onChange={(date) => setFormData(prev => ({ ...prev, start_date: date }))}
                            required
                        />
                    </div>
                    <div>
                        <JalaliDatePicker
                            label="تاریخ پایان"
                            value={formData.end_date || ''}
                            onChange={(date) => setFormData(prev => ({ ...prev, end_date: date }))}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="days" className="block text-sm font-medium text-gray-700">تعداد روز</label>
                        <input type="number" name="days" id="days" required value={formData.days || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">وضعیت</label>
                        <select name="status" id="status" value={formData.status || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">
                            <option value="pending">در انتظار</option>
                            <option value="approved">تایید شده</option>
                            <option value="rejected">رد شده</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700">دلیل</label>
                        <textarea name="reason" id="reason" rows={3} required value={formData.reason || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                    </div>
                </div>

                <div className="mt-6 flex gap-4">
                    <button type="submit" disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400">
                        {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                    </button>
                    <button type="button" onClick={() => router.push('/dashboard/hr/leaves')} className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300">
                        انصراف
                    </button>
                    <button type="button" onClick={handleDelete} className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 mr-auto">
                        حذف
                    </button>
                </div>
            </form>
        </div>
    );
}
