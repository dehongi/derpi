'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import { getLeads, getOpportunities, getActivities } from '@/lib/api/crm';

export default function CrmDashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        leads: { total: 0, new: 0, contacted: 0, qualified: 0, lost: 0 },
        opportunities: {
            total: 0,
            prospecting: 0,
            qualification: 0,
            proposal: 0,
            negotiation: 0,
            closedWon: 0,
            closedLost: 0,
            totalValue: 0,
            weightedValue: 0,
            wonValue: 0,
            lostValue: 0
        },
        activities: { total: 0, pending: 0, completed: 0, overdue: 0 }
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [leadsRes, opportunitiesRes, activitiesRes] = await Promise.all([
                getLeads(),
                getOpportunities(),
                getActivities()
            ]);

            const leads = leadsRes.data;
            const opportunities = opportunitiesRes.data;
            const activities = activitiesRes.data;

            // Calculate opportunity values
            const totalValue = opportunities.reduce((sum: number, opp: any) => sum + (parseFloat(opp.value) || 0), 0);
            const weightedValue = opportunities.reduce((sum: number, opp: any) => {
                const value = parseFloat(opp.value) || 0;
                const probability = parseFloat(opp.probability) || 0;
                return sum + (value * probability / 100);
            }, 0);
            const wonValue = opportunities
                .filter((opp: any) => opp.stage === 'closed_won')
                .reduce((sum: number, opp: any) => sum + (parseFloat(opp.value) || 0), 0);
            const lostValue = opportunities
                .filter((opp: any) => opp.stage === 'closed_lost')
                .reduce((sum: number, opp: any) => sum + (parseFloat(opp.value) || 0), 0);

            // Calculate overdue activities
            const now = new Date();
            const overdue = activities.filter((act: any) => {
                if (act.completed) return false;
                if (!act.due_date) return false;
                return new Date(act.due_date) < now;
            }).length;

            setStats({
                leads: {
                    total: leads.length,
                    new: leads.filter((l: any) => l.status === 'new').length,
                    contacted: leads.filter((l: any) => l.status === 'contacted').length,
                    qualified: leads.filter((l: any) => l.status === 'qualified').length,
                    lost: leads.filter((l: any) => l.status === 'lost').length
                },
                opportunities: {
                    total: opportunities.length,
                    prospecting: opportunities.filter((o: any) => o.stage === 'prospecting').length,
                    qualification: opportunities.filter((o: any) => o.stage === 'qualification').length,
                    proposal: opportunities.filter((o: any) => o.stage === 'proposal').length,
                    negotiation: opportunities.filter((o: any) => o.stage === 'negotiation').length,
                    closedWon: opportunities.filter((o: any) => o.stage === 'closed_won').length,
                    closedLost: opportunities.filter((o: any) => o.stage === 'closed_lost').length,
                    totalValue,
                    weightedValue,
                    wonValue,
                    lostValue
                },
                activities: {
                    total: activities.length,
                    pending: activities.filter((a: any) => !a.completed).length,
                    completed: activities.filter((a: any) => a.completed).length,
                    overdue
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
                title="داشبورد CRM"
                subtitle="مدیریت سرنخ‌ها، فرصت‌ها و فعالیت‌های فروش"
            />

            {/* Statistics Overview */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">آمار کلی</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="سرنخ‌ها"
                        value={stats.leads.total}
                        subtitle={`${stats.leads.new} جدید، ${stats.leads.qualified} واجد شرایط`}
                        color="blue"
                        onClick={() => router.push('/dashboard/crm/leads')}
                    />
                    <StatCard
                        title="فرصت‌ها"
                        value={stats.opportunities.total}
                        subtitle={`${stats.opportunities.closedWon} برنده، ${stats.opportunities.closedLost} بازنده`}
                        color="green"
                        onClick={() => router.push('/dashboard/crm/opportunities')}
                    />
                    <StatCard
                        title="فعالیت‌ها"
                        value={stats.activities.total}
                        subtitle={`${stats.activities.pending} در انتظار، ${stats.activities.overdue} معوقه`}
                        color="purple"
                        onClick={() => router.push('/dashboard/crm/activities')}
                    />
                    <StatCard
                        title="نرخ تبدیل"
                        value={`${stats.leads.total > 0 ? Math.round((stats.opportunities.total / stats.leads.total) * 100) : 0}%`}
                        subtitle={`از ${stats.leads.total} سرنخ به ${stats.opportunities.total} فرصت`}
                        color="orange"
                    />
                </div>
            </div>

            {/* Financial Summary */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">خلاصه مالی فرصت‌ها</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
                        <h3 className="text-sm font-medium mb-2 opacity-90">ارزش کل</h3>
                        <p className="text-3xl font-bold">{stats.opportunities.totalValue.toLocaleString()}</p>
                        <p className="text-sm mt-1 opacity-90">ریال</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
                        <h3 className="text-sm font-medium mb-2 opacity-90">ارزش موزون</h3>
                        <p className="text-3xl font-bold">{stats.opportunities.weightedValue.toLocaleString()}</p>
                        <p className="text-sm mt-1 opacity-90">ریال (بر اساس احتمال)</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
                        <h3 className="text-sm font-medium mb-2 opacity-90">فروش موفق</h3>
                        <p className="text-3xl font-bold">{stats.opportunities.wonValue.toLocaleString()}</p>
                        <p className="text-sm mt-1 opacity-90">ریال</p>
                    </div>
                    <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow p-6 text-white">
                        <h3 className="text-sm font-medium mb-2 opacity-90">فروش ناموفق</h3>
                        <p className="text-3xl font-bold">{stats.opportunities.lostValue.toLocaleString()}</p>
                        <p className="text-sm mt-1 opacity-90">ریال</p>
                    </div>
                </div>
            </div>

            {/* Pipeline Overview */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">مراحل فرصت‌ها</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="bg-white rounded-lg shadow p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{stats.opportunities.prospecting}</div>
                        <div className="text-sm text-gray-600 mt-1">جستجو</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 text-center">
                        <div className="text-2xl font-bold text-indigo-600">{stats.opportunities.qualification}</div>
                        <div className="text-sm text-gray-600 mt-1">ارزیابی</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">{stats.opportunities.proposal}</div>
                        <div className="text-sm text-gray-600 mt-1">پیشنهاد</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 text-center">
                        <div className="text-2xl font-bold text-orange-600">{stats.opportunities.negotiation}</div>
                        <div className="text-sm text-gray-600 mt-1">مذاکره</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{stats.opportunities.closedWon}</div>
                        <div className="text-sm text-gray-600 mt-1">برنده</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 text-center">
                        <div className="text-2xl font-bold text-red-600">{stats.opportunities.closedLost}</div>
                        <div className="text-sm text-gray-600 mt-1">بازنده</div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">دسترسی سریع</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <QuickLinkCard
                        title="سرنخ‌ها"
                        description="مشاهده و مدیریت سرنخ‌های فروش"
                        icon="🎯"
                        color="blue"
                        onClick={() => router.push('/dashboard/crm/leads')}
                    />
                    <QuickLinkCard
                        title="فرصت‌ها"
                        description="پیگیری فرصت‌های فروش"
                        icon="💼"
                        color="green"
                        onClick={() => router.push('/dashboard/crm/opportunities')}
                    />
                    <QuickLinkCard
                        title="فعالیت‌ها"
                        description="مدیریت تماس‌ها، جلسات و وظایف"
                        icon="📅"
                        color="purple"
                        onClick={() => router.push('/dashboard/crm/activities')}
                    />
                </div>
            </div>

            {/* Create New Actions */}
            <div>
                <h2 className="text-xl font-semibold mb-4">ایجاد جدید</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => router.push('/dashboard/crm/leads/create')}
                        className="bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        + سرنخ جدید
                    </button>
                    <button
                        onClick={() => router.push('/dashboard/crm/opportunities/create')}
                        className="bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                        + فرصت جدید
                    </button>
                    <button
                        onClick={() => router.push('/dashboard/crm/activities/create')}
                        className="bg-purple-600 text-white px-6 py-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                    >
                        + فعالیت جدید
                    </button>
                </div>
            </div>
        </div>
    );
}
