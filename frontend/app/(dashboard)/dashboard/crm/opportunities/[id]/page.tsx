'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import JalaliDatePicker from '@/components/JalaliDatePicker';
import { getOpportunity, updateOpportunity, getContacts, getLeads, getUsers, getActivities } from '@/lib/api/crm';

export default function EditOpportunityPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [contacts, setContacts] = useState<any[]>([]);
    const [leads, setLeads] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [activities, setActivities] = useState<any[]>([]);

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
    }, [id]);

    const fetchData = async () => {
        try {
            const [opportunityRes, contactsRes, leadsRes, usersRes, activitiesRes] = await Promise.all([
                getOpportunity(id),
                getContacts(),
                getLeads(),
                getUsers(),
                getActivities()
            ]);

            const opportunity = opportunityRes.data;
            setFormData({
                title: opportunity.title || '',
                contact: opportunity.contact || '',
                lead: opportunity.lead || '',
                value: opportunity.value || '',
                probability: opportunity.probability || 50,
                stage: opportunity.stage || 'prospecting',
                expected_close_date: opportunity.expected_close_date || '',
                assigned_to: opportunity.assigned_to || '',
                notes: opportunity.notes || ''
            });

            setContacts(contactsRes.data);
            setLeads(leadsRes.data);
            setUsers(usersRes.data);

            // Filter activities related to this opportunity
            const relatedActivities = activitiesRes.data.filter((act: any) =>
                act.object_id === parseInt(id) && act.content_type
            );
            setActivities(relatedActivities);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('خطا در بارگذاری اطلاعات');
        } finally {
            setFetchLoading(false);
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
            await updateOpportunity(id, submitData);
            setSuccess('فرصت با موفقیت بروزرسانی شد');
            setTimeout(() => {
                router.push('/dashboard/crm/opportunities');
            }, 1500);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'خطا در بروزرسانی فرصت');
        } finally {
            setLoading(false);
        }
    };

    const getStageProgress = (stage: string) => {
        const stages = ['prospecting', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost'];
        const currentIndex = stages.indexOf(stage);
        if (stage === 'closed_won' || stage === 'closed_lost') {
            return 100;
        }
        return ((currentIndex + 1) / 4) * 100; // 4 active stages before closing
    };

    const getActivityTypeLabel = (type: string) => {
        const typeMap: any = {
            'call': 'تماس',
            'meeting': 'جلسه',
            'email': 'ایمیل',
            'task': 'وظیفه'
        };
        return typeMap[type] || type;
    };

    if (fetchLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-500">در حال بارگذاری...</div>
            </div>
        );
    }

    const progress = getStageProgress(formData.stage);

    return (
        <div>
            <PageHeader
                title="ویرایش فرصت"
                subtitle="بروزرسانی اطلاعات فرصت فروش"
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6">
                        {/* Progress Bar */}
                        <div className="mb-6">
                            <div className="flex justify-between text-xs text-gray-600 mb-2">
                                <span>پیشرفت فرصت</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all ${formData.stage === 'closed_won' ? 'bg-green-600' :
                                        formData.stage === 'closed_lost' ? 'bg-red-600' :
                                            'bg-blue-600'
                                        }`}
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

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
                                    value={formData.expected_close_date || ''}
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
                                {loading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
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

                <div className="lg:col-span-1">
                    <div className="bg-white rounded shadow p-6">
                        <h3 className="text-lg font-semibold mb-4">فعالیت‌های مرتبط</h3>
                        {activities.length === 0 ? (
                            <p className="text-gray-500 text-sm">فعالیتی ثبت نشده است</p>
                        ) : (
                            <div className="space-y-3">
                                {activities.map((activity: any) => (
                                    <div key={activity.id} className="border-r-4 border-green-500 pr-3 py-2">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium">{activity.subject}</span>
                                            <span className="text-xs text-gray-500">
                                                {getActivityTypeLabel(activity.activity_type)}
                                            </span>
                                        </div>
                                        {activity.due_date && (
                                            <div className="text-xs text-gray-600">
                                                سررسید: {new Date(activity.due_date).toLocaleDateString('fa-IR')}
                                            </div>
                                        )}
                                        {activity.completed && (
                                            <span className="text-xs text-green-600">✓ انجام شده</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
