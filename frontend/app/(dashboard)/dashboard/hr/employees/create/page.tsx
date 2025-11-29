'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import { createEmployee, getDepartments } from '@/lib/api/hr';
import { Employee, Department } from '@/lib/types/hr';

export default function CreateEmployeePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [departments, setDepartments] = useState<Department[]>([]);

    const [formData, setFormData] = useState<Partial<Employee>>({
        first_name: '',
        last_name: '',
        employee_number: '',
        position: '',
        hire_date: '',
        salary: '',
        employment_type: 'full_time',
        status: 'active',
    });

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await getDepartments();
            setDepartments(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
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
            await createEmployee(formData);
            setSuccess('کارمند با موفقیت ایجاد شد');
            setTimeout(() => {
                router.push('/dashboard/hr/employees');
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
                title="افزودن کارمند جدید"
                subtitle="ایجاد کارمند جدید در سیستم"
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
                        <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">نام</label>
                        <input type="text" name="first_name" id="first_name" required value={formData.first_name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                    </div>
                    <div>
                        <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">نام خانوادگی</label>
                        <input type="text" name="last_name" id="last_name" required value={formData.last_name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                    </div>
                    <div>
                        <label htmlFor="employee_number" className="block text-sm font-medium text-gray-700">شماره پرسنلی</label>
                        <input type="text" name="employee_number" id="employee_number" required value={formData.employee_number} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                    </div>
                    <div>
                        <label htmlFor="department" className="block text-sm font-medium text-gray-700">بخش</label>
                        <select name="department" id="department" value={formData.department || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">
                            <option value="">انتخاب کنید</option>
                            {departments.map(dept => (
                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="position" className="block text-sm font-medium text-gray-700">سمت</label>
                        <input type="text" name="position" id="position" required value={formData.position} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                    </div>
                    <div>
                        <label htmlFor="hire_date" className="block text-sm font-medium text-gray-700">تاریخ استخدام</label>
                        <input type="date" name="hire_date" id="hire_date" required value={formData.hire_date} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                    </div>
                    <div>
                        <label htmlFor="salary" className="block text-sm font-medium text-gray-700">حقوق</label>
                        <input type="number" name="salary" id="salary" required value={formData.salary} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                    </div>
                    <div>
                        <label htmlFor="employment_type" className="block text-sm font-medium text-gray-700">نوع استخدام</label>
                        <select name="employment_type" id="employment_type" value={formData.employment_type} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">
                            <option value="full_time">تمام وقت</option>
                            <option value="part_time">پاره وقت</option>
                            <option value="contract">قراردادی</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">وضعیت</label>
                        <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">
                            <option value="active">فعال</option>
                            <option value="on_leave">مرخصی</option>
                            <option value="terminated">خاتمه یافته</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">ایمیل</label>
                        <input type="email" name="email" id="email" value={formData.email || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">تلفن</label>
                        <input type="text" name="phone" id="phone" value={formData.phone || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                    </div>
                    <div>
                        <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">موبایل</label>
                        <input type="text" name="mobile" id="mobile" value={formData.mobile || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                    </div>
                    <div className="col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">آدرس</label>
                        <textarea name="address" id="address" rows={3} value={formData.address || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                    </div>
                </div>

                <div className="mt-6 flex gap-4">
                    <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400">
                        {loading ? 'در حال ذخیره...' : 'ذخیره'}
                    </button>
                    <button type="button" onClick={() => router.push('/dashboard/hr/employees')} className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300">
                        انصراف
                    </button>
                </div>
            </form>
        </div>
    );
}
