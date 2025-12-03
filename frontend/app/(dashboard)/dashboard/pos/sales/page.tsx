'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import JalaliDatePicker, { JalaliDateDisplay } from '@/components/JalaliDatePicker';
import api from '@/utils/api';

export default function POSSalesPage() {
    const router = useRouter();
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [status, setStatus] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchSales();
    }, [startDate, endDate, status, search]);

    const fetchSales = async () => {
        try {
            const params = new URLSearchParams();
            if (startDate) params.append('start_date', startDate);
            if (endDate) params.append('end_date', endDate);
            if (status) params.append('status', status);
            if (search) params.append('search', search);

            const response = await api.get(`/pos/sales/?${params.toString()}`);
            setSales(response.data);
        } catch (error) {
            console.error('Error fetching sales:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleView = (sale: any) => {
        router.push(`/dashboard/pos/sales/${sale.id}`);
    };

    const handleVoid = async (sale: any) => {
        if (sale.status === 'cancelled') {
            alert('این فروش قبلاً لغو شده است');
            return;
        }

        if (confirm('آیا از لغو این فروش اطمینان دارید؟ موجودی انبار بازگردانده خواهد شد.')) {
            try {
                await api.post(`/pos/sales/${sale.id}/void_sale/`);
                fetchSales();
                alert('فروش با موفقیت لغو شد');
            } catch (error) {
                console.error('Error voiding sale:', error);
                alert('خطا در لغو فروش');
            }
        }
    };

    const handlePrint = async (sale: any) => {
        try {
            const response = await api.get(`/pos/sales/${sale.id}/print_receipt/`);
            // Open print dialog with receipt data
            const printWindow = window.open('', '_blank');
            if (printWindow) {
                printWindow.document.write(`
                    <html>
                        <head>
                            <title>رسید فروش ${response.data.sale_number}</title>
                            <style>
                                body { font-family: Arial, sans-serif; padding: 20px; }
                                table { width: 100%; border-collapse: collapse; }
                                th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
                            </style>
                        </head>
                        <body>
                            <h2>رسید فروش</h2>
                            <p>شماره: ${response.data.sale_number}</p>
                            <p>تاریخ: ${new Date(response.data.date).toLocaleDateString('fa-IR')}</p>
                            <p>صندوقدار: ${response.data.cashier}</p>
                            <p>مشتری: ${response.data.customer}</p>
                            <table>
                                <thead>
                                    <tr>
                                        <th>کالا</th>
                                        <th>تعداد</th>
                                        <th>قیمت واحد</th>
                                        <th>جمع</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${response.data.items.map((item: any) => `
                                        <tr>
                                            <td>${item.name}</td>
                                            <td>${item.quantity}</td>
                                            <td>${item.unit_price.toLocaleString('fa-IR')}</td>
                                            <td>${item.total.toLocaleString('fa-IR')}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                            <p><strong>جمع کل: ${response.data.total.toLocaleString('fa-IR')} ریال</strong></p>
                            <p>روش پرداخت: ${response.data.payment_method}</p>
                        </body>
                    </html>
                `);
                printWindow.document.close();
                printWindow.print();
            }
        } catch (error) {
            console.error('Error printing receipt:', error);
            alert('خطا در چاپ رسید');
        }
    };

    const columns = [
        { key: 'sale_number', label: 'شماره فروش' },
        {
            key: 'date',
            label: 'تاریخ',
            render: (value: string) => <JalaliDateDisplay date={value} />
        },
        { key: 'customer_name', label: 'مشتری', render: (value: string) => value || 'عمومی' },
        {
            key: 'total',
            label: 'مبلغ کل',
            render: (value: number) => value?.toLocaleString('fa-IR') + ' ریال'
        },
        { key: 'payment_method_display', label: 'روش پرداخت' },
        {
            key: 'status_display',
            label: 'وضعیت',
            render: (value: string, row: any) => (
                <span className={`px-2 py-1 rounded text-xs ${row.status === 'completed' ? 'bg-green-100 text-green-800' :
                    row.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                    {value}
                </span>
            )
        }
    ];

    return (
        <div>
            <PageHeader
                title="تاریخچه فروش POS"
                subtitle="مدیریت فروش‌های نقطه‌ای"
                action={
                    <button
                        onClick={() => router.push('/dashboard/pos')}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        فروش جدید
                    </button>
                }
            />

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <JalaliDatePicker
                            label="از تاریخ"
                            value={startDate}
                            onChange={setStartDate}
                        />
                    </div>
                    <div>
                        <JalaliDatePicker
                            label="تا تاریخ"
                            value={endDate}
                            onChange={setEndDate}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">وضعیت</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        >
                            <option value="">همه</option>
                            <option value="completed">تکمیل شده</option>
                            <option value="cancelled">لغو شده</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">جستجو</label>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="شماره فروش یا نام مشتری"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                    </div>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={sales}
                onEdit={handleView}
                onDelete={handleVoid}
                loading={loading}
                customActions={(row) => (
                    <button
                        onClick={() => handlePrint(row)}
                        className="text-blue-600 hover:text-blue-800 ml-2"
                        title="چاپ رسید"
                    >
                        چاپ
                    </button>
                )}
            />
        </div>
    );
}
