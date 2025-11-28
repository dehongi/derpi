'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import { getPayment, updatePayment, deletePayment, getInvoices } from '@/lib/api/sales';

export default function EditPaymentPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [invoices, setInvoices] = useState<any[]>([]);

    const [formData, setFormData] = useState<any>({
        payment_number: '',
        invoice: '',
        date: '',
        amount: 0,
        payment_method: 'cash',
        reference: '',
        notes: '',
    });

    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id]);

    const fetchData = async () => {
        try {
            const [paymentRes, invoicesRes] = await Promise.all([
                getPayment(id as string),
                getInvoices()
            ]);

            setFormData(paymentRes.data);
            setInvoices(invoicesRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('خطا در بارگذاری اطلاعات');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            await updatePayment(id as string, formData);
            setSuccess('تغییرات با موفقیت ذخیره شد');
            setTimeout(() => {
                router.push('/dashboard/sales/payments');
            }, 1500);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.detail || 'خطا در ذخیره تغییرات');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (confirm('آیا از حذف این پرداخت اطمینان دارید؟')) {
            try {
                await deletePayment(id as string);
                router.push('/dashboard/sales/payments');
            } catch (error) {
                console.error('Error deleting payment:', error);
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

    const selectedInvoice = invoices.find(inv => inv.id === parseInt(formData.invoice));

    return (
        <div>
            <PageHeader
                title="ویرایش پرداخت"
                subtitle={`ویرایش پرداخت ${formData.payment_number}`}
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">شماره پرداخت</label>
                        <input
                            type="text"
                            name="payment_number"
                            value={formData.payment_number}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">فاکتور</label>
                        <select
                            name="invoice"
                            value={formData.invoice}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            required
                        >
                            <option value="">انتخاب فاکتور...</option>
                            {invoices.map(inv => (
                                <option key={inv.id} value={inv.id}>
                                    {inv.invoice_number} - {inv.total?.toLocaleString()} ریال
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">تاریخ</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">مبلغ</label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            required
                            min="0"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">روش پرداخت</label>
                        <select
                            name="payment_method"
                            value={formData.payment_method}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        >
                            <option value="cash">نقدی</option>
                            <option value="card">کارت</option>
                            <option value="transfer">انتقال بانکی</option>
                            <option value="cheque">چک</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">مرجع (شماره تراکنش، شماره چک، ...)</label>
                        <input
                            type="text"
                            name="reference"
                            value={formData.reference || ''}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                </div>

                {selectedInvoice && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
                        <h3 className="font-medium mb-2">اطلاعات فاکتور</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>جمع کل فاکتور: <span className="font-medium">{selectedInvoice.total?.toLocaleString()}</span> ریال</div>
                            <div>پرداخت شده: <span className="font-medium">{selectedInvoice.paid_amount?.toLocaleString()}</span> ریال</div>
                            <div>مانده: <span className="font-medium text-red-600">{(selectedInvoice.total - selectedInvoice.paid_amount)?.toLocaleString()}</span> ریال</div>
                        </div>
                    </div>
                )}

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">یادداشت‌ها</label>
                    <textarea
                        name="notes"
                        value={formData.notes || ''}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 h-24"
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard/sales/payments')}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300"
                    >
                        انصراف
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 mr-auto"
                    >
                        حذف
                    </button>
                </div>
            </form>
        </div>
    );
}
