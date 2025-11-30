"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Product {
    id: number;
    name: string;
    price: string;
    description: string;
    images: string[];
    company_name: string;
    category_name: string;
}

export default function MarketplacePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            // Public endpoint, no auth needed
            const response = await fetch("http://localhost:8000/api/ecommerce/marketplace/products/");
            if (response.ok) {
                const data = await response.json();
                setProducts(data.results || data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4 gradient-text">بازارچه محصولات</h1>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    بهترین محصولات از برترین شرکت‌ها را در اینجا پیدا کنید. تنوع، کیفیت و قیمت مناسب.
                </p>
            </div>

            <div className="flex justify-center mb-12">
                <div className="w-full max-w-2xl relative">
                    <input
                        type="text"
                        placeholder="جستجو در محصولات..."
                        className="w-full px-6 py-4 rounded-full border border-gray-200 shadow-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
                    <p className="mt-6 text-gray-500 text-lg">در حال بارگذاری محصولات...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredProducts.map((product) => (
                        <Link href={`/marketplace/${product.id}`} key={product.id} className="group">
                            <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col hover:-translate-y-1">
                                <div className="aspect-square bg-gray-50 relative overflow-hidden">
                                    {product.images && product.images.length > 0 ? (
                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <span className="text-5xl">🖼️</span>
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-sm">
                                        {product.category_name}
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="text-xs font-bold text-purple-600 mb-2 uppercase tracking-wider">{product.company_name}</div>
                                    <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
                                        {product.name}
                                    </h3>
                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                                        <span className="text-xl font-bold text-gray-900">
                                            {Number(product.price).toLocaleString()} <span className="text-sm font-normal text-gray-500">تومان</span>
                                        </span>
                                        <span className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
                                            →
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
