"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

export default function CreateContactPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        mobile: "",
        address: "",
        city: "",
        postal_code: "",
        country: "ایران",
        company_name: "",
        position: "",
        website: "",
        contact_type: "customer",
        notes: "",
        is_active: true,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/contacts/', formData);
            alert("مخاطب با موفقیت ثبت شد");
            router.push("/dashboard/contacts");
        } catch (error) {
            console.error("Failed to create contact", error);
            alert("ثبت مخاطب با خطا مواجه شد");
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">افزودن مخاطب جدید</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">اطلاعات پایه</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 mb-2">نام *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">ایمیل</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">تلفن</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">موبایل</label>
                            <input
                                type="text"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            />
                        </div>
                    </div>
                </div>

                {/* Address Information */}
                <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">اطلاعات آدرس</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-gray-700 mb-2">آدرس</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                rows={3}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">شهر</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">کد پستی</label>
                            <input
                                type="text"
                                name="postal_code"
                                value={formData.postal_code}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">کشور</label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            />
                        </div>
                    </div>
                </div>

                {/* Business Information */}
                <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">اطلاعات شغلی</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 mb-2">نام شرکت</label>
                            <input
                                type="text"
                                name="company_name"
                                value={formData.company_name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">سمت</label>
                            <input
                                type="text"
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">وب‌سایت</label>
                            <input
                                type="url"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">نوع مخاطب</label>
                            <select
                                name="contact_type"
                                value={formData.contact_type}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            >
                                <option value="customer">مشتری</option>
                                <option value="supplier">تامین‌کننده</option>
                                <option value="partner">شریک تجاری</option>
                                <option value="other">سایر</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Additional Information */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">اطلاعات تکمیلی</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 mb-2">یادداشت‌ها</label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                rows={4}
                            />
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleChange}
                                className="ml-2"
                                id="is_active"
                            />
                            <label htmlFor="is_active" className="text-gray-700">مخاطب فعال است</label>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                        ذخیره مخاطب
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard/contacts')}
                        className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                    >
                        انصراف
                    </button>
                </div>
            </form>
        </div>
    );
}
