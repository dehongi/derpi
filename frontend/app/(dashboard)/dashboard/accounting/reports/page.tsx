'use client';

import { useEffect, useState } from 'react';
import PageHeader from '@/components/PageHeader';
import api from '@/utils/api';

interface AccountBalance {
    name: string;
    code: string;
    balance: number;
}

interface BalanceSheetData {
    assets: AccountBalance[];
    total_assets: number;
    liabilities: AccountBalance[];
    total_liabilities: number;
    equity: AccountBalance[];
    total_equity: number;
}

interface IncomeStatementData {
    revenue: AccountBalance[];
    total_revenue: number;
    expenses: AccountBalance[];
    total_expenses: number;
    net_income: number;
}

export default function ReportsPage() {
    const [activeTab, setActiveTab] = useState<'balance-sheet' | 'income-statement'>('balance-sheet');
    const [balanceSheet, setBalanceSheet] = useState<BalanceSheetData | null>(null);
    const [incomeStatement, setIncomeStatement] = useState<IncomeStatementData | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (activeTab === 'balance-sheet') {
            fetchBalanceSheet();
        } else {
            fetchIncomeStatement();
        }
    }, [activeTab]);

    const fetchBalanceSheet = async () => {
        setLoading(true);
        try {
            const response = await api.get('/accounting/reports/balance-sheet/');
            setBalanceSheet(response.data);
        } catch (error) {
            console.error('Error fetching balance sheet:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchIncomeStatement = async () => {
        setLoading(true);
        try {
            const response = await api.get('/accounting/reports/income-statement/');
            setIncomeStatement(response.data);
        } catch (error) {
            console.error('Error fetching income statement:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('fa-IR').format(num);
    };

    return (
        <div>
            <PageHeader
                title="گزارشات مالی"
                subtitle="ترازنامه و صورت سود و زیان"
            />

            <div className="bg-white rounded shadow">
                <div className="border-b">
                    <div className="flex">
                        <button
                            onClick={() => setActiveTab('balance-sheet')}
                            className={`px-6 py-3 font-medium ${activeTab === 'balance-sheet'
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            ترازنامه
                        </button>
                        <button
                            onClick={() => setActiveTab('income-statement')}
                            className={`px-6 py-3 font-medium ${activeTab === 'income-statement'
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            صورت سود و زیان
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="text-center py-8">در حال بارگذاری...</div>
                    ) : activeTab === 'balance-sheet' && balanceSheet ? (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-bold mb-3 text-green-700">دارایی‌ها</h3>
                                <table className="w-full border">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="border px-4 py-2 text-right">کد</th>
                                            <th className="border px-4 py-2 text-right">نام حساب</th>
                                            <th className="border px-4 py-2 text-left">مانده</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {balanceSheet.assets.length > 0 ? (
                                            balanceSheet.assets.map((account, index) => (
                                                <tr key={index}>
                                                    <td className="border px-4 py-2">{account.code}</td>
                                                    <td className="border px-4 py-2">{account.name}</td>
                                                    <td className="border px-4 py-2 text-left">{formatNumber(account.balance)}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={3} className="border px-4 py-2 text-center text-gray-500">
                                                    داده‌ای موجود نیست
                                                </td>
                                            </tr>
                                        )}
                                        <tr className="bg-gray-100 font-bold">
                                            <td colSpan={2} className="border px-4 py-2">جمع دارایی‌ها</td>
                                            <td className="border px-4 py-2 text-left">{formatNumber(balanceSheet.total_assets)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold mb-3 text-red-700">بدهی‌ها</h3>
                                <table className="w-full border">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="border px-4 py-2 text-right">کد</th>
                                            <th className="border px-4 py-2 text-right">نام حساب</th>
                                            <th className="border px-4 py-2 text-left">مانده</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {balanceSheet.liabilities.length > 0 ? (
                                            balanceSheet.liabilities.map((account, index) => (
                                                <tr key={index}>
                                                    <td className="border px-4 py-2">{account.code}</td>
                                                    <td className="border px-4 py-2">{account.name}</td>
                                                    <td className="border px-4 py-2 text-left">{formatNumber(account.balance)}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={3} className="border px-4 py-2 text-center text-gray-500">
                                                    داده‌ای موجود نیست
                                                </td>
                                            </tr>
                                        )}
                                        <tr className="bg-gray-100 font-bold">
                                            <td colSpan={2} className="border px-4 py-2">جمع بدهی‌ها</td>
                                            <td className="border px-4 py-2 text-left">{formatNumber(balanceSheet.total_liabilities)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold mb-3 text-blue-700">حقوق صاحبان سهام</h3>
                                <table className="w-full border">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="border px-4 py-2 text-right">کد</th>
                                            <th className="border px-4 py-2 text-right">نام حساب</th>
                                            <th className="border px-4 py-2 text-left">مانده</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {balanceSheet.equity.length > 0 ? (
                                            balanceSheet.equity.map((account, index) => (
                                                <tr key={index}>
                                                    <td className="border px-4 py-2">{account.code}</td>
                                                    <td className="border px-4 py-2">{account.name}</td>
                                                    <td className="border px-4 py-2 text-left">{formatNumber(account.balance)}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={3} className="border px-4 py-2 text-center text-gray-500">
                                                    داده‌ای موجود نیست
                                                </td>
                                            </tr>
                                        )}
                                        <tr className="bg-gray-100 font-bold">
                                            <td colSpan={2} className="border px-4 py-2">جمع حقوق صاحبان سهام</td>
                                            <td className="border px-4 py-2 text-left">{formatNumber(balanceSheet.total_equity)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="bg-blue-50 p-4 rounded">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-lg">جمع بدهی‌ها و حقوق صاحبان سهام:</span>
                                    <span className="font-bold text-lg">{formatNumber(balanceSheet.total_liabilities + balanceSheet.total_equity)}</span>
                                </div>
                            </div>
                        </div>
                    ) : activeTab === 'income-statement' && incomeStatement ? (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-bold mb-3 text-green-700">درآمدها</h3>
                                <table className="w-full border">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="border px-4 py-2 text-right">کد</th>
                                            <th className="border px-4 py-2 text-right">نام حساب</th>
                                            <th className="border px-4 py-2 text-left">مبلغ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {incomeStatement.revenue.length > 0 ? (
                                            incomeStatement.revenue.map((account, index) => (
                                                <tr key={index}>
                                                    <td className="border px-4 py-2">{account.code}</td>
                                                    <td className="border px-4 py-2">{account.name}</td>
                                                    <td className="border px-4 py-2 text-left">{formatNumber(account.balance)}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={3} className="border px-4 py-2 text-center text-gray-500">
                                                    داده‌ای موجود نیست
                                                </td>
                                            </tr>
                                        )}
                                        <tr className="bg-gray-100 font-bold">
                                            <td colSpan={2} className="border px-4 py-2">جمع درآمدها</td>
                                            <td className="border px-4 py-2 text-left">{formatNumber(incomeStatement.total_revenue)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold mb-3 text-red-700">هزینه‌ها</h3>
                                <table className="w-full border">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="border px-4 py-2 text-right">کد</th>
                                            <th className="border px-4 py-2 text-right">نام حساب</th>
                                            <th className="border px-4 py-2 text-left">مبلغ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {incomeStatement.expenses.length > 0 ? (
                                            incomeStatement.expenses.map((account, index) => (
                                                <tr key={index}>
                                                    <td className="border px-4 py-2">{account.code}</td>
                                                    <td className="border px-4 py-2">{account.name}</td>
                                                    <td className="border px-4 py-2 text-left">{formatNumber(account.balance)}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={3} className="border px-4 py-2 text-center text-gray-500">
                                                    داده‌ای موجود نیست
                                                </td>
                                            </tr>
                                        )}
                                        <tr className="bg-gray-100 font-bold">
                                            <td colSpan={2} className="border px-4 py-2">جمع هزینه‌ها</td>
                                            <td className="border px-4 py-2 text-left">{formatNumber(incomeStatement.total_expenses)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className={`p-4 rounded ${incomeStatement.net_income >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-lg">
                                        {incomeStatement.net_income >= 0 ? 'سود خالص:' : 'زیان خالص:'}
                                    </span>
                                    <span className={`font-bold text-lg ${incomeStatement.net_income >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                        {formatNumber(Math.abs(incomeStatement.net_income))}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
