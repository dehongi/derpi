"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/utils/api";

interface Product {
    id: number;
    price: string;
    stock_quantity: number;
}

interface Order {
    id: number;
    total: string;
    status: string;
    created_at: string;
}

export default function EcommerceDashboardPage() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        lowStock: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
    });
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch Products for stats
            const productsRes = await api.get("/ecommerce/products/");
            const productsData = productsRes.data;
            const products: Product[] = Array.isArray(productsData) ? productsData : (productsData.results || []);

            // Fetch Orders for stats
            const ordersRes = await api.get("/ecommerce/orders/");
            const ordersData = ordersRes.data;
            const orders: Order[] = Array.isArray(ordersData) ? ordersData : (ordersData.results || []);

            // Calculate Stats
            const totalProducts = products.length;
            const lowStock = products.filter(p => p.stock_quantity < 10).length;
            const totalOrders = orders.length;
            const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
            const pendingOrders = orders.filter(o => o.status === 'pending').length;

            setStats({
                totalProducts,
                lowStock,
                totalOrders,
                totalRevenue,
                pendingOrders,
            });
            setRecentOrders(orders.slice(0, 5)); // Top 5 recent orders

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">داشبورد فروشگاه</h1>
                    <p className="text-gray-500">خلاصه وضعیت فروشگاه شما</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/dashboard/ecommerce/products/create" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                        <span>+</span> محصول جدید
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                            <span className="text-2xl">📦</span>
                        </div>
                        <span className="text-sm text-gray-500">محصولات</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">{loading ? "..." : stats.totalProducts}</div>
                    <div className="text-xs text-gray-500 mt-1">
                        {loading ? "..." : `${stats.lowStock} محصول در حال اتمام`}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-50 p-3 rounded-lg text-green-600">
                            <span className="text-2xl">💰</span>
                        </div>
                        <span className="text-sm text-gray-500">درآمد کل</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">
                        {loading ? "..." : Number(stats.totalRevenue).toLocaleString()}
                        <span className="text-sm font-normal text-gray-500 mr-1">تومان</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">از {stats.totalOrders} سفارش</div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-purple-50 p-3 rounded-lg text-purple-600">
                            <span className="text-2xl">🛒</span>
                        </div>
                        <span className="text-sm text-gray-500">سفارشات</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">{loading ? "..." : stats.totalOrders}</div>
                    <div className="text-xs text-gray-500 mt-1">
                        {loading ? "..." : `${stats.pendingOrders} سفارش در انتظار`}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-orange-50 p-3 rounded-lg text-orange-600">
                            <span className="text-2xl">⚠️</span>
                        </div>
                        <span className="text-sm text-gray-500">نیازمند اقدام</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">
                        {loading ? "..." : stats.pendingOrders + (stats.lowStock > 0 ? 1 : 0)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">مواردی که نیاز به بررسی دارند</div>
                </div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Links */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-800 mb-4">دسترسی سریع</h3>
                    <div className="space-y-3">
                        <Link href="/dashboard/ecommerce/products" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                            <div className="flex items-center gap-3">
                                <span className="bg-blue-100 text-blue-600 p-2 rounded-lg text-xl">📦</span>
                                <span className="font-medium text-gray-700">مدیریت محصولات</span>
                            </div>
                            <span className="text-gray-400">←</span>
                        </Link>
                        <Link href="/dashboard/ecommerce/orders" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                            <div className="flex items-center gap-3">
                                <span className="bg-purple-100 text-purple-600 p-2 rounded-lg text-xl">🛒</span>
                                <span className="font-medium text-gray-700">مدیریت سفارشات</span>
                            </div>
                            <span className="text-gray-400">←</span>
                        </Link>
                        <Link href="/dashboard/ecommerce/categories" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                            <div className="flex items-center gap-3">
                                <span className="bg-yellow-100 text-yellow-600 p-2 rounded-lg text-xl">🏷️</span>
                                <span className="font-medium text-gray-700">دسته‌بندی‌ها</span>
                            </div>
                            <span className="text-gray-400">←</span>
                        </Link>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800">سفارشات اخیر</h3>
                        <Link href="/dashboard/ecommerce/orders" className="text-sm text-indigo-600 hover:text-indigo-800">
                            مشاهده همه
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead className="bg-gray-50 rounded-lg">
                                <tr>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500">شماره سفارش</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500">تاریخ</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500">مبلغ</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500">وضعیت</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr><td colSpan={4} className="text-center py-4">در حال بارگذاری...</td></tr>
                                ) : recentOrders.length === 0 ? (
                                    <tr><td colSpan={4} className="text-center py-4 text-gray-500">هنوز سفارشی ثبت نشده است</td></tr>
                                ) : (
                                    recentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-mono text-sm">#{order.id}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {new Date(order.created_at).toLocaleDateString('fa-IR')}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-gray-900">
                                                {Number(order.total).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
