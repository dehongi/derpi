'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDepartments, getEmployees, getAttendances, getLeaves } from '@/lib/api/hr';

export default function HRDashboardPage() {
    const router = useRouter();
    const [stats, setStats] = useState({
        departments: 0,
        employees: 0,
        todayAttendance: 0,
        pendingLeaves: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [depts, emps, attendance, leaves] = await Promise.all([
                getDepartments(),
                getEmployees(),
                getAttendances(),
                getLeaves(),
            ]);

            const today = new Date().toISOString().split('T')[0];
            const todayAttendance = attendance.data.filter((a: any) => a.date === today).length;
            const pendingLeaves = leaves.data.filter((l: any) => l.status === 'pending').length;

            setStats({
                departments: depts.data.length,
                employees: emps.data.length,
                todayAttendance,
                pendingLeaves,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">پیشخوان منابع انسانی</h1>
                <p className="text-gray-600">خلاصه‌ای از وضعیت منابع انسانی</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center text-white text-2xl">
                            🏢
                        </div>
                        <span className="text-sm font-medium text-gray-500">بخش‌ها</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.departments}</h3>
                    <p className="text-sm text-gray-600">بخش‌های فعال</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white text-2xl">
                            👥
                        </div>
                        <span className="text-sm font-medium text-gray-500">کارمندان</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.employees}</h3>
                    <p className="text-sm text-gray-600">کارمندان فعال</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-2xl">
                            ✅
                        </div>
                        <span className="text-sm font-medium text-gray-500">حضور امروز</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.todayAttendance}</h3>
                    <p className="text-sm text-gray-600">حاضر امروز</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white text-2xl">
                            📋
                        </div>
                        <span className="text-sm font-medium text-gray-500">مرخصی‌ها</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.pendingLeaves}</h3>
                    <p className="text-sm text-gray-600">در انتظار تایید</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">دسترسی سریع</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button
                        onClick={() => router.push('/dashboard/hr/departments')}
                        className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl hover:from-blue-100 hover:to-cyan-100 transition-all border border-blue-200"
                    >
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xl">
                            🏢
                        </div>
                        <div className="text-right">
                            <div className="font-semibold text-gray-900">بخش‌ها</div>
                            <div className="text-xs text-gray-600">مدیریت بخش‌ها</div>
                        </div>
                    </button>

                    <button
                        onClick={() => router.push('/dashboard/hr/employees')}
                        className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all border border-purple-200"
                    >
                        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white text-xl">
                            👥
                        </div>
                        <div className="text-right">
                            <div className="font-semibold text-gray-900">کارمندان</div>
                            <div className="text-xs text-gray-600">مدیریت کارمندان</div>
                        </div>
                    </button>

                    <button
                        onClick={() => router.push('/dashboard/hr/attendances')}
                        className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all border border-green-200"
                    >
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white text-xl">
                            ✅
                        </div>
                        <div className="text-right">
                            <div className="font-semibold text-gray-900">حضور و غیاب</div>
                            <div className="text-xs text-gray-600">ثبت و مدیریت</div>
                        </div>
                    </button>

                    <button
                        onClick={() => router.push('/dashboard/hr/leaves')}
                        className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl hover:from-orange-100 hover:to-red-100 transition-all border border-orange-200"
                    >
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white text-xl">
                            📋
                        </div>
                        <div className="text-right">
                            <div className="font-semibold text-gray-900">مرخصی‌ها</div>
                            <div className="text-xs text-gray-600">درخواست و تایید</div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
