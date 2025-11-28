import Link from "next/link";

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-24 md:py-32">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
                        مدیریت هوشمند کسب‌وکارهای مدرن
                    </h1>
                    <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-white/90 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        یک پلتفرم جامع برای مدیریت منابع، فرآیندها و ارتباطات سازمانی.
                        با Derpi، بهره‌وری خود را به سطح جدیدی برسانید.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <Link
                            href="/signup"
                            className="px-8 py-4 bg-white text-purple-700 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 inline-block"
                        >
                            🚀 شروع رایگان
                        </Link>
                        <Link
                            href="/about"
                            className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/20 transition-all inline-block"
                        >
                            بیشتر بدانید
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-white border-b">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div className="animate-fade-in">
                            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">+1000</div>
                            <div className="text-gray-600 mt-2">کاربر فعال</div>
                        </div>
                        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">99.9%</div>
                            <div className="text-gray-600 mt-2">آپتایم</div>
                        </div>
                        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">24/7</div>
                            <div className="text-gray-600 mt-2">پشتیبانی</div>
                        </div>
                        <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">+50</div>
                            <div className="text-gray-600 mt-2">ماژول</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                            چرا <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Derpi</span>؟
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            ابزارهای قدرتمند برای مدیریت هوشمند کسب‌وکار شما
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 text-white text-3xl group-hover:scale-110 transition-transform">
                                📊
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">گزارش‌دهی پیشرفته</h3>
                            <p className="text-gray-600 leading-relaxed">
                                دسترسی به گزارش‌های دقیق و لحظه‌ای برای تصمیم‌گیری‌های بهتر و سریع‌تر با داشبوردهای تعاملی.
                            </p>
                        </div>

                        <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 text-white text-3xl group-hover:scale-110 transition-transform">
                                🔄
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">یکپارچگی کامل</h3>
                            <p className="text-gray-600 leading-relaxed">
                                اتصال تمام بخش‌های سازمان از مالی و انبار تا فروش و منابع انسانی در یک پلتفرم واحد.
                            </p>
                        </div>

                        <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 text-white text-3xl group-hover:scale-110 transition-transform">
                                🔒
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">امنیت بالا</h3>
                            <p className="text-gray-600 leading-relaxed">
                                حفاظت از داده‌های حساس شما با جدیدترین استانداردهای امنیتی و رمزنگاری پیشرفته.
                            </p>
                        </div>

                        <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 text-white text-3xl group-hover:scale-110 transition-transform">
                                ⚡
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">عملکرد سریع</h3>
                            <p className="text-gray-600 leading-relaxed">
                                سرعت بالا در پردازش داده‌ها و پاسخگویی فوری به نیازهای روزمره کسب‌وکار شما.
                            </p>
                        </div>

                        <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 text-white text-3xl group-hover:scale-110 transition-transform">
                                📱
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">دسترسی همه‌جا</h3>
                            <p className="text-gray-600 leading-relaxed">
                                مدیریت کسب‌وکار از هر مکان و هر دستگاه با رابط کاربری ریسپانسیو و بهینه‌شده.
                            </p>
                        </div>

                        <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mb-6 text-white text-3xl group-hover:scale-110 transition-transform">
                                💡
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">هوش مصنوعی</h3>
                            <p className="text-gray-600 leading-relaxed">
                                پیش‌بینی هوشمند روندها و ارائه پیشنهادات بهینه برای رشد کسب‌وکار با AI.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900"></div>
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                        آماده تحول در کسب‌وکارتان هستید؟
                    </h2>
                    <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                        همین امروز به جمع هزاران مدیر موفق بپیوندید که با Derpi کسب‌وکار خود را متحول کرده‌اند.
                    </p>
                    <Link
                        href="/signup"
                        className="px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-2xl hover:shadow-purple-500/50 hover:-translate-y-1 inline-block"
                    >
                        ثبت نام رایگان و شروع کنید 🎉
                    </Link>
                </div>
            </section>
        </div>
    );
}
