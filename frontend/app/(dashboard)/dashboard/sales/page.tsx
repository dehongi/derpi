'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SalesIndexPage() {
    const router = useRouter();

    useEffect(() => {
        router.push('/dashboard/sales/quotations');
    }, [router]);

    return null;
}
