'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EcommerceIndexPage() {
    const router = useRouter();

    useEffect(() => {
        router.push('/dashboard/ecommerce/products');
    }, [router]);

    return null;
}
