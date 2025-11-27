import Link from "next/link";

export default function LandingPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h1 className="text-4xl font-bold mb-6 text-gray-800">به سیستم ERP خوش آمدید</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                یک راه حل جامع برای مدیریت منابع سازمانی شما.
                لطفاً برای دسترسی به پنل کاربری وارد شوید یا ثبت نام کنید.
            </p>
            <div className="flex gap-4">
                <Link href="/login" className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                    ورود
                </Link>
                <Link href="/signup" className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition">
                    ثبت نام
                </Link>
            </div>
        </div>
    );
}
