"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/utils/api";

export default function ContactDetailPage() {
    const router = useRouter();
    const params = useParams();
    const contactId = params.id;

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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchContact();
    }, [contactId]);

    const fetchContact = async () => {
        try {
            const response = await api.get(`/contacts/${contactId}/`);
            setFormData(response.data);
        } catch (error) {
            console.error("Failed to fetch contact", error);
            alert("بارگذاری اطلاعات مخاطب با خطا مواجه شد");
        } finally {
            setLoading(false);
        }
    };

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
            await api.put(`/contacts/${contactId}/`, formData);
            alert("اطلاعات مخاطب با موفقیت بروزرسانی شد");
            router.push("/dashboard/contacts");
        } catch (error) {
            console.error("Failed to update contact", error);
            alert("بروزرسانی مخاطب با خطا مواجه شد");
        }
    };

    const handleDelete = async () => {
        if (confirm("آیا از حذف این مخاطب اطمینان دارید؟")) {
            try {
                await api.delete(`/contacts/${contactId}/`);
                alert("مخاطب با موفقیت حذف شد");
                router.push("/dashboard/contacts");
            } catch (error) {
                console.error("Failed to delete contact", error);
                alert("حذف مخاطب با خطا مواجه شد");
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl text-gray-600">در حال بارگذاری...</div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">ویرایش مخاطب</h2>
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
                                value={formData.email || ""}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">تلفن</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone || ""}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">موبایل</label>
                            <input
                                type="text"
                                name="mobile"
                                value={formData.mobile || ""}
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
                                value={formData.address || ""}
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
                                value={formData.city || ""}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">کد پستی</label>
                            <input
                                type="text"
                                name="postal_code"
                                value={formData.postal_code || ""}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">کشور</label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country || ""}
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
                                value={formData.company_name || ""}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">سمت</label>
                            <input
                                type="text"
                                name="position"
                                value={formData.position || ""}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">وب‌سایت</label>
                            <input
                                type="url"
                                name="website"
                                value={formData.website || ""}
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
                                value={formData.notes || ""}
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
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        ذخیره تغییرات
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                        حذف مخاطب
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard/contacts')}
                        className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                    >
                        بازگشت
                    </button>
                </div>
            </form>
        </div>
    );
}
