'use client';

// Procurement Dashboard Index

import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';

export default function ProcurementIndexPage() {
    const router = useRouter();

    const modules = [
        {
            title: 'تامین‌کنندگان',
            description: 'مدیریت لیست تامین‌کنندگان و اطلاعات تماس',
            link: '/dashboard/procurement/suppliers',
            createLink: '/dashboard/procurement/suppliers/create',
            createLabel: 'افزودن تامین‌کننده',
            icon: (
                <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            )
        },
        {
            title: 'سفارش‌های خرید',
            description: 'مدیریت سفارش‌های خرید و پیگیری وضعیت',
            link: '/dashboard/procurement/purchase-orders',
            createLink: '/dashboard/procurement/purchase-orders/create',
            createLabel: 'افزودن سفارش خرید',
            icon: (
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
            )
        },
        {
            title: 'رسیدهای خرید',
            description: 'ثبت و مدیریت کالاهای دریافت شده',
            link: '/dashboard/procurement/purchase-receipts',
            createLink: '/dashboard/procurement/purchase-receipts/create',
            createLabel: 'افزودن رسید خرید',
            icon: (
                <svg className="w-8 h-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            )
        }
    ];

    return (
        <div>
            <PageHeader
                title="مدیریت تدارکات"
                subtitle="دسترسی سریع به بخش‌های تدارکات"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {modules.map((module, index) => (
                    <div key={index} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gray-50 rounded-full">
                                {module.icon}
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{module.title}</h3>
                        <p className="text-gray-600 mb-6 text-sm h-10">{module.description}</p>

                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => router.push(module.link)}
                                className="w-full py-2 px-4 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 text-sm"
                            >
                                مشاهده لیست
                            </button>
                            <button
                                onClick={() => router.push(module.createLink)}
                                className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                            >
                                {module.createLabel}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
