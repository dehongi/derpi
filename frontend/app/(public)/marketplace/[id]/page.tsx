"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Product {
    id: number;
    name: string;
    price: string;
    description: string;
    images: string[];
    company_name: string;
    category_name: string;
    stock_quantity: number;
    sku: string;
}

export default function ProductDetailPage() {
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetchProduct(params.id as string);
        }
    }, [params.id]);

    const fetchProduct = async (id: string) => {
        try {
            // Public endpoint, no auth needed
            const response = await fetch(`http://localhost:8000/api/ecommerce/marketplace/products/${id}/`);
            if (response.ok) {
                const data = await response.json();
                setProduct(data);
            }
        } catch (error) {
            console.error("Error fetching product:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center py-20">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">محصول یافت نشد</h2>
                <Link href="/marketplace" className="text-purple-600 hover:text-purple-800 font-medium inline-flex items-center gap-2">
                    <span>←</span> بازگشت به بازارچه
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-8">
                <Link href="/marketplace" className="text-gray-500 hover:text-gray-900 flex items-center gap-2 transition-colors">
                    <span>←</span> بازگشت به لیست محصولات
                </Link>
            </div>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    {/* Image Section */}
                    <div className="bg-gray-50 p-12 flex items-center justify-center min-h-[500px] relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50"></div>
                        <div className="relative z-10 w-full h-full flex items-center justify-center">
                            {product.images && product.images.length > 0 ? (
                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="max-w-full max-h-[500px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="text-gray-300 text-center">
                                    <span className="text-8xl block mb-4">🖼️</span>
                                    <span className="text-xl font-medium">تصویر موجود نیست</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="p-10 lg:p-14 flex flex-col">
                        <div className="mb-auto">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-sm font-bold">
                                    {product.category_name}
                                </span>
                                <span className="text-gray-500 text-sm font-medium">
                                    فروشنده: <span className="text-gray-900">{product.company_name}</span>
                                </span>
                            </div>

                            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">{product.name}</h1>

                            <div className="prose prose-lg text-gray-600 mb-10 leading-relaxed">
                                <p>{product.description || "توضیحاتی برای این محصول ثبت نشده است."}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-10">
                                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                                    <div className="text-sm text-gray-500 mb-2">کد محصول (SKU)</div>
                                    <div className="font-mono font-bold text-gray-800 text-lg">{product.sku}</div>
                                </div>
                                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                                    <div className="text-sm text-gray-500 mb-2">وضعیت موجودی</div>
                                    <div className="font-bold text-lg">
                                        {product.stock_quantity > 0 ? (
                                            <span className="text-green-600 flex items-center gap-2">
                                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                {product.stock_quantity} عدد در انبار
                                            </span>
                                        ) : (
                                            <span className="text-red-500 flex items-center gap-2">
                                                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                                ناموجود
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-8 mt-8">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
                                <span className="text-gray-500 text-lg">قیمت نهایی</span>
                                <span className="text-4xl font-bold text-gray-900">
                                    {Number(product.price).toLocaleString()} <span className="text-xl text-gray-500 font-normal">تومان</span>
                                </span>
                            </div>

                            <button
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-5 px-8 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3 text-lg"
                                disabled={product.stock_quantity <= 0}
                            >
                                {product.stock_quantity > 0 ? (
                                    <>
                                        <span>🛒</span>
                                        افزودن به سبد خرید
                                    </>
                                ) : (
                                    "ناموجود"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
