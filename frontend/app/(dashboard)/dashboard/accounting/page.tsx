'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import api from '@/utils/api';

interface DashboardStats {
    totalAccounts: number;
    totalJournalEntries: number;
    draftEntries: number;
    postedEntries: number;
    totalAssets: number;
    totalLiabilities: number;
    totalEquity: number;
    totalRevenue: number;
    totalExpenses: number;
    netIncome: number;
}

export default function AccountingDashboardPage() {
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats>({
        totalAccounts: 0,
        totalJournalEntries: 0,
        draftEntries: 0,
        postedEntries: 0,
        totalAssets: 0,
        totalLiabilities: 0,
        totalEquity: 0,
        totalRevenue: 0,
        totalExpenses: 0,
        netIncome: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch accounts
            const accountsResponse = await api.get('/accounting/accounts/');
            const accounts = accountsResponse.data;

            // Fetch journal entries
            const journalsResponse = await api.get('/accounting/journal-entries/');
            const journals = journalsResponse.data;

            // Fetch balance sheet
            const balanceSheetResponse = await api.get('/accounting/reports/balance-sheet/');
            const balanceSheet = balanceSheetResponse.data;

            // Fetch income statement
            const incomeStatementResponse = await api.get('/accounting/reports/income-statement/');
            const incomeStatement = incomeStatementResponse.data;

            setStats({
                totalAccounts: accounts.length,
                totalJournalEntries: journals.length,
                draftEntries: journals.filter((j: any) => j.status === 'draft').length,
                postedEntries: journals.filter((j: any) => j.status === 'posted').length,
                totalAssets: balanceSheet.total_assets || 0,
                totalLiabilities: balanceSheet.total_liabilities || 0,
                totalEquity: balanceSheet.total_equity || 0,
                totalRevenue: incomeStatement.total_revenue || 0,
                totalExpenses: incomeStatement.total_expenses || 0,
                netIncome: incomeStatement.net_income || 0
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('fa-IR').format(num);
    };

    const StatCard = ({ title, value, subtitle, color, onClick }: any) => (
        <div
            className={`bg-white rounded-lg shadow p-6 ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
            onClick={onClick}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-600 text-sm mb-1">{title}</p>
                    <p className={`text-2xl font-bold ${color || 'text-gray-900'}`}>{value}</p>
                    {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
                </div>
            </div>
        </div>
    );

    if (loading) {
        return <div className="text-center py-8">در حال بارگذاری...</div>;
    }

    return (
        <div>
            <PageHeader
                title="داشبورد حسابداری"
                subtitle="خلاصه اطلاعات مالی و حسابداری"
            />

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    title="تعداد حساب‌ها"
                    value={formatNumber(stats.totalAccounts)}
                    onClick={() => router.push('/dashboard/accounting/accounts')}
                />
                <StatCard
                    title="اسناد حسابداری"
                    value={formatNumber(stats.totalJournalEntries)}
                    subtitle={`${formatNumber(stats.draftEntries)} پیش‌نویس، ${formatNumber(stats.postedEntries)} ثبت شده`}
                    onClick={() => router.push('/dashboard/accounting/journals')}
                />
                <StatCard
                    title="جمع دارایی‌ها"
                    value={formatNumber(stats.totalAssets)}
                    color="text-green-600"
                />
                <StatCard
                    title={stats.netIncome >= 0 ? 'سود خالص' : 'زیان خالص'}
                    value={formatNumber(Math.abs(stats.netIncome))}
                    color={stats.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}
                />
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Balance Sheet Summary */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">ترازنامه</h3>
                        <button
                            onClick={() => router.push('/dashboard/accounting/reports')}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                            مشاهده کامل ←
                        </button>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b">
                            <span className="text-gray-600">دارایی‌ها</span>
                            <span className="font-semibold text-green-600">{formatNumber(stats.totalAssets)}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                            <span className="text-gray-600">بدهی‌ها</span>
                            <span className="font-semibold text-red-600">{formatNumber(stats.totalLiabilities)}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                            <span className="text-gray-600">حقوق صاحبان سهام</span>
                            <span className="font-semibold text-blue-600">{formatNumber(stats.totalEquity)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 bg-gray-50 p-3 rounded">
                            <span className="font-bold">بدهی‌ها + حقوق صاحبان سهام</span>
                            <span className="font-bold">{formatNumber(stats.totalLiabilities + stats.totalEquity)}</span>
                        </div>
                    </div>
                </div>

                {/* Income Statement Summary */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">صورت سود و زیان</h3>
                        <button
                            onClick={() => router.push('/dashboard/accounting/reports')}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                            مشاهده کامل ←
                        </button>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b">
                            <span className="text-gray-600">درآمدها</span>
                            <span className="font-semibold text-green-600">{formatNumber(stats.totalRevenue)}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                            <span className="text-gray-600">هزینه‌ها</span>
                            <span className="font-semibold text-red-600">{formatNumber(stats.totalExpenses)}</span>
                        </div>
                        <div className={`flex justify-between items-center pt-2 p-3 rounded ${stats.netIncome >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                            <span className="font-bold">{stats.netIncome >= 0 ? 'سود خالص' : 'زیان خالص'}</span>
                            <span className={`font-bold ${stats.netIncome >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                {formatNumber(Math.abs(stats.netIncome))}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold mb-4">دسترسی سریع</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button
                        onClick={() => router.push('/dashboard/accounting/accounts')}
                        className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-right"
                    >
                        <div className="text-2xl mb-2">📊</div>
                        <div className="font-semibold">دفتر حساب‌ها</div>
                        <div className="text-sm text-gray-600">مدیریت حساب‌ها</div>
                    </button>
                    <button
                        onClick={() => router.push('/dashboard/accounting/journals')}
                        className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-right"
                    >
                        <div className="text-2xl mb-2">📝</div>
                        <div className="font-semibold">اسناد حسابداری</div>
                        <div className="text-sm text-gray-600">ثبت و مدیریت اسناد</div>
                    </button>
                    <button
                        onClick={() => router.push('/dashboard/accounting/journals/create')}
                        className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-right"
                    >
                        <div className="text-2xl mb-2">➕</div>
                        <div className="font-semibold">سند جدید</div>
                        <div className="text-sm text-gray-600">ثبت سند حسابداری</div>
                    </button>
                    <button
                        onClick={() => router.push('/dashboard/accounting/reports')}
                        className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-right"
                    >
                        <div className="text-2xl mb-2">📈</div>
                        <div className="font-semibold">گزارشات مالی</div>
                        <div className="text-sm text-gray-600">ترازنامه و سود و زیان</div>
                    </button>
                </div>
            </div>
        </div>
    );
}
