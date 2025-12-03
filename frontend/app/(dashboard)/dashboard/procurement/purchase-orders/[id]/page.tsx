'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import JalaliDatePicker from '@/components/JalaliDatePicker';
import api from '@/utils/api';

import DataTable from '@/components/DataTable';

export default function EditPurchaseOrderPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState<any>({
        po_number: '',
        supplier: '',
        date: '',
        expected_delivery_date: '',
        status: 'draft',
        notes: '',
        subtotal: 0,
        tax: 0,
        shipping: 0,
        total: 0
    });
    const [suppliers, setSuppliers] = useState([]);
    const [items, setItems] = useState([]);
    const [inventoryItems, setInventoryItems] = useState<any[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newItem, setNewItem] = useState({
        item: '',
        quantity: 1,
        unit_price: 0,
        total: 0
    });

    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id]);

    const fetchData = async () => {
        try {
            const [poRes, suppliersRes, itemsRes, invItemsRes] = await Promise.all([
                api.get(`/procurement/purchase-orders/${id}/`),
                api.get('/procurement/suppliers/'),
                api.get('/procurement/purchase-order-items/'),
                api.get('/inventory/items/')
            ]);

            setFormData(poRes.data);
            setSuppliers(suppliersRes.data);
            // Filter items for this PO
            setItems(itemsRes.data.filter((item: any) => item.purchase_order === parseInt(id as string)));
            setInventoryItems(invItemsRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('خطا در بارگذاری اطلاعات');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => {
            const updated = { ...prev, [name]: value };
            // Recalculate total if tax or shipping changes
            if (name === 'tax' || name === 'shipping' || name === 'subtotal') {
                const subtotal = parseFloat(updated.subtotal) || 0;
                const tax = parseFloat(updated.tax) || 0;
                const shipping = parseFloat(updated.shipping) || 0;
                updated.total = subtotal + tax + shipping;
            }
            return updated;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            await api.put(`/procurement/purchase-orders/${id}/`, formData);
            setSuccess('تغییرات با موفقیت ذخیره شد');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'خطا در ذخیره تغییرات');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (confirm('آیا از حذف این مورد اطمینان دارید؟')) {
            try {
                await api.delete(`/procurement/purchase-orders/${id}/`);
                router.push('/dashboard/procurement/purchase-orders');
            } catch (error) {
                console.error('Error deleting item:', error);
                alert('خطا در حذف');
            }
        }
    };

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const total = newItem.quantity * newItem.unit_price;
            await api.post('/procurement/purchase-order-items/', {
                ...newItem,
                total,
                purchase_order: id
            });
            setShowAddModal(false);
            setNewItem({ item: '', quantity: 1, unit_price: 0, total: 0 });

            // Refresh items and recalculate subtotal
            const itemsRes = await api.get('/procurement/purchase-order-items/');
            const poItems = itemsRes.data.filter((item: any) => item.purchase_order === parseInt(id as string));
            setItems(poItems);

            const newSubtotal = poItems.reduce((sum: number, item: any) => sum + parseFloat(item.total), 0);
            setFormData((prev: any) => ({
                ...prev,
                subtotal: newSubtotal,
                total: newSubtotal + (parseFloat(prev.tax) || 0) + (parseFloat(prev.shipping) || 0)
            }));

            // Save the new totals
            await api.patch(`/procurement/purchase-orders/${id}/`, {
                subtotal: newSubtotal,
                total: newSubtotal + (parseFloat(formData.tax) || 0) + (parseFloat(formData.shipping) || 0)
            });

        } catch (error) {
            console.error('Error adding item:', error);
            alert('خطا در افزودن آیتم');
        }
    };

    const handleDeleteItem = async (itemId: number) => {
        if (confirm('آیا از حذف این آیتم اطمینان دارید؟')) {
            try {
                await api.delete(`/procurement/purchase-order-items/${itemId}/`);

                // Refresh items and recalculate
                const itemsRes = await api.get('/procurement/purchase-order-items/');
                const poItems = itemsRes.data.filter((item: any) => item.purchase_order === parseInt(id as string));
                setItems(poItems);

                const newSubtotal = poItems.reduce((sum: number, item: any) => sum + parseFloat(item.total), 0);
                setFormData((prev: any) => ({
                    ...prev,
                    subtotal: newSubtotal,
                    total: newSubtotal + (parseFloat(prev.tax) || 0) + (parseFloat(prev.shipping) || 0)
                }));

                await api.patch(`/procurement/purchase-orders/${id}/`, {
                    subtotal: newSubtotal,
                    total: newSubtotal + (parseFloat(formData.tax) || 0) + (parseFloat(formData.shipping) || 0)
                });

            } catch (error) {
                console.error('Error deleting item:', error);
            }
        }
    };

    const columns = [
        { key: 'item', label: 'کالا', render: (value: any) => inventoryItems.find((i: any) => i.id === value)?.name || value },
        { key: 'quantity', label: 'تعداد' },
        { key: 'unit_price', label: 'قیمت واحد', render: (value: number) => value?.toLocaleString('fa-IR') },
        { key: 'total', label: 'جمع', render: (value: number) => value?.toLocaleString('fa-IR') },
    ];

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
                title={`ویرایش سفارش خرید ${formData.po_number}`}
                subtitle="ویرایش اطلاعات و آیتم‌ها"
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

            <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            شماره سفارش
                        </label>
                        <input
                            type="text"
                            name="po_number"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
                            value={formData.po_number}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            تامین‌کننده
                        </label>
                        <select
                            name="supplier"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
                            value={formData.supplier}
                            onChange={handleChange}
                        >
                            <option value="">انتخاب کنید...</option>
                            {suppliers.map((supplier: any) => (
                                <option key={supplier.id} value={supplier.id}>
                                    {supplier.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <JalaliDatePicker
                            label="تاریخ"
                            value={formData.date}
                            onChange={(date) => setFormData((prev: any) => ({ ...prev, date }))}
                            required
                        />
                    </div>

                    <div>
                        <JalaliDatePicker
                            label="تاریخ تحویل مورد انتظار"
                            value={formData.expected_delivery_date || ''}
                            onChange={(date) => setFormData((prev: any) => ({ ...prev, expected_delivery_date: date }))}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            وضعیت
                        </label>
                        <select
                            name="status"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="draft">پیش‌نویس</option>
                            <option value="sent">ارسال شده</option>
                            <option value="confirmed">تایید شده</option>
                            <option value="received">دریافت شده</option>
                            <option value="cancelled">لغو شده</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            یادداشت‌ها
                        </label>
                        <textarea
                            name="notes"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
                            value={formData.notes || ''}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="mt-6 border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">اطلاعات مالی</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                جمع جزء
                            </label>
                            <input
                                type="number"
                                name="subtotal"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                value={formData.subtotal}
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                مالیات
                            </label>
                            <input
                                type="number"
                                name="tax"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
                                value={formData.tax}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                هزینه حمل
                            </label>
                            <input
                                type="number"
                                name="shipping"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
                                value={formData.shipping}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                جمع کل
                            </label>
                            <input
                                type="number"
                                name="total"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-bold"
                                value={formData.total}
                                readOnly
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex gap-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard/procurement/purchase-orders')}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300"
                    >
                        انصراف
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 mr-auto"
                    >
                        حذف
                    </button>
                </div>
            </form>

            <div className="bg-white rounded shadow p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">آیتم‌های سفارش</h3>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        افزودن آیتم
                    </button>
                </div>

                <DataTable
                    columns={columns}
                    data={items}
                    onDelete={(item: any) => handleDeleteItem(item.id)}
                />
            </div>

            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-bold mb-4">افزودن آیتم</h3>
                        <form onSubmit={handleAddItem} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    کالا
                                </label>
                                <select
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    value={newItem.item}
                                    onChange={(e) => setNewItem({ ...newItem, item: e.target.value })}
                                >
                                    <option value="">انتخاب کنید...</option>
                                    {inventoryItems.map((item: any) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name} (موجودی: {item.quantity})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    تعداد
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    value={newItem.quantity}
                                    onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    قیمت واحد
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    value={newItem.unit_price}
                                    onChange={(e) => setNewItem({ ...newItem, unit_price: parseFloat(e.target.value) })}
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md"
                                >
                                    انصراف
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-white bg-blue-600 rounded-md"
                                >
                                    افزودن
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
