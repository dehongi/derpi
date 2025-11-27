import React from 'react';

interface Column {
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
    columns: Column[];
    data: any[];
    onEdit?: (row: any) => void;
    onDelete?: (row: any) => void;
    loading?: boolean;
}

export default function DataTable({ columns, data, onEdit, onDelete, loading }: DataTableProps) {
    if (loading) {
        return (
            <div className="bg-white rounded shadow p-8 text-center">
                <div className="text-gray-500">در حال بارگذاری...</div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="bg-white rounded shadow p-8 text-center">
                <div className="text-gray-500">داده‌ای یافت نشد</div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {column.label}
                            </th>
                        ))}
                        {(onEdit || onDelete) && (
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                عملیات
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                            {columns.map((column) => (
                                <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                                </td>
                            ))}
                            {(onEdit || onDelete) && (
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex gap-2">
                                        {onEdit && (
                                            <button
                                                onClick={() => onEdit(row)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                ویرایش
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button
                                                onClick={() => onDelete(row)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                حذف
                                            </button>
                                        )}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
