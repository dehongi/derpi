import React from 'react';

interface CartItemProps {
    item: {
        id: number;
        name: string;
        sku: string;
        sale_price: number;
        quantity: number;
        discount: number;
        unit: string;
    };
    onUpdateQuantity: (id: number, quantity: number) => void;
    onUpdateDiscount: (id: number, discount: number) => void;
    onRemove: (id: number) => void;
}

export default function CartItem({ item, onUpdateQuantity, onUpdateDiscount, onRemove }: CartItemProps) {
    const subtotal = item.sale_price * item.quantity;
    const total = subtotal - item.discount;

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 mb-2">
            <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                    <p className="text-xs text-gray-500">کد: {item.sku}</p>
                </div>
                <button
                    onClick={() => onRemove(item.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                >
                    حذف
                </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                    <label className="text-xs text-gray-600">تعداد</label>
                    <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={item.quantity}
                        onChange={(e) => onUpdateQuantity(item.id, parseFloat(e.target.value) || 0)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-600">تخفیف (ریال)</label>
                    <input
                        type="number"
                        min="0"
                        value={item.discount}
                        onChange={(e) => onUpdateDiscount(item.id, parseFloat(e.target.value) || 0)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                </div>
            </div>

            <div className="flex items-center justify-between text-sm pt-2 border-t">
                <span className="text-gray-600">
                    {item.sale_price.toLocaleString('fa-IR')} × {item.quantity} {item.unit}
                </span>
                <span className="font-bold text-blue-600">
                    {total.toLocaleString('fa-IR')} ریال
                </span>
            </div>
        </div>
    );
}
