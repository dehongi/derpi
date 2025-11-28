import React, { useState, useEffect } from 'react';

interface PaymentPanelProps {
    total: number;
    onPaymentMethodChange: (method: string) => void;
    onPaidAmountChange: (amount: number) => void;
    paymentMethod: string;
    paidAmount: number;
}

export default function PaymentPanel({
    total,
    onPaymentMethodChange,
    onPaidAmountChange,
    paymentMethod,
    paidAmount
}: PaymentPanelProps) {
    const [change, setChange] = useState(0);

    useEffect(() => {
        if (paymentMethod === 'cash' && paidAmount > 0) {
            setChange(paidAmount - total);
        } else {
            setChange(0);
        }
    }, [paidAmount, total, paymentMethod]);

    const quickAmounts = [10000, 20000, 50000, 100000, 200000, 500000];

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">پرداخت</h3>

            {/* Payment Method Selection */}
            <div className="mb-4">
                <label className="block text-sm text-gray-700 mb-2">روش پرداخت</label>
                <div className="grid grid-cols-3 gap-2">
                    <button
                        onClick={() => onPaymentMethodChange('cash')}
                        className={`py-2 px-3 rounded border ${paymentMethod === 'cash'
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        نقدی
                    </button>
                    <button
                        onClick={() => onPaymentMethodChange('card')}
                        className={`py-2 px-3 rounded border ${paymentMethod === 'card'
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        کارت
                    </button>
                    <button
                        onClick={() => onPaymentMethodChange('transfer')}
                        className={`py-2 px-3 rounded border ${paymentMethod === 'transfer'
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        انتقال
                    </button>
                </div>
            </div>

            {/* Cash Payment Calculator */}
            {paymentMethod === 'cash' && (
                <div className="mb-4">
                    <label className="block text-sm text-gray-700 mb-2">مبلغ دریافتی</label>
                    <input
                        type="number"
                        value={paidAmount || ''}
                        onChange={(e) => onPaidAmountChange(parseFloat(e.target.value) || 0)}
                        className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
                        placeholder="مبلغ دریافتی را وارد کنید"
                    />

                    {/* Quick Amount Buttons */}
                    <div className="grid grid-cols-3 gap-2 mb-3">
                        {quickAmounts.map((amount) => (
                            <button
                                key={amount}
                                onClick={() => onPaidAmountChange(paidAmount + amount)}
                                className="py-1 px-2 text-sm bg-gray-100 hover:bg-gray-200 rounded border border-gray-300"
                            >
                                +{(amount / 1000).toLocaleString('fa-IR')}هزار
                            </button>
                        ))}
                    </div>

                    {/* Change Display */}
                    {paidAmount > 0 && (
                        <div className={`p-3 rounded ${change >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">مبلغ برگشتی:</span>
                                <span className={`font-bold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {change.toLocaleString('fa-IR')} ریال
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Total Display */}
            <div className="bg-blue-50 p-3 rounded">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">مبلغ قابل پرداخت:</span>
                    <span className="text-xl font-bold text-blue-600">
                        {total.toLocaleString('fa-IR')} ریال
                    </span>
                </div>
            </div>
        </div>
    );
}
