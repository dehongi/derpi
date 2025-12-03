'use client';

import React, { useMemo } from 'react';
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/colors/green.css";
import { jalaliToGregorian, gregorianToJalali } from '@/utils/dateUtils';

interface JalaliDatePickerProps {
    value: string; // Gregorian date in YYYY-MM-DD format
    onChange: (date: string) => void; // Returns Gregorian date in YYYY-MM-DD format
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    required?: boolean;
    label?: string;
    inputClass?: string;
}

export default function JalaliDatePicker({
    value,
    onChange,
    placeholder = "تاریخ را انتخاب کنید",
    disabled = false,
    className = "",
    required = false,
    label,
    inputClass = ""
}: JalaliDatePickerProps) {
    // Convert Gregorian value to Jalali DateObject for display
    // Using useMemo to ensure the DateObject is properly memoized
    const dateObject = useMemo(() => {
        if (!value) return null;

        try {
            // Create a DateObject from Gregorian date and convert to Jalali
            const gregorianDate = new DateObject({
                date: value,
                format: "YYYY-MM-DD"
            });
            return gregorianDate.convert(persian, persian_fa);
        } catch (error) {
            console.error('Error creating date object:', error);
            return null;
        }
    }, [value]);

    const handleChange = (date: DateObject | DateObject[] | null) => {
        if (!date || Array.isArray(date)) {
            onChange('');
            return;
        }

        try {
            // Convert Jalali DateObject back to Gregorian YYYY-MM-DD string
            const gregorianDate = date.convert(undefined, undefined);
            const formattedDate = gregorianDate.format("YYYY-MM-DD");
            onChange(formattedDate);
        } catch (error) {
            console.error('Error converting date:', error);
            onChange('');
        }
    };

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {required && <span className="text-red-500 mr-1">*</span>}
                </label>
            )}
            <DatePicker
                key={value} // Force re-render when value changes
                value={dateObject}
                onChange={handleChange}
                calendar={persian}
                locale={persian_fa}
                format="YYYY/MM/DD"
                placeholder={placeholder}
                disabled={disabled}
                className="green"
                containerClassName="w-full"
                inputClass={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${inputClass} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                style={{
                    width: '100%',
                    height: '100%'
                }}
                calendarPosition="bottom-right"
            />
        </div>
    );
}

interface JalaliDateDisplayProps {
    date: string; // Gregorian date in YYYY-MM-DD format
    className?: string;
    format?: 'short' | 'long'; // short: YYYY/MM/DD, long: DD MMMM YYYY
}

/**
 * Component to display a Gregorian date in Jalali format
 */
export function JalaliDateDisplay({ date, className = "", format = 'short' }: JalaliDateDisplayProps) {
    if (!date) return <span className={className}>-</span>;

    try {
        const gregorianDate = new DateObject({
            date: date,
            format: "YYYY-MM-DD"
        });

        const jalaliDate = gregorianDate.convert(persian, persian_fa);
        const formatted = format === 'long'
            ? jalaliDate.format("DD MMMM YYYY")
            : jalaliDate.format("YYYY/MM/DD");

        return <span className={className}>{formatted}</span>;
    } catch (error) {
        console.error('Error displaying Jalali date:', error);
        return <span className={className}>{date}</span>;
    }
}
