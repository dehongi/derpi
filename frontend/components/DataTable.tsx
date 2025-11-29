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
    customActions?: (row: any) => React.ReactNode;
}

export default function DataTable({ columns, data, onEdit, onDelete, loading, customActions }: DataTableProps) {
    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                <div className="text-gray-600 font-medium">در حال بارگذاری...</div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                    📭
                </div>
                <div className="text-gray-600 font-medium text-lg">داده‌ای یافت نشد</div>
                <p className="text-gray-500 text-sm mt-2">هنوز موردی ثبت نشده است</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider"
                                >
                                    {column.label}
                                </th>
                            ))}
                            {(onEdit || onDelete || customActions) && (
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    عملیات
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((row, index) => (
                            <tr key={index} className="hover:bg-gradient-to-r hover:from-purple-50/30 hover:to-pink-50/30 transition-all">
                                {columns.map((column) => (
                                    <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {column.render ? column.render(row[column.key], row) : row[column.key]}
                                    </td>
                                ))}
                                {(onEdit || onDelete || customActions) && (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex gap-3">
                                            {customActions && customActions(row)}
                                            {onEdit && (
                                                <button
                                                    onClick={() => onEdit(row)}
                                                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                                >
                                                    ویرایش
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    onClick={() => onDelete(row)}
                                                    className="text-red-600 hover:text-red-800 font-medium transition-colors"
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
        </div>
    );
}
