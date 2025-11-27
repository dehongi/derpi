'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProcurementIndexPage() {
    const router = useRouter();

    useEffect(() => {
        router.push('/dashboard/procurement/suppliers');
    }, [router]);

    return null;
}
