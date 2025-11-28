import React from 'react';

interface ReceiptProps {
    sale: {
        sale_number: string;
        date: string;
        cashier: string;
        customer?: string;
        items: Array<{
            name: string;
            quantity: number;
            unit_price: number;
            discount: number;
            total: number;
        }>;
        subtotal: number;
        discount: number;
        tax: number;
        total: number;
        paid_amount: number;
        change_amount: number;
        payment_method: string;
        notes?: string;
    };
}

export default function Receipt({ sale }: ReceiptProps) {
    const printReceipt = () => {
        window.print();
    };

    return (
        <div className="bg-white p-6 max-w-md mx-auto">
            <div className="text-center mb-4 print:mb-2">
                <h2 className="text-xl font-bold">رسید فروش</h2>
                <p className="text-sm text-gray-600">شماره: {sale.sale_number}</p>
            </div>

            <div className="border-t border-b border-gray-300 py-2 mb-4 text-sm">
                <div className="flex justify-between mb-1">
                    <span className="text-gray-600">تاریخ:</span>
                    <span>{new Date(sale.date).toLocaleDateString('fa-IR')}</span>
                </div>
                <div className="flex justify-between mb-1">
                    <span className="text-gray-600">صندوقدار:</span>
                    <span>{sale.cashier}</span>
                </div>
                {sale.customer && (
                    <div className="flex justify-between">
                        <span className="text-gray-600">مشتری:</span>
                        <span>{sale.customer}</span>
                    </div>
                )}
            </div>

            <div className="mb-4">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b">
                            <th className="text-right py-1">کالا</th>
                            <th className="text-center py-1">تعداد</th>
                            <th className="text-right py-1">قیمت</th>
                            <th className="text-right py-1">جمع</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sale.items.map((item, index) => (
                            <tr key={index} className="border-b">
                                <td className="py-2">{item.name}</td>
                                <td className="text-center">{item.quantity}</td>
                                <td className="text-right">{item.unit_price.toLocaleString('fa-IR')}</td>
                                <td className="text-right">{item.total.toLocaleString('fa-IR')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="border-t border-gray-300 pt-2 mb-4 text-sm">
                <div className="flex justify-between mb-1">
                    <span className="text-gray-600">جمع جزء:</span>
                    <span>{sale.subtotal.toLocaleString('fa-IR')} ریال</span>
                </div>
                {sale.discount > 0 && (
                    <div className="flex justify-between mb-1 text-red-600">
                        <span>تخفیف:</span>
                        <span>-{sale.discount.toLocaleString('fa-IR')} ریال</span>
                    </div>
                )}
                {sale.tax > 0 && (
                    <div className="flex justify-between mb-1">
                        <span className="text-gray-600">مالیات:</span>
                        <span>{sale.tax.toLocaleString('fa-IR')} ریال</span>
                    </div>
                )}
                <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                    <span>جمع کل:</span>
                    <span>{sale.total.toLocaleString('fa-IR')} ریال</span>
                </div>
            </div>

            <div className="border-t border-gray-300 pt-2 mb-4 text-sm">
                <div className="flex justify-between mb-1">
                    <span className="text-gray-600">روش پرداخت:</span>
                    <span>{sale.payment_method}</span>
                </div>
                {sale.paid_amount > 0 && (
                    <>
                        <div className="flex justify-between mb-1">
                            <span className="text-gray-600">مبلغ پرداختی:</span>
                            <span>{sale.paid_amount.toLocaleString('fa-IR')} ریال</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">مبلغ برگشتی:</span>
                            <span>{sale.change_amount.toLocaleString('fa-IR')} ریال</span>
                        </div>
                    </>
                )}
            </div>

            {sale.notes && (
                <div className="text-xs text-gray-600 mb-4">
                    <p>یادداشت: {sale.notes}</p>
                </div>
            )}

            <div className="text-center text-xs text-gray-500 mt-4 print:hidden">
                <button
                    onClick={printReceipt}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    چاپ رسید
                </button>
            </div>
        </div>
    );
}
