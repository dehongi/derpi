'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import api from '@/utils/api';

export default function WebsiteDashboardPage() {
    const router = useRouter();
    const [stats, setStats] = useState({
        pages: 0,
        blogPosts: 0,
        globalPages: 0,
        publishedPages: 0,
        publishedBlogPosts: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [pagesRes, blogPostsRes, globalPagesRes] = await Promise.allSettled([
                api.get('/website/pages/'),
                api.get('/website/blog-posts/'),
                api.get('/website/global-pages/'),
            ]);

            const pages = pagesRes.status === 'fulfilled' ? pagesRes.value.data : [];
            const blogPosts = blogPostsRes.status === 'fulfilled' ? blogPostsRes.value.data : [];
            const globalPages = globalPagesRes.status === 'fulfilled' ? globalPagesRes.value.data : [];

            setStats({
                pages: pages.length,
                blogPosts: blogPosts.length,
                globalPages: globalPages.length,
                publishedPages: pages.filter((p: any) => p.is_published).length,
                publishedBlogPosts: blogPosts.filter((p: any) => p.is_published).length,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, subtitle, icon, color, onClick }: any) => (
        <div
            onClick={onClick}
            className={`bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow ${color}`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                    {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
                </div>
                <div className="text-4xl opacity-20">{icon}</div>
            </div>
        </div>
    );

    return (
        <div>
            <PageHeader
                title="داشبورد وب‌سایت"
                subtitle="مدیریت صفحات، پست‌های وبلاگ و محتوای وب‌سایت"
            />

            {loading ? (
                <div className="text-center py-12">در حال بارگذاری...</div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <StatCard
                            title="صفحات شرکت"
                            value={stats.pages}
                            subtitle={`${stats.publishedPages} منتشر شده`}
                            icon="📄"
                            color="border-l-4 border-blue-500"
                            onClick={() => router.push('/dashboard/website/pages')}
                        />
                        <StatCard
                            title="پست‌های وبلاگ"
                            value={stats.blogPosts}
                            subtitle={`${stats.publishedBlogPosts} منتشر شده`}
                            icon="📝"
                            color="border-l-4 border-green-500"
                            onClick={() => router.push('/dashboard/website/blog-posts')}
                        />
                        <StatCard
                            title="صفحات سراسری"
                            value={stats.globalPages}
                            subtitle="فقط سوپریوزر"
                            icon="🌐"
                            color="border-l-4 border-purple-500"
                            onClick={() => router.push('/dashboard/website/global-pages')}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">دسترسی سریع</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => router.push('/dashboard/website/pages/create')}
                                    className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-3"
                                >
                                    <span className="text-2xl">➕</span>
                                    <div>
                                        <p className="font-medium text-gray-900">افزودن صفحه جدید</p>
                                        <p className="text-xs text-gray-600">ایجاد صفحه جدید برای شرکت</p>
                                    </div>
                                </button>
                                <button
                                    onClick={() => router.push('/dashboard/website/blog-posts/create')}
                                    className="w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors flex items-center gap-3"
                                >
                                    <span className="text-2xl">✍️</span>
                                    <div>
                                        <p className="font-medium text-gray-900">نوشتن پست وبلاگ</p>
                                        <p className="text-xs text-gray-600">ایجاد پست وبلاگ جدید</p>
                                    </div>
                                </button>
                                <button
                                    onClick={() => router.push('/dashboard/website/global-pages/create')}
                                    className="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors flex items-center gap-3"
                                >
                                    <span className="text-2xl">🌍</span>
                                    <div>
                                        <p className="font-medium text-gray-900">افزودن صفحه سراسری</p>
                                        <p className="text-xs text-gray-600">فقط برای سوپریوزر</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">لینک‌های مفید</h3>
                            <div className="space-y-3">
                                <a
                                    href="/blog"
                                    target="_blank"
                                    className="block px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <p className="font-medium text-gray-900">مشاهده وبلاگ عمومی</p>
                                    <p className="text-xs text-gray-600">نمایش پست‌های منتشر شده</p>
                                </a>
                                <a
                                    href="/pages/about"
                                    target="_blank"
                                    className="block px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <p className="font-medium text-gray-900">مشاهده صفحات عمومی</p>
                                    <p className="text-xs text-gray-600">نمایش صفحات سراسری منتشر شده</p>
                                </a>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
