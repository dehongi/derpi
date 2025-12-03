'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import JalaliDatePicker from '@/components/JalaliDatePicker';
import { createInvoice, createInvoiceItem, getCustomers, getItems, getSalesOrders } from '@/lib/api/sales';

export default function CreateInvoicePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [customers, setCustomers] = useState<any[]>([]);
    const [inventoryItems, setInventoryItems] = useState<any[]>([]);
    const [salesOrders, setSalesOrders] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        invoice_number: '',
        customer: '',
        sales_order: '',
        date: new Date().toISOString().split('T')[0],
        due_date: '',
        status: 'draft',
        paid_amount: 0,
        notes: '',
        discount: 0,
        tax: 0,
    });

    const [invoiceItems, setInvoiceItems] = useState<any[]>([
        { item: '', quantity: 1, unit_price: 0, discount: 0, total: 0 }
    ]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [customersRes, itemsRes, ordersRes] = await Promise.all([
                getCustomers(),
                getItems(),
                getSalesOrders()
            ]);
            setCustomers(customersRes.data);
            setInventoryItems(itemsRes.data);
            setSalesOrders(ordersRes.data);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('خطا در بارگذاری اطلاعات اولیه');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (index: number, field: string, value: any) => {
        const newItems = [...invoiceItems];
        newItems[index][field] = value;

        if (field === 'item') {
            const selectedItem = inventoryItems.find(i => i.id === parseInt(value));
            if (selectedItem) {
                newItems[index].unit_price = selectedItem.sale_price || 0;
            }
        }

        const qty = parseFloat(newItems[index].quantity) || 0;
        const price = parseFloat(newItems[index].unit_price) || 0;
        const discount = parseFloat(newItems[index].discount) || 0;
        newItems[index].total = (qty * price) - discount;

        setInvoiceItems(newItems);
    };

    const addItem = () => {
        setInvoiceItems([...invoiceItems, { item: '', quantity: 1, unit_price: 0, discount: 0, total: 0 }]);
    };

    const removeItem = (index: number) => {
        const newItems = [...invoiceItems];
        newItems.splice(index, 1);
        setInvoiceItems(newItems);
    };

    const calculateTotals = () => {
        const subtotal = invoiceItems.reduce((sum, item) => sum + (item.total || 0), 0);
        const discount = parseFloat(formData.discount as any) || 0;
        const tax = parseFloat(formData.tax as any) || 0;
        const total = subtotal - discount + tax;
        const paidAmount = parseFloat(formData.paid_amount as any) || 0;
        const balance = total - paidAmount;
        return { subtotal, total, balance };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const { subtotal, total } = calculateTotals();

            const invoiceData = {
                ...formData,
                sales_order: formData.sales_order || null,
                subtotal,
                total
            };

            const invoiceRes = await createInvoice(invoiceData);
            const invoiceId = invoiceRes.data.id;

            for (const item of invoiceItems) {
                if (!item.item) continue;
                await createInvoiceItem({
                    invoice: invoiceId,
                    item: item.item,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    discount: item.discount,
                    total: item.total,
                    description: item.description || ''
                });
            }

            setSuccess('فاکتور با موفقیت ایجاد شد');
            setTimeout(() => {
                router.push('/dashboard/sales/invoices');
            }, 1500);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.detail || 'خطا در ایجاد فاکتور');
        } finally {
            setLoading(false);
        }
    };

    const { subtotal, total, balance } = calculateTotals();

    return (
        <div>
            <PageHeader
                title="افزودن فاکتور جدید"
                subtitle="ایجاد فاکتور جدید در سیستم"
            />

            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">شماره فاکتور</label>
                        <input
                            type="text"
                            name="invoice_number"
                            value={formData.invoice_number}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">مشتری</label>
                        <select
                            name="customer"
                            value={formData.customer}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            required
                        >
                            <option value="">انتخاب کنید...</option>
                            {customers.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">سفارش فروش (اختیاری)</label>
                        <select
                            name="sales_order"
                            value={formData.sales_order}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        >
                            <option value="">بدون سفارش</option>
                            {salesOrders.map(o => (
                                <option key={o.id} value={o.id}>{o.order_number}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <JalaliDatePicker
                            label="تاریخ"
                            value={formData.date}
                            onChange={(date) => setFormData(prev => ({ ...prev, date }))}
                            required
                        />
                    </div>
                    <div>
                        <JalaliDatePicker
                            label="سررسید"
                            value={formData.due_date}
                            onChange={(date) => setFormData(prev => ({ ...prev, due_date: date }))}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">وضعیت</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        >
                            <option value="draft">پیش‌نویس</option>
                            <option value="sent">ارسال شده</option>
                            <option value="paid">پرداخت شده</option>
                            <option value="overdue">سررسید گذشته</option>
                            <option value="cancelled">لغو شده</option>
                        </select>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-medium mb-4">آیتم‌ها</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="border p-2">کالا</th>
                                    <th className="border p-2 w-24">تعداد</th>
                                    <th className="border p-2 w-32">قیمت واحد</th>
                                    <th className="border p-2 w-32">تخفیف</th>
                                    <th className="border p-2 w-32">جمع</th>
                                    <th className="border p-2 w-16"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoiceItems.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border p-2">
                                            <select
                                                value={item.item}
                                                onChange={(e) => handleItemChange(index, 'item', e.target.value)}
                                                className="w-full border rounded px-2 py-1"
                                                required
                                            >
                                                <option value="">انتخاب کالا...</option>
                                                {inventoryItems.map(i => (
                                                    <option key={i.id} value={i.id}>{i.name}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="border p-2">
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                                className="w-full border rounded px-2 py-1"
                                                min="1"
                                                required
                                            />
                                        </td>
                                        <td className="border p-2">
                                            <input
                                                type="number"
                                                value={item.unit_price}
                                                onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                                                className="w-full border rounded px-2 py-1"
                                                required
                                            />
                                        </td>
                                        <td className="border p-2">
                                            <input
                                                type="number"
                                                value={item.discount}
                                                onChange={(e) => handleItemChange(index, 'discount', e.target.value)}
                                                className="w-full border rounded px-2 py-1"
                                            />
                                        </td>
                                        <td className="border p-2 bg-gray-50">
                                            {item.total.toLocaleString()}
                                        </td>
                                        <td className="border p-2 text-center">
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                ×
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <button
                        type="button"
                        onClick={addItem}
                        className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        + افزودن آیتم
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">یادداشت‌ها</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 h-32"
                        />
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                        <div className="flex justify-between mb-2">
                            <span>جمع جزء:</span>
                            <span>{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between mb-2 items-center">
                            <span>تخفیف کلی:</span>
                            <input
                                type="number"
                                name="discount"
                                value={formData.discount}
                                onChange={handleChange}
                                className="w-32 border rounded px-2 py-1 text-left"
                            />
                        </div>
                        <div className="flex justify-between mb-2 items-center">
                            <span>مالیات:</span>
                            <input
                                type="number"
                                name="tax"
                                value={formData.tax}
                                onChange={handleChange}
                                className="w-32 border rounded px-2 py-1 text-left"
                            />
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                            <span>جمع کل:</span>
                            <span>{total.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between mb-2 items-center mt-4">
                            <span>مبلغ پرداخت شده:</span>
                            <input
                                type="number"
                                name="paid_amount"
                                value={formData.paid_amount}
                                onChange={handleChange}
                                className="w-32 border rounded px-2 py-1 text-left"
                            />
                        </div>
                        <div className="flex justify-between text-lg">
                            <span>مانده:</span>
                            <span className={balance > 0 ? 'text-red-600' : 'text-green-600'}>
                                {balance.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {loading ? 'در حال ذخیره...' : 'ذخیره فاکتور'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard/sales/invoices')}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300"
                    >
                        انصراف
                    </button>
                </div>
            </form>
        </div>
    );
}
