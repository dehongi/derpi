'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AccountingIndexPage() {
    const router = useRouter();

    useEffect(() => {
        router.push('/dashboard/accounting/chart-of-accountss');
    }, [router]);

    return null;
}
