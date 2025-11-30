"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/utils/api";
import { useRouter } from "next/navigation";

interface Product {
    id: number;
    name: string;
    sku: string;
    price: string;
    stock_quantity: number;
    is_active: boolean;
    category_name: string;
}

export default function EcommercePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get("/ecommerce/products/");
            const data = response.data;
            setProducts(data.results || data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">مدیریت محصولات</h1>
                    <p className="text-gray-500">لیست محصولات فروشگاه شما</p>
                </div>
                <Link href="/dashboard/ecommerce/create" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                    <span>+</span> افزودن محصول جدید
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">نام محصول</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">کد (SKU)</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">دسته‌بندی</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">قیمت</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">موجودی</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">وضعیت</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">عملیات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        در حال بارگذاری...
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        هیچ محصولی یافت نشد.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                                        <td className="px-6 py-4 text-gray-600 font-mono text-sm">{product.sku}</td>
                                        <td className="px-6 py-4 text-gray-600">{product.category_name || "-"}</td>
                                        <td className="px-6 py-4 text-gray-900 font-medium">{Number(product.price).toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock_quantity > 10 ? 'bg-green-100 text-green-700' :
                                                product.stock_quantity > 0 ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                {product.stock_quantity} عدد
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {product.is_active ? 'فعال' : 'غیرفعال'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Link href={`/dashboard/ecommerce/${product.id}`} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                                                    ویرایش
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
