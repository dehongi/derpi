"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

export default function CompanyPage() {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [isUpdate, setIsUpdate] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const response = await api.get('/companies/');
                if (response.data.length > 0) {
                    const company = response.data[0];
                    setName(company.name);
                    setAddress(company.address);
                    setPhone(company.phone);
                    setIsUpdate(true);
                    // Store ID for update if needed, but we can assume single company for now or fetch again
                    // Better to store the ID in state if we need to PUT to /companies/:id/
                    // But wait, the list endpoint returns a list.
                    // Let's store the ID.
                    setCompanyId(company.id);
                }
            } catch (error) {
                console.error("Failed to fetch company", error);
            }
        };
        fetchCompany();
    }, []);

    const [companyId, setCompanyId] = useState<number | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isUpdate && companyId) {
                await api.put(`/companies/${companyId}/`, { name, address, phone });
                alert("اطلاعات شرکت با موفقیت بروزرسانی شد");
            } else {
                await api.post('/companies/', { name, address, phone });
                alert("شرکت با موفقیت ثبت شد");
                router.push("/dashboard");
            }
        } catch (error) {
            console.error("Company operation failed", error);
            alert("عملیات با خطا مواجه شد");
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                {isUpdate ? "ویرایش اطلاعات شرکت" : "ثبت شرکت جدید"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 mb-2">نام شرکت</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">آدرس</label>
                    <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        rows={3}
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">تلفن</label>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                </div>
                <button
                    type="submit"
                    className={`px-6 py-2 text-white rounded transition ${isUpdate ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}
                >
                    {isUpdate ? "ذخیره تغییرات" : "ثبت شرکت"}
                </button>
            </form>
        </div>
    );
}
