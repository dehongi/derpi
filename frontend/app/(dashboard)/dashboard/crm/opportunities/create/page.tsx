'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import JalaliDatePicker from '@/components/JalaliDatePicker';
import { createOpportunity, getContacts, getLeads, getUsers } from '@/lib/api/crm';

export default function CreateOpportunityPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [contacts, setContacts] = useState<any[]>([]);
    const [leads, setLeads] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        contact: '',
        lead: '',
        value: '',
        probability: 50,
        stage: 'prospecting',
        expected_close_date: '',
        assigned_to: '',
        notes: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [contactsRes, leadsRes, usersRes] = await Promise.all([
                getContacts(),
                getLeads(),
                getUsers()
            ]);
            setContacts(contactsRes.data);
            setLeads(leadsRes.data);
            setUsers(usersRes.data);
        } catch (err) {
            console.error('Error fetching data:', err);
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
            const submitData = {
                ...formData,
                lead: formData.lead || null,
                assigned_to: formData.assigned_to || null,
                expected_close_date: formData.expected_close_date || null
            };
            await createOpportunity(submitData);
            setSuccess('فرصت با موفقیت ایجاد شد');
            setTimeout(() => {
                router.push('/dashboard/crm/opportunities');
            }, 1500);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'خطا در ایجاد فرصت');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <PageHeader
                title="افزودن فرصت جدید"
                subtitle="ایجاد فرصت فروش جدید در سیستم CRM"
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            عنوان <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            مخاطب <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="contact"
                            value={formData.contact}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            required
                        >
                            <option value="">انتخاب کنید...</option>
                            {contacts.map(contact => (
                                <option key={contact.id} value={contact.id}>
                                    {contact.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            سرنخ (اختیاری)
                        </label>
                        <select
                            name="lead"
                            value={formData.lead}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        >
                            <option value="">انتخاب کنید...</option>
                            {leads.map(lead => (
                                <option key={lead.id} value={lead.id}>
                                    {lead.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            ارزش (ریال) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="value"
                            value={formData.value}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            step="0.01"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            احتمال (%) <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                name="probability"
                                value={formData.probability}
                                onChange={handleChange}
                                className="flex-1"
                                min="0"
                                max="100"
                                step="5"
                            />
                            <input
                                type="number"
                                name="probability"
                                value={formData.probability}
                                onChange={handleChange}
                                className="w-20 border rounded px-3 py-2"
                                min="0"
                                max="100"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            مرحله <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="stage"
                            value={formData.stage}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            required
                        >
                            <option value="prospecting">جستجو</option>
                            <option value="qualification">ارزیابی</option>
                            <option value="proposal">پیشنهاد</option>
                            <option value="negotiation">مذاکره</option>
                            <option value="closed_won">بسته شده - برنده</option>
                            <option value="closed_lost">بسته شده - بازنده</option>
                        </select>
                    </div>

                    <div>
                        <JalaliDatePicker
                            label="تاریخ بسته شدن مورد انتظار"
                            value={formData.expected_close_date}
                            onChange={(date) => setFormData(prev => ({ ...prev, expected_close_date: date }))}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">اختصاص به</label>
                        <select
                            name="assigned_to"
                            value={formData.assigned_to}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        >
                            <option value="">انتخاب کنید...</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.first_name} {user.last_name} ({user.email})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">یادداشت‌ها</label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 h-32"
                    />
                </div>

                {formData.value && (
                    <div className="mb-6 p-4 bg-blue-50 rounded">
                        <div className="text-sm text-gray-700">
                            <strong>ارزش موزون:</strong> {((parseFloat(formData.value) || 0) * formData.probability / 100).toLocaleString()} ریال
                        </div>
                    </div>
                )}

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
                    >
                        {loading ? 'در حال ذخیره...' : 'ذخیره'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard/crm/opportunities')}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300"
                    >
                        انصراف
                    </button>
                </div>
            </form>
        </div>
    );
}
