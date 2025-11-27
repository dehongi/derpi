"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

interface Contact {
    id: number;
    name: string;
    email: string;
    phone: string;
    mobile: string;
    company_name: string;
    position: string;
    contact_type: string;
    is_active: boolean;
}

export default function ContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const response = await api.get('/contacts/');
            setContacts(response.data);
        } catch (error) {
            console.error("Failed to fetch contacts", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("آیا از حذف این مخاطب اطمینان دارید؟")) {
            try {
                await api.delete(`/contacts/${id}/`);
                alert("مخاطب با موفقیت حذف شد");
                fetchContacts();
            } catch (error) {
                console.error("Failed to delete contact", error);
                alert("حذف مخاطب با خطا مواجه شد");
            }
        }
    };

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone?.includes(searchTerm) ||
        contact.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getContactTypeLabel = (type: string) => {
        const types: { [key: string]: string } = {
            'customer': 'مشتری',
            'supplier': 'تامین‌کننده',
            'partner': 'شریک تجاری',
            'other': 'سایر'
        };
        return types[type] || type;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl text-gray-600">در حال بارگذاری...</div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="bg-white p-6 rounded shadow mb-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">مخاطبین</h2>
                    <button
                        onClick={() => router.push('/dashboard/contacts/create')}
                        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                        + افزودن مخاطب جدید
                    </button>
                </div>

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="جستجو در مخاطبین..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                </div>

                {filteredContacts.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        {searchTerm ? "مخاطبی یافت نشد" : "هنوز مخاطبی ثبت نشده است"}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-right text-gray-700">نام</th>
                                    <th className="px-4 py-3 text-right text-gray-700">ایمیل</th>
                                    <th className="px-4 py-3 text-right text-gray-700">تلفن</th>
                                    <th className="px-4 py-3 text-right text-gray-700">شرکت</th>
                                    <th className="px-4 py-3 text-right text-gray-700">نوع</th>
                                    <th className="px-4 py-3 text-right text-gray-700">وضعیت</th>
                                    <th className="px-4 py-3 text-right text-gray-700">عملیات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredContacts.map((contact) => (
                                    <tr key={contact.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-gray-900">{contact.name}</td>
                                        <td className="px-4 py-3 text-gray-600">{contact.email || '-'}</td>
                                        <td className="px-4 py-3 text-gray-600">{contact.phone || contact.mobile || '-'}</td>
                                        <td className="px-4 py-3 text-gray-600">{contact.company_name || '-'}</td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                                                {getContactTypeLabel(contact.contact_type)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 text-xs rounded ${contact.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {contact.is_active ? 'فعال' : 'غیرفعال'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => router.push(`/dashboard/contacts/${contact.id}`)}
                                                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                                >
                                                    ویرایش
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(contact.id)}
                                                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
                                                >
                                                    حذف
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
