"use client";

import { useState, useEffect } from "react";
import api from "@/utils/api";

export default function ProfilePage() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Assuming 'api' is an imported axios instance or similar
                const response = await api.get('/accounts/profile/');
                const { first_name, last_name, email } = response.data;
                setFirstName(first_name || "");
                setLastName(last_name || "");
                setEmail(email || "");
            } catch (error) {
                console.error("Failed to fetch profile", error);
            }
        };
        fetchProfile();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Assuming 'api' is an imported axios instance or similar
            await api.put('/accounts/profile/', { first_name: firstName, last_name: lastName, email });
            alert("پروفایل با موفقیت بروزرسانی شد");
        } catch (error) {
            console.error("Failed to update profile", error);
            alert("بروزرسانی پروفایل با خطا مواجه شد");
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">پروفایل کاربری</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 mb-2">نام</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">نام خانوادگی</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">ایمیل</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                </div>
                <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    ذخیره تغییرات
                </button>
            </form>
        </div>
    );
}
