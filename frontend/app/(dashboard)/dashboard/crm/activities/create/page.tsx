'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import { createActivity, getLeads, getOpportunities, getContacts, getUsers } from '@/lib/api/crm';

export default function CreateActivityPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [users, setUsers] = useState<any[]>([]);
    const [relatedType, setRelatedType] = useState<'lead' | 'opportunity' | 'contact'>('lead');
    const [leads, setLeads] = useState<any[]>([]);
    const [opportunities, setOpportunities] = useState<any[]>([]);
    const [contacts, setContacts] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        activity_type: 'call',
        subject: '',
        description: '',
        due_date: '',
        completed: false,
        content_type: '',
        object_id: '',
        assigned_to: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [leadsRes, opportunitiesRes, contactsRes, usersRes] = await Promise.all([
                getLeads(),
                getOpportunities(),
                getContacts(),
                getUsers()
            ]);
            setLeads(leadsRes.data);
            setOpportunities(opportunitiesRes.data);
            setContacts(contactsRes.data);
            setUsers(usersRes.data);
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleRelatedTypeChange = (type: 'lead' | 'opportunity' | 'contact') => {
        setRelatedType(type);
        setFormData(prev => ({ ...prev, object_id: '' }));
    };

    const getRelatedItems = () => {
        switch (relatedType) {
            case 'lead':
                return leads;
            case 'opportunity':
                return opportunities;
            case 'contact':
                return contacts;
            default:
                return [];
        }
    };

    const getContentTypeId = () => {
        // These IDs should match the Django ContentType IDs for the models
        // In a real app, you'd fetch these from the backend
        switch (relatedType) {
            case 'lead':
                return '1'; // Placeholder - should be actual ContentType ID
            case 'opportunity':
                return '2'; // Placeholder
            case 'contact':
                return '3'; // Placeholder
            default:
                return '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const submitData = {
                ...formData,
                content_type: getContentTypeId(),
                assigned_to: formData.assigned_to || null,
                due_date: formData.due_date || null
            };
            await createActivity(submitData);
            setSuccess('فعالیت با موفقیت ایجاد شد');
            setTimeout(() => {
                router.push('/dashboard/crm/activities');
            }, 1500);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'خطا در ایجاد فعالیت');
        } finally {
            setLoading(false);
        }
    };

    const relatedItems = getRelatedItems();

    return (
        <div>
            <PageHeader
                title="افزودن فعالیت جدید"
                subtitle="ثبت تماس، جلسه، ایمیل یا وظیفه جدید"
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            نوع فعالیت <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="activity_type"
                            value={formData.activity_type}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            required
                        >
                            <option value="call">📞 تماس</option>
                            <option value="meeting">🤝 جلسه</option>
                            <option value="email">📧 ایمیل</option>
                            <option value="task">✓ وظیفه</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            موضوع <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 h-24"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">سررسید</label>
                        <input
                            type="datetime-local"
                            name="due_date"
                            value={formData.due_date}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
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

                    <div className="md:col-span-2">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="completed"
                                checked={formData.completed}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            <span className="text-sm font-medium text-gray-700">انجام شده</span>
                        </label>
                    </div>
                </div>

                {/* Related To Section */}
                <div className="mb-6 border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">مرتبط با</h3>

                    <div className="flex gap-4 mb-4">
                        <button
                            type="button"
                            onClick={() => handleRelatedTypeChange('lead')}
                            className={`px-4 py-2 rounded ${relatedType === 'lead' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            سرنخ
                        </button>
                        <button
                            type="button"
                            onClick={() => handleRelatedTypeChange('opportunity')}
                            className={`px-4 py-2 rounded ${relatedType === 'opportunity' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            فرصت
                        </button>
                        <button
                            type="button"
                            onClick={() => handleRelatedTypeChange('contact')}
                            className={`px-4 py-2 rounded ${relatedType === 'contact' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            مخاطب
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            انتخاب {relatedType === 'lead' ? 'سرنخ' : relatedType === 'opportunity' ? 'فرصت' : 'مخاطب'}
                        </label>
                        <select
                            name="object_id"
                            value={formData.object_id}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        >
                            <option value="">انتخاب کنید...</option>
                            {relatedItems.map((item: any) => (
                                <option key={item.id} value={item.id}>
                                    {item.name || item.title}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 disabled:bg-gray-400"
                    >
                        {loading ? 'در حال ذخیره...' : 'ذخیره'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard/crm/activities')}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300"
                    >
                        انصراف
                    </button>
                </div>
            </form>
        </div>
    );
}
