"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

function AuthButtons() {
  const { isAuthenticated, loading, logout } = useAuth();

  if (loading) return null;

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="text-gray-700 hover:text-purple-600 transition-colors font-medium flex items-center gap-2"
        >
          <span>داشبورد</span>
          <span className="text-xl">📊</span>
        </Link>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
        >
          خروج
        </button>
      </div>
    );
  }

  return (
    <>
      <Link href="/login" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">ورود</Link>
      <Link
        href="/signup"
        className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 font-medium"
      >
        ثبت نام
      </Link>
    </>
  );
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50" dir="rtl">
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
        ? 'glass-effect shadow-lg'
        : 'bg-white/80 backdrop-blur-sm'
        }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <a href="/" className="text-2xl font-bold">
              <span className="gradient-text">Derpi</span>
            </a>
            <nav className="flex gap-6 items-center">
              <a href="/" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">خانه</a>
              <a href="/marketplace" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">فروشگاه</a>
              <a href="/blog" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">وبلاگ</a>
              <a href="/about" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">درباره ما</a>
              <a href="/contact" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">تماس با ما</a>

              <AuthButtons />
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 gradient-text">Derpi</h3>
              <p className="text-gray-400 leading-relaxed">
                پلتفرم جامع مدیریت منابع سازمانی برای کسب‌وکارهای مدرن
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">دسترسی سریع</h4>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-400 hover:text-white transition-colors">خانه</a></li>
                <li><a href="/marketplace" className="text-gray-400 hover:text-white transition-colors">فروشگاه</a></li>
                <li><a href="/blog" className="text-gray-400 hover:text-white transition-colors">وبلاگ</a></li>
                <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">درباره ما</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">تماس با ما</a></li>
                <li><a href="/login" className="text-gray-400 hover:text-white transition-colors">ورود</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">قوانین</h4>
              <ul className="space-y-2">
                <li><a href="/terms" className="text-gray-400 hover:text-white transition-colors">قوانین و مقررات</a></li>
                <li><a href="/privacy" className="text-gray-400 hover:text-white transition-colors">حریم خصوصی</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">تماس با ما</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📧 info@derpi.ir</li>
                <li>📞 021-12345678</li>
                <li>📍 تهران، ایران</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              &copy; 2024 Derpi. تمامی حقوق محفوظ است.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                <span className="text-xl">🔗</span>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                <span className="text-xl">📱</span>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                <span className="text-xl">💬</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
