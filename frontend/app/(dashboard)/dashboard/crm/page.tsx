'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CrmIndexPage() {
    const router = useRouter();

    useEffect(() => {
        router.push('/dashboard/crm/leads');
    }, [router]);

    return null;
}
