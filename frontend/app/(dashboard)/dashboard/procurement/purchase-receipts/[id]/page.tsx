'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import { JalaliDateDisplay } from '@/components/JalaliDatePicker';
import api from '@/utils/api';

export default function PurchaseReceiptDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id;

    const [receipt, setReceipt] = useState<any>(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [poItems, setPoItems] = useState<any[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newItem, setNewItem] = useState({
        po_item: '',
        quantity_received: '',
        notes: ''
    });

    const fetchReceipt = useCallback(async () => {
        try {
            const response = await api.get(`/procurement/purchase-receipts/${id}/`);
            setReceipt(response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching receipt:', error);
            return null;
        }
    }, [id]);

    const fetchItems = useCallback(async () => {
        try {
            // TODO: Backend should support filtering by receipt
            const response = await api.get('/procurement/purchase-receipt-items/');
            // Filter client-side for now if backend doesn't support it
            const receiptItems = response.data.filter((item: any) => item.receipt === parseInt(id as string));
            setItems(receiptItems);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    }, [id]);

    const fetchPoItems = useCallback(async (poId: number) => {
        try {
            // TODO: Backend should support filtering by PO
            const response = await api.get('/procurement/purchase-order-items/');
            const items = response.data.filter((item: any) => item.purchase_order === poId);
            setPoItems(items);
        } catch (error) {
            console.error('Error fetching PO items:', error);
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const receiptData = await fetchReceipt();
            if (receiptData) {
                await fetchItems();
                if (receiptData.purchase_order) {
                    await fetchPoItems(receiptData.purchase_order);
                }
            }
            setLoading(false);
        };
        loadData();
    }, [fetchReceipt, fetchItems, fetchPoItems]);

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/procurement/purchase-receipt-items/', {
                ...newItem,
                receipt: id
            });
            setShowAddModal(false);
            setNewItem({ po_item: '', quantity_received: '', notes: '' });
            fetchItems();
        } catch (error) {
            console.error('Error adding item:', error);
            alert('خطا در افزودن آیتم');
        }
    };

    const handleDeleteItem = async (item: any) => {
        if (confirm('آیا از حذف این آیتم اطمینان دارید؟')) {
            try {
                await api.delete(`/procurement/purchase-receipt-items/${item.id}/`);
                fetchItems();
            } catch (error) {
                console.error('Error deleting item:', error);
            }
        }
    };

    const columns = [
        { key: 'id', label: 'شناسه' },
        {
            key: 'po_item', label: 'آیتم سفارش', render: (value: any) => {
                const poItem = poItems.find(i => i.id === value);
                return poItem ? `Item #${poItem.item} (Qty: ${poItem.quantity})` : value;
            }
        },
        { key: 'quantity_received', label: 'تعداد دریافت شده' },
        { key: 'notes', label: 'یادداشت' },
    ];

    if (loading) return <div>در حال بارگذاری...</div>;
    if (!receipt) return <div>رسید یافت نشد</div>;

    return (
        <div>
            <PageHeader
                title={`رسید خرید ${receipt.receipt_number}`}
                subtitle={`تاریخ: ${receipt.date}`}
                action={
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        افزودن آیتم
                    </button>
                }
            />

            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <span className="block text-sm text-gray-500">شماره سفارش خرید</span>
                        <span className="font-medium">{receipt.purchase_order}</span>
                    </div>
                    <div>
                        <span className="block text-sm text-gray-500">تاریخ</span>
                        <span className="font-medium"><JalaliDateDisplay date={receipt.date} /></span>
                    </div>
                    <div>
                        <span className="block text-sm text-gray-500">یادداشت‌ها</span>
                        <span className="font-medium">{receipt.notes || '-'}</span>
                    </div>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={items}
                onDelete={handleDeleteItem}
            />

            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-bold mb-4">افزودن آیتم به رسید</h3>
                        <form onSubmit={handleAddItem} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    آیتم سفارش
                                </label>
                                <select
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                                    value={newItem.po_item}
                                    onChange={(e) => setNewItem({ ...newItem, po_item: e.target.value })}
                                >
                                    <option value="">انتخاب کنید...</option>
                                    {poItems.map((item: any) => (
                                        <option key={item.id} value={item.id}>
                                            Item #{item.item} - Qty: {item.quantity} - Price: {item.unit_price}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    تعداد دریافت شده
                                </label>
                                <input
                                    type="number"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                                    value={newItem.quantity_received}
                                    onChange={(e) => setNewItem({ ...newItem, quantity_received: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    یادداشت
                                </label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                                    value={newItem.notes}
                                    onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
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
