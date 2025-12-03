import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

/**
 * Convert Gregorian date string (YYYY-MM-DD) to Jalali date string
 * @param gregorianDate - Date in YYYY-MM-DD format (e.g., "2024-03-15")
 * @returns Jalali date string in YYYY/MM/DD format (e.g., "1403/12/25")
 */
export function gregorianToJalali(gregorianDate: string): string {
    if (!gregorianDate) return '';

    try {
        const date = new DateObject({
            date: gregorianDate,
            format: "YYYY-MM-DD"
        });

        const jalaliDate = date.convert(persian, persian_fa);
        return jalaliDate.format("YYYY/MM/DD");
    } catch (error) {
        console.error('Error converting Gregorian to Jalali:', error);
        return gregorianDate;
    }
}

/**
 * Convert Jalali date string to Gregorian date string (YYYY-MM-DD)
 * @param jalaliDate - Date in YYYY/MM/DD format (e.g., "1403/12/25")
 * @returns Gregorian date string in YYYY-MM-DD format (e.g., "2024-03-15")
 */
export function jalaliToGregorian(jalaliDate: string): string {
    if (!jalaliDate) return '';

    try {
        const date = new DateObject({
            date: jalaliDate,
            calendar: persian,
            locale: persian_fa,
            format: "YYYY/MM/DD"
        });

        return date.format("YYYY-MM-DD");
    } catch (error) {
        console.error('Error converting Jalali to Gregorian:', error);
        return jalaliDate;
    }
}

/**
 * Format Gregorian date to Persian display format
 * @param gregorianDate - Date in YYYY-MM-DD format
 * @returns Formatted Persian date (e.g., "۲۵ اسفند ۱۴۰۳")
 */
export function formatJalaliDate(gregorianDate: string): string {
    if (!gregorianDate) return '';

    try {
        const date = new DateObject({
            date: gregorianDate,
            format: "YYYY-MM-DD"
        });

        const jalaliDate = date.convert(persian, persian_fa);
        return jalaliDate.format("DD MMMM YYYY");
    } catch (error) {
        console.error('Error formatting Jalali date:', error);
        return gregorianDate;
    }
}

/**
 * Get current date in Jalali format
 * @returns Current Jalali date string in YYYY/MM/DD format
 */
export function getCurrentJalaliDate(): string {
    const date = new DateObject({ calendar: persian, locale: persian_fa });
    return date.format("YYYY/MM/DD");
}

/**
 * Get current date in Gregorian format (YYYY-MM-DD)
 * @returns Current Gregorian date string
 */
export function getCurrentGregorianDate(): string {
    const date = new Date();
    return date.toISOString().split('T')[0];
}

/**
 * Convert DateTime to Jalali format
 * @param datetime - DateTime string in ISO format
 * @returns Formatted Jalali datetime string
 */
export function formatJalaliDateTime(datetime: string): string {
    if (!datetime) return '';

    try {
        const date = new DateObject({
            date: datetime,
            format: "YYYY-MM-DD HH:mm:ss"
        });

        const jalaliDate = date.convert(persian, persian_fa);
        return jalaliDate.format("DD MMMM YYYY - HH:mm");
    } catch (error) {
        console.error('Error formatting Jalali datetime:', error);
        return datetime;
    }
}

/**
 * Convert Jalali date object to Gregorian date string for API
 * @param dateObject - DateObject instance
 * @returns Gregorian date string in YYYY-MM-DD format
 */
export function dateObjectToGregorian(dateObject: DateObject): string {
    if (!dateObject) return '';
    return dateObject.format("YYYY-MM-DD");
}
