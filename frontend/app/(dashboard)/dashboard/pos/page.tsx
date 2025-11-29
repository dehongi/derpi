'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import ProductCard from '@/components/pos/ProductCard';
import CartItem from '@/components/pos/CartItem';
import PaymentPanel from '@/components/pos/PaymentPanel';
import Receipt from '@/components/pos/Receipt';
import api from '@/utils/api';

interface Product {
    id: number;
    name: string;
    sku: string;
    barcode?: string;
    sale_price: number;
    unit: string;
}

interface CartItemType {
    id: number;
    name: string;
    sku: string;
    sale_price: number;
    quantity: number;
    discount: number;
    unit: string;
}

export default function POSPage() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItemType[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [paidAmount, setPaidAmount] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [tax, setTax] = useState(0);
    const [notes, setNotes] = useState('');
    const [showReceipt, setShowReceipt] = useState(false);
    const [lastSale, setLastSale] = useState<any>(null);
    const [customerId, setCustomerId] = useState<number | null>(null);
    const [customers, setCustomers] = useState<any[]>([]);

    useEffect(() => {
        fetchProducts();
        fetchCustomers();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/inventory/items/');
            setProducts(response.data.filter((p: Product) => p.sale_price > 0));
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCustomers = async () => {
        try {
            const response = await api.get('/contacts/?contact_type=customer');
            setCustomers(response.data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const addToCart = (product: Product) => {
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            setCart(cart.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, {
                id: product.id,
                name: product.name,
                sku: product.sku,
                sale_price: product.sale_price,
                quantity: 1,
                discount: 0,
                unit: product.unit
            }]);
        }
    };

    const updateQuantity = (id: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(id);
        } else {
            setCart(cart.map(item =>
                item.id === id ? { ...item, quantity } : item
            ));
        }
    };

    const updateDiscount = (id: number, discount: number) => {
        setCart(cart.map(item =>
            item.id === id ? { ...item, discount } : item
        ));
    };

    const removeFromCart = (id: number) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const clearCart = () => {
        setCart([]);
        setDiscount(0);
        setTax(0);
        setNotes('');
        setPaidAmount(0);
        setCustomerId(null);
    };

    const calculateSubtotal = () => {
        return cart.reduce((sum, item) => {
            return sum + (item.sale_price * item.quantity - item.discount);
        }, 0);
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        return subtotal - discount + tax;
    };

    const completeSale = async () => {
        if (cart.length === 0) {
            alert('سبد خرید خالی است');
            return;
        }

        const total = calculateTotal();

        if (paymentMethod === 'cash' && paidAmount < total) {
            alert('مبلغ پرداختی کافی نیست');
            return;
        }

        try {
            const saleData = {
                date: new Date().toISOString(),
                customer: customerId,
                discount: discount,
                tax: tax,
                paid_amount: paymentMethod === 'cash' ? paidAmount : total,
                payment_method: paymentMethod,
                notes: notes,
                items: cart.map(item => ({
                    item: item.id,
                    quantity: item.quantity,
                    unit_price: item.sale_price,
                    discount: item.discount
                }))
            };

            const response = await api.post('/pos/sales/', saleData);

            // Fetch full sale details for receipt
            const saleDetail = await api.get(`/pos/sales/${response.data.id}/`);
            setLastSale(saleDetail.data);
            setShowReceipt(true);
            clearCart();
        } catch (error: any) {
            console.error('Error completing sale:', error);
            alert(error.response?.data?.detail || 'خطا در ثبت فروش');
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.barcode && product.barcode.includes(searchTerm))
    );

    if (showReceipt && lastSale) {
        return (
            <div>
                <PageHeader
                    title="رسید فروش"
                    subtitle="فروش با موفقیت ثبت شد"
                    action={
                        <button
                            onClick={() => {
                                setShowReceipt(false);
                                setLastSale(null);
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            فروش جدید
                        </button>
                    }
                />
                <Receipt sale={lastSale} />
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                title="صندوق فروش (POS)"
                subtitle="سیستم فروش نقطه‌ای"
                action={
                    <button
                        onClick={() => router.push('/dashboard/pos/sales')}
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                        تاریخچه فروش
                    </button>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Products Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow p-4 mb-4">
                        <input
                            type="text"
                            placeholder="جستجو محصول (نام، کد، بارکد)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border border-gray-300 rounded px-4 py-2"
                            autoFocus
                        />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {loading ? (
                            <div className="col-span-full text-center py-8">در حال بارگذاری...</div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="col-span-full text-center py-8 text-gray-500">
                                محصولی یافت نشد
                            </div>
                        ) : (
                            filteredProducts.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAddToCart={addToCart}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* Cart and Payment Section */}
                <div className="lg:col-span-1">
                    <div className="sticky top-4 space-y-4">
                        {/* Customer Selection */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <label className="block text-sm text-gray-700 mb-2">مشتری</label>
                            <select
                                value={customerId || ''}
                                onChange={(e) => setCustomerId(e.target.value ? parseInt(e.target.value) : null)}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                            >
                                <option value="">مشتری عمومی</option>
                                {customers.map(customer => (
                                    <option key={customer.id} value={customer.id}>
                                        {customer.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Cart */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-gray-900">سبد خرید</h3>
                                {cart.length > 0 && (
                                    <button
                                        onClick={clearCart}
                                        className="text-sm text-red-500 hover:text-red-700"
                                    >
                                        پاک کردن
                                    </button>
                                )}
                            </div>

                            <div className="max-h-64 overflow-y-auto mb-3">
                                {cart.length === 0 ? (
                                    <p className="text-center text-gray-500 py-4">سبد خرید خالی است</p>
                                ) : (
                                    cart.map(item => (
                                        <CartItem
                                            key={item.id}
                                            item={item}
                                            onUpdateQuantity={updateQuantity}
                                            onUpdateDiscount={updateDiscount}
                                            onRemove={removeFromCart}
                                        />
                                    ))
                                )}
                            </div>

                            {/* Additional Charges */}
                            {cart.length > 0 && (
                                <div className="border-t pt-3 space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">جمع جزء:</span>
                                        <span className="font-semibold">
                                            {calculateSubtotal().toLocaleString('fa-IR')} ریال
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <label className="text-sm text-gray-600">تخفیف کل:</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={discount}
                                            onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                                            className="w-32 border border-gray-300 rounded px-2 py-1 text-sm"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <label className="text-sm text-gray-600">مالیات:</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={tax}
                                            onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                                            className="w-32 border border-gray-300 rounded px-2 py-1 text-sm"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between text-lg font-bold pt-2 border-t">
                                        <span>جمع کل:</span>
                                        <span className="text-blue-600">
                                            {calculateTotal().toLocaleString('fa-IR')} ریال
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Payment Panel */}
                        {cart.length > 0 && (
                            <>
                                <PaymentPanel
                                    total={calculateTotal()}
                                    onPaymentMethodChange={setPaymentMethod}
                                    onPaidAmountChange={setPaidAmount}
                                    paymentMethod={paymentMethod}
                                    paidAmount={paidAmount}
                                />

                                {/* Notes */}
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <label className="block text-sm text-gray-700 mb-2">یادداشت</label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                        rows={2}
                                        placeholder="یادداشت اختیاری..."
                                    />
                                </div>

                                {/* Complete Sale Button */}
                                <button
                                    onClick={completeSale}
                                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold text-lg"
                                >
                                    تکمیل فروش
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
