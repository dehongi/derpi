'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function InventoryIndexPage() {
    const router = useRouter();

    useEffect(() => {
        router.push('/dashboard/inventory/items');
    }, [router]);

    return null;
}
