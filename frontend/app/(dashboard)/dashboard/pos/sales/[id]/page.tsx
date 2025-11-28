'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import Receipt from '@/components/pos/Receipt';
import api from '@/utils/api';

export default function POSSaleDetailPage() {
    const router = useRouter();
    const params = useParams();
    const [sale, setSale] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetchSale();
        }
    }, [params.id]);

    const fetchSale = async () => {
        try {
            const response = await api.get(`/pos/sales/${params.id}/`);
            setSale(response.data);
        } catch (error) {
            console.error('Error fetching sale:', error);
            alert('خطا در بارگذاری اطلاعات فروش');
        } finally {
            setLoading(false);
        }
    };

    const handleVoid = async () => {
        if (sale.status === 'cancelled') {
            alert('این فروش قبلاً لغو شده است');
            return;
        }

        if (confirm('آیا از لغو این فروش اطمینان دارید؟ موجودی انبار بازگردانده خواهد شد.')) {
            try {
                const response = await api.post(`/pos/sales/${params.id}/void_sale/`);
                setSale(response.data);
                alert('فروش با موفقیت لغو شد');
            } catch (error) {
                console.error('Error voiding sale:', error);
                alert('خطا در لغو فروش');
            }
        }
    };

    const handlePrint = async () => {
        try {
            const response = await api.get(`/pos/sales/${params.id}/print_receipt/`);
            window.print();
        } catch (error) {
            console.error('Error printing receipt:', error);
        }
    };

    if (loading) {
        return (
            <div>
                <PageHeader title="جزئیات فروش" subtitle="در حال بارگذاری..." />
                <div className="text-center py-8">در حال بارگذاری...</div>
            </div>
        );
    }

    if (!sale) {
        return (
            <div>
                <PageHeader title="جزئیات فروش" subtitle="فروش یافت نشد" />
                <div className="text-center py-8">فروش یافت نشد</div>
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                title={`فروش ${sale.sale_number}`}
                subtitle={`وضعیت: ${sale.status_display}`}
                action={
                    <div className="flex gap-2">
                        <button
                            onClick={() => router.push('/dashboard/pos/sales')}
                            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                        >
                            بازگشت
                        </button>
                        <button
                            onClick={handlePrint}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            چاپ رسید
                        </button>
                        {sale.status === 'completed' && (
                            <button
                                onClick={handleVoid}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                لغو فروش
                            </button>
                        )}
                    </div>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sale Details */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">اطلاعات فروش</h3>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">شماره فروش:</span>
                                <span className="font-semibold">{sale.sale_number}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">تاریخ:</span>
                                <span>{new Date(sale.date).toLocaleDateString('fa-IR')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">صندوقدار:</span>
                                <span>{sale.cashier_name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">مشتری:</span>
                                <span>{sale.customer_details?.name || 'عمومی'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">روش پرداخت:</span>
                                <span>{sale.payment_method_display}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">وضعیت:</span>
                                <span className={`px-2 py-1 rounded text-xs ${sale.status === 'completed' ? 'bg-green-100 text-green-800' :
                                        sale.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                    }`}>
                                    {sale.status_display}
                                </span>
                            </div>
                        </div>

                        {sale.customer_details && (
                            <div className="mt-4 pt-4 border-t">
                                <h4 className="font-semibold text-gray-900 mb-2">اطلاعات مشتری</h4>
                                <div className="space-y-2 text-sm">
                                    {sale.customer_details.phone && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">تلفن:</span>
                                            <span>{sale.customer_details.phone}</span>
                                        </div>
                                    )}
                                    {sale.customer_details.mobile && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">موبایل:</span>
                                            <span>{sale.customer_details.mobile}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {sale.notes && (
                            <div className="mt-4 pt-4 border-t">
                                <h4 className="font-semibold text-gray-900 mb-2">یادداشت</h4>
                                <p className="text-sm text-gray-600">{sale.notes}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Receipt */}
                <div className="lg:col-span-2">
                    <Receipt sale={sale} />
                </div>
            </div>
        </div>
    );
}
