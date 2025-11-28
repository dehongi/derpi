import React from 'react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
    return (
        <div className="mb-8 flex justify-between items-start">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">{title}</h1>
                {subtitle && <p className="text-gray-600">{subtitle}</p>}
            </div>
            {action && <div className="flex-shrink-0">{action}</div>}
        </div>
    );
}
