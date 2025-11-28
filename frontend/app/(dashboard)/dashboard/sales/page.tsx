'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import { getSalesOrders, getQuotations, getInvoices, getPayments } from '@/lib/api/sales';

export default function SalesDashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        salesOrders: { total: 0, draft: 0, confirmed: 0, delivered: 0 },
        quotations: { total: 0, draft: 0, sent: 0, accepted: 0 },
        invoices: { total: 0, totalAmount: 0, paidAmount: 0, balance: 0 },
        payments: { total: 0, totalAmount: 0 }
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [ordersRes, quotesRes, invoicesRes, paymentsRes] = await Promise.all([
                getSalesOrders(),
                getQuotations(),
                getInvoices(),
                getPayments()
            ]);

            const orders = ordersRes.data;
            const quotes = quotesRes.data;
            const invoices = invoicesRes.data;
            const payments = paymentsRes.data;

            setStats({
                salesOrders: {
                    total: orders.length,
                    draft: orders.filter((o: any) => o.status === 'draft').length,
                    confirmed: orders.filter((o: any) => o.status === 'confirmed').length,
                    delivered: orders.filter((o: any) => o.status === 'delivered').length
                },
                quotations: {
                    total: quotes.length,
                    draft: quotes.filter((q: any) => q.status === 'draft').length,
                    sent: quotes.filter((q: any) => q.status === 'sent').length,
                    accepted: quotes.filter((q: any) => q.status === 'accepted').length
                },
                invoices: {
                    total: invoices.length,
                    totalAmount: invoices.reduce((sum: number, inv: any) => sum + (parseFloat(inv.total) || 0), 0),
                    paidAmount: invoices.reduce((sum: number, inv: any) => sum + (parseFloat(inv.paid_amount) || 0), 0),
                    balance: invoices.reduce((sum: number, inv: any) => sum + (parseFloat(inv.total) - parseFloat(inv.paid_amount) || 0), 0)
                },
                payments: {
                    total: payments.length,
                    totalAmount: payments.reduce((sum: number, p: any) => sum + (parseFloat(p.amount) || 0), 0)
                }
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, subtitle, color = 'blue', onClick }: any) => (
        <div
            onClick={onClick}
            className={`bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow border-t-4 border-${color}-500`}
        >
            <h3 className="text-gray-500 text-sm font-medium mb-2">{title}</h3>
            <p className="text-3xl font-bold text-gray-800 mb-1">{value}</p>
            {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        </div>
    );

    const QuickLinkCard = ({ title, description, icon, onClick, color = 'blue' }: any) => (
        <div
            onClick={onClick}
            className={`bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow hover:border-${color}-500 border-2 border-transparent`}
        >
            <div className="flex items-start">
                <div className={`text-4xl mb-4 text-${color}-600`}>{icon}</div>
                <div className="mr-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
                    <p className="text-sm text-gray-600">{description}</p>
                </div>
            </div>
        </div>
    );

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
                title="داشبورد فروش"
                subtitle="مدیریت فروش، پیش‌فاکتورها، فاکتورها و پرداخت‌ها"
            />

            {/* Statistics Overview */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">آمار کلی</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="سفارش‌های فروش"
                        value={stats.salesOrders.total}
                        subtitle={`${stats.salesOrders.confirmed} تایید شده، ${stats.salesOrders.delivered} تحویل شده`}
                        color="blue"
                        onClick={() => router.push('/dashboard/sales/sales-orders')}
                    />
                    <StatCard
                        title="پیش‌فاکتورها"
                        value={stats.quotations.total}
                        subtitle={`${stats.quotations.sent} ارسال شده، ${stats.quotations.accepted} پذیرفته شده`}
                        color="purple"
                        onClick={() => router.push('/dashboard/sales/quotations')}
                    />
                    <StatCard
                        title="فاکتورها"
                        value={stats.invoices.total}
                        subtitle={`${stats.invoices.totalAmount.toLocaleString()} ریال کل`}
                        color="green"
                        onClick={() => router.push('/dashboard/sales/invoices')}
                    />
                    <StatCard
                        title="پرداخت‌ها"
                        value={stats.payments.total}
                        subtitle={`${stats.payments.totalAmount.toLocaleString()} ریال دریافتی`}
                        color="orange"
                        onClick={() => router.push('/dashboard/sales/payments')}
                    />
                </div>
            </div>

            {/* Financial Summary */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">خلاصه مالی</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
                        <h3 className="text-sm font-medium mb-2 opacity-90">کل فاکتورها</h3>
                        <p className="text-3xl font-bold">{stats.invoices.totalAmount.toLocaleString()}</p>
                        <p className="text-sm mt-1 opacity-90">ریال</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
                        <h3 className="text-sm font-medium mb-2 opacity-90">دریافتی</h3>
                        <p className="text-3xl font-bold">{stats.invoices.paidAmount.toLocaleString()}</p>
                        <p className="text-sm mt-1 opacity-90">ریال</p>
                    </div>
                    <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow p-6 text-white">
                        <h3 className="text-sm font-medium mb-2 opacity-90">مانده</h3>
                        <p className="text-3xl font-bold">{stats.invoices.balance.toLocaleString()}</p>
                        <p className="text-sm mt-1 opacity-90">ریال</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">دسترسی سریع</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <QuickLinkCard
                        title="سفارش‌های فروش"
                        description="مشاهده و مدیریت سفارش‌های فروش"
                        icon="📋"
                        color="blue"
                        onClick={() => router.push('/dashboard/sales/sales-orders')}
                    />
                    <QuickLinkCard
                        title="پیش‌فاکتورها"
                        description="ایجاد و مدیریت پیش‌فاکتورها"
                        icon="📄"
                        color="purple"
                        onClick={() => router.push('/dashboard/sales/quotations')}
                    />
                    <QuickLinkCard
                        title="فاکتورها"
                        description="صدور و پیگیری فاکتورها"
                        icon="🧾"
                        color="green"
                        onClick={() => router.push('/dashboard/sales/invoices')}
                    />
                    <QuickLinkCard
                        title="پرداخت‌ها"
                        description="ثبت و مشاهده پرداخت‌ها"
                        icon="💰"
                        color="orange"
                        onClick={() => router.push('/dashboard/sales/payments')}
                    />
                </div>
            </div>

            {/* Create New Actions */}
            <div>
                <h2 className="text-xl font-semibold mb-4">ایجاد جدید</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button
                        onClick={() => router.push('/dashboard/sales/sales-orders/create')}
                        className="bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        + سفارش فروش جدید
                    </button>
                    <button
                        onClick={() => router.push('/dashboard/sales/quotations/create')}
                        className="bg-purple-600 text-white px-6 py-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                    >
                        + پیش‌فاکتور جدید
                    </button>
                    <button
                        onClick={() => router.push('/dashboard/sales/invoices/create')}
                        className="bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                        + فاکتور جدید
                    </button>
                    <button
                        onClick={() => router.push('/dashboard/sales/payments/create')}
                        className="bg-orange-600 text-white px-6 py-4 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                    >
                        + ثبت پرداخت جدید
                    </button>
                </div>
            </div>
        </div>
    );
}
