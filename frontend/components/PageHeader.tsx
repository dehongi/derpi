import React from 'react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
    return (
        <div className="mb-6 flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
                {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}
