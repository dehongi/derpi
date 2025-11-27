'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HrIndexPage() {
    const router = useRouter();

    useEffect(() => {
        router.push('/dashboard/hr/departments');
    }, [router]);

    return null;
}
