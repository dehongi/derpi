import React from 'react';

interface ProductCardProps {
    product: {
        id: number;
        name: string;
        sku: string;
        barcode?: string;
        sale_price: number;
        unit: string;
    };
    onAddToCart: (product: any) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
    return (
        <div
            onClick={() => onAddToCart(product)}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
        >
            <div className="flex flex-col h-full">
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">کد: {product.sku}</p>
                    {product.barcode && (
                        <p className="text-xs text-gray-400 mb-2">بارکد: {product.barcode}</p>
                    )}
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t">
                    <span className="text-lg font-bold text-blue-600">
                        {product.sale_price.toLocaleString('fa-IR')} ریال
                    </span>
                    <span className="text-xs text-gray-500">{product.unit}</span>
                </div>
            </div>
        </div>
    );
}
