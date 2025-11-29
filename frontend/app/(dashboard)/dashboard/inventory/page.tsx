'use client';

import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';

export default function InventoryIndexPage() {
    const router = useRouter();

    const modules = [
        {
            title: 'کالاها',
            description: 'مدیریت کالاها و خدمات',
            icon: '📦',
            href: '/dashboard/inventory/items',
            color: 'bg-blue-50 text-blue-700 hover:bg-blue-100'
        },
        {
            title: 'انبارها',
            description: 'مدیریت انبارها و موقعیت‌ها',
            icon: '🏭',
            href: '/dashboard/inventory/warehouses',
            color: 'bg-green-50 text-green-700 hover:bg-green-100'
        },
        {
            title: 'موجودی انبار',
            description: 'مشاهده موجودی کالاها',
            icon: '📊',
            href: '/dashboard/inventory/stocks',
            color: 'bg-purple-50 text-purple-700 hover:bg-purple-100'
        },
        {
            title: 'گردش کالا',
            description: 'ثبت و مشاهده ورود و خروج',
            icon: '🔄',
            href: '/dashboard/inventory/movements',
            color: 'bg-orange-50 text-orange-700 hover:bg-orange-100'
        }
    ];

    return (
        <div>
            <PageHeader
                title="مدیریت انبار"
                subtitle="سیستم جامع مدیریت انبار و موجودی"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {modules.map((module) => (
                    <button
                        key={module.href}
                        onClick={() => router.push(module.href)}
                        className={`p-6 rounded-xl transition-all text-right ${module.color}`}
                    >
                        <div className="text-4xl mb-4">{module.icon}</div>
                        <h3 className="text-lg font-bold mb-2">{module.title}</h3>
                        <p className="text-sm opacity-80">{module.description}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}
