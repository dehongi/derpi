'use client';

import PageHeader from '@/components/PageHeader';
import ProductForm from '@/components/ProductForm';

export default function CreateProductPage() {
    return (
        <div>
            <PageHeader
                title="افزودن محصول جدید"
                subtitle="ایجاد محصول جدید در سیستم"
            />

            <ProductForm />
        </div>
    );
}
