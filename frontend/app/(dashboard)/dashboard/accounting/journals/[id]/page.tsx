'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import api from '@/utils/api';

interface Transaction {
    id?: number;
    account: string;
    debit: string;
    credit: string;
    description: string;
}

export default function EditJournalEntryPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id;

    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [accounts, setAccounts] = useState([]);

    const [formData, setFormData] = useState({
        entry_number: '',
        date: '',
        description: '',
        reference: '',
        status: 'draft'
    });

    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        if (id) {
            fetchJournalEntry();
            fetchAccounts();
        }
    }, [id]);

    const fetchJournalEntry = async () => {
        try {
            const response = await api.get(`/accounting/journal-entries/${id}/`);
            const data = response.data;
            setFormData({
                entry_number: data.entry_number || '',
                date: data.date || '',
                description: data.description || '',
                reference: data.reference || '',
                status: data.status || 'draft'
            });

            if (data.transactions && data.transactions.length > 0) {
                setTransactions(data.transactions.map((t: any) => ({
                    id: t.id,
                    account: t.account?.toString() || '',
                    debit: t.debit?.toString() || '0',
                    credit: t.credit?.toString() || '0',
                    description: t.description || ''
                })));
            } else {
                setTransactions([
                    { account: '', debit: '0', credit: '0', description: '' },
                    { account: '', debit: '0', credit: '0', description: '' }
                ]);
            }
        } catch (error) {
            console.error('Error fetching journal entry:', error);
            setError('خطا در بارگذاری اطلاعات');
        } finally {
            setFetchLoading(false);
        }
    };

    const fetchAccounts = async () => {
        try {
            const response = await api.get('/accounting/accounts/');
            setAccounts(response.data);
        } catch (error) {
            console.error('Error fetching accounts:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTransactionChange = (index: number, field: keyof Transaction, value: string) => {
        const newTransactions = [...transactions];
        newTransactions[index] = { ...newTransactions[index], [field]: value };
        setTransactions(newTransactions);
    };

    const addTransaction = () => {
        setTransactions([...transactions, { account: '', debit: '0', credit: '0', description: '' }]);
    };

    const removeTransaction = (index: number) => {
        if (transactions.length > 2) {
            setTransactions(transactions.filter((_, i) => i !== index));
        }
    };

    const calculateTotals = () => {
        const totalDebit = transactions.reduce((sum, t) => sum + parseFloat(t.debit || '0'), 0);
        const totalCredit = transactions.reduce((sum, t) => sum + parseFloat(t.credit || '0'), 0);
        return { totalDebit, totalCredit, balanced: totalDebit === totalCredit };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const { balanced } = calculateTotals();
        if (!balanced) {
            setError('مجموع بدهکار و بستانکار باید برابر باشند');
            setLoading(false);
            return;
        }

        try {
            const submitData = {
                ...formData,
                transactions: transactions.map(t => ({
                    account: parseInt(t.account),
                    debit: parseFloat(t.debit || '0'),
                    credit: parseFloat(t.credit || '0'),
                    description: t.description
                }))
            };
            await api.put(`/accounting/journal-entries/${id}/`, submitData);
            setSuccess('سند با موفقیت بروزرسانی شد');
            setTimeout(() => {
                router.push('/dashboard/accounting/journals');
            }, 1500);
        } catch (err: any) {
            setError(err.response?.data?.detail || JSON.stringify(err.response?.data) || 'خطا در بروزرسانی');
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return <div className="text-center py-8">در حال بارگذاری...</div>;
    }

    const { totalDebit, totalCredit, balanced } = calculateTotals();

    return (
        <div>
            <PageHeader
                title="ویرایش سند حسابداری"
                subtitle="ویرایش اطلاعات سند حسابداری"
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
                        <label className="block text-sm font-medium mb-2">شماره سند *</label>
                        <input
                            type="text"
                            name="entry_number"
                            value={formData.entry_number}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">تاریخ *</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">شرح *</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={3}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">مرجع</label>
                        <input
                            type="text"
                            name="reference"
                            value={formData.reference}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">وضعیت *</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="draft">پیش‌نویس</option>
                            <option value="posted">ثبت شده</option>
                            <option value="cancelled">لغو شده</option>
                        </select>
                    </div>
                </div>

                <div className="border-t pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">تراکنش‌ها</h3>
                        <button
                            type="button"
                            onClick={addTransaction}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
                        >
                            + افزودن ردیف
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="border px-2 py-2 text-sm">حساب</th>
                                    <th className="border px-2 py-2 text-sm">بدهکار</th>
                                    <th className="border px-2 py-2 text-sm">بستانکار</th>
                                    <th className="border px-2 py-2 text-sm">شرح</th>
                                    <th className="border px-2 py-2 text-sm">عملیات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((transaction, index) => (
                                    <tr key={index}>
                                        <td className="border px-2 py-2">
                                            <select
                                                value={transaction.account}
                                                onChange={(e) => handleTransactionChange(index, 'account', e.target.value)}
                                                required
                                                className="w-full px-2 py-1 border rounded text-sm"
                                            >
                                                <option value="">انتخاب حساب</option>
                                                {accounts.map((account: any) => (
                                                    <option key={account.id} value={account.id}>
                                                        {account.code} - {account.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="border px-2 py-2">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={transaction.debit}
                                                onChange={(e) => handleTransactionChange(index, 'debit', e.target.value)}
                                                className="w-full px-2 py-1 border rounded text-sm"
                                            />
                                        </td>
                                        <td className="border px-2 py-2">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={transaction.credit}
                                                onChange={(e) => handleTransactionChange(index, 'credit', e.target.value)}
                                                className="w-full px-2 py-1 border rounded text-sm"
                                            />
                                        </td>
                                        <td className="border px-2 py-2">
                                            <input
                                                type="text"
                                                value={transaction.description}
                                                onChange={(e) => handleTransactionChange(index, 'description', e.target.value)}
                                                className="w-full px-2 py-1 border rounded text-sm"
                                            />
                                        </td>
                                        <td className="border px-2 py-2 text-center">
                                            <button
                                                type="button"
                                                onClick={() => removeTransaction(index)}
                                                disabled={transactions.length <= 2}
                                                className="text-red-600 hover:text-red-800 disabled:text-gray-400 text-sm"
                                            >
                                                حذف
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                <tr className="bg-gray-50 font-bold">
                                    <td className="border px-2 py-2 text-sm">جمع</td>
                                    <td className="border px-2 py-2 text-sm">{totalDebit.toFixed(2)}</td>
                                    <td className="border px-2 py-2 text-sm">{totalCredit.toFixed(2)}</td>
                                    <td className="border px-2 py-2 text-sm" colSpan={2}>
                                        {balanced ? (
                                            <span className="text-green-600">✓ متوازن</span>
                                        ) : (
                                            <span className="text-red-600">✗ نامتوازن</span>
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-6 flex gap-4">
                    <button
                        type="submit"
                        disabled={loading || !balanced}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {loading ? 'در حال ذخیره...' : 'ذخیره'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard/accounting/journals')}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300"
                    >
                        انصراف
                    </button>
                </div>
            </form>
        </div>
    );
}
