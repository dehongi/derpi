'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WebsiteIndexPage() {
    const router = useRouter();

    useEffect(() => {
        router.push('/dashboard/website/pages');
    }, [router]);

    return null;
}
