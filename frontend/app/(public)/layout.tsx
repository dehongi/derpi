"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

function AuthButtons({ isMobile = false, onLinkClick = () => { } }: { isMobile?: boolean; onLinkClick?: () => void }) {
  const { isAuthenticated, loading, logout } = useAuth();

  if (loading) return null;

  if (isAuthenticated) {
    return (
      <div className={`flex ${isMobile ? 'flex-col w-full' : 'items-center'} gap-4`}>
        <Link
          href="/dashboard"
          onClick={onLinkClick}
          className={`text-gray-700 hover:text-purple-600 transition-colors font-medium flex items-center gap-2 ${isMobile ? 'px-6 py-3 hover:bg-purple-50 rounded-lg' : ''}`}
        >
          <span>داشبورد</span>
          <span className="text-xl">📊</span>
        </Link>
        <button
          onClick={() => {
            logout();
            onLinkClick();
          }}
          className={`${isMobile ? 'w-full' : ''} px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm`}
        >
          خروج
        </button>
      </div>
    );
  }

  return (
    <div className={`flex ${isMobile ? 'flex-col w-full' : 'items-center'} gap-4`}>
      <Link
        href="/login"
        onClick={onLinkClick}
        className={`text-gray-700 hover:text-purple-600 transition-colors font-medium ${isMobile ? 'px-6 py-3 hover:bg-purple-50 rounded-lg' : ''}`}
      >
        ورود
      </Link>
      <Link
        href="/signup"
        onClick={onLinkClick}
        className={`${isMobile ? 'w-full text-center' : ''} px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 font-medium`}
      >
        ثبت نام
      </Link>
    </div>
  );
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

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

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex gap-6 items-center">
              <a href="/" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">خانه</a>
              <a href="/marketplace" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">فروشگاه</a>
              <a href="/blog" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">وبلاگ</a>
              <a href="/about" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">درباره ما</a>
              <a href="/contact" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">تماس با ما</a>

              <AuthButtons />
            </nav>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-purple-600 transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85%] bg-white shadow-2xl z-50 transform transition-transform duration-300 lg:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <span className="text-2xl font-bold gradient-text">Derpi</span>
            <button
              onClick={closeMobileMenu}
              className="p-2 text-gray-700 hover:text-purple-600 transition-colors"
              aria-label="Close menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Links */}
          <nav className="flex-1 overflow-y-auto py-6">
            <div className="flex flex-col space-y-2 px-4">
              <a
                href="/"
                onClick={closeMobileMenu}
                className="text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors font-medium px-6 py-3 rounded-lg"
              >
                خانه
              </a>
              <a
                href="/marketplace"
                onClick={closeMobileMenu}
                className="text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors font-medium px-6 py-3 rounded-lg"
              >
                فروشگاه
              </a>
              <a
                href="/blog"
                onClick={closeMobileMenu}
                className="text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors font-medium px-6 py-3 rounded-lg"
              >
                وبلاگ
              </a>
              <a
                href="/about"
                onClick={closeMobileMenu}
                className="text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors font-medium px-6 py-3 rounded-lg"
              >
                درباره ما
              </a>
              <a
                href="/contact"
                onClick={closeMobileMenu}
                className="text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors font-medium px-6 py-3 rounded-lg"
              >
                تماس با ما
              </a>

              <div className="pt-4 border-t border-gray-200 mt-4">
                <AuthButtons isMobile={true} onLinkClick={closeMobileMenu} />
              </div>
            </div>
          </nav>
        </div>
      </div>

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
