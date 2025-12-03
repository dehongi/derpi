'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import JalaliDatePicker from '@/components/JalaliDatePicker';
import { createAttendance, getEmployees } from '@/lib/api/hr';
import { Attendance, Employee } from '@/lib/types/hr';

export default function CreateAttendancePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [employees, setEmployees] = useState<Employee[]>([]);

    const [formData, setFormData] = useState<Partial<Attendance>>({
        date: new Date().toISOString().split('T')[0],
        status: 'present',
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

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
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await createAttendance(formData);
            setSuccess('حضور و غیاب با موفقیت ثبت شد');
            setTimeout(() => {
                router.push('/dashboard/hr/attendances');
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
                title="ثبت حضور و غیاب"
                subtitle="ثبت رکورد جدید حضور و غیاب"
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
                        <JalaliDatePicker
                            label="تاریخ"
                            value={formData.date || ''}
                            onChange={(date) => setFormData(prev => ({ ...prev, date }))}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="check_in" className="block text-sm font-medium text-gray-700">ساعت ورود</label>
                            <input type="time" name="check_in" id="check_in" value={formData.check_in || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                        </div>
                        <div>
                            <label htmlFor="check_out" className="block text-sm font-medium text-gray-700">ساعت خروج</label>
                            <input type="time" name="check_out" id="check_out" value={formData.check_out || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">وضعیت</label>
                        <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">
                            <option value="present">حاضر</option>
                            <option value="absent">غایب</option>
                            <option value="late">تاخیر</option>
                            <option value="half_day">نیم روز</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">یادداشت‌ها</label>
                        <textarea name="notes" id="notes" rows={3} value={formData.notes || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                    </div>
                </div>

                <div className="mt-6 flex gap-4">
                    <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400">
                        {loading ? 'در حال ذخیره...' : 'ذخیره'}
                    </button>
                    <button type="button" onClick={() => router.push('/dashboard/hr/attendances')} className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300">
                        انصراف
                    </button>
                </div>
            </form>
        </div>
    );
}
