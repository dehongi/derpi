import React from 'react';

export default function AboutPage() {
    return (
        <div className="py-16">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="text-center mb-16 animate-fade-in">
                    <h1 className="text-5xl font-bold mb-4">
                        درباره <span className="gradient-text">ما</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        ما یک تیم متعهد هستیم که با هدف ارائه راهکارهای نوین مدیریت منابع سازمانی فعالیت می‌کنیم
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all border border-gray-100 animate-slide-in-right">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 text-white text-3xl">
                            🎯
                        </div>
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">ماموریت ما</h2>
                        <p className="text-gray-700 leading-relaxed text-lg">
                            ساده‌سازی فرآیندهای پیچیده اداری و تجاری برای کسب‌وکارهای کوچک و بزرگ.
                            ما باور داریم که هر سازمانی حق دسترسی به ابزارهای پیشرفته مدیریت را دارد.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all border border-gray-100 animate-slide-in-left">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 text-white text-3xl">
                            🚀
                        </div>
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">چشم‌انداز ما</h2>
                        <p className="text-gray-700 leading-relaxed text-lg">
                            ایجاد بستری یکپارچه که در آن هر سازمانی بتواند با کمترین هزینه و بیشترین بهره‌وری،
                            منابع خود را مدیریت کند. تکنولوژی باید در خدمت انسان باشد، نه برعکس.
                        </p>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-10 border border-purple-100 animate-fade-in">
                    <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">
                        ارزش‌های <span className="gradient-text">ما</span>
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xl">
                                ✓
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">شفافیت و صداقت</h3>
                                <p className="text-gray-700">در تعامل با مشتریان و ارائه خدمات</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xl">
                                💡
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">نوآوری مداوم</h3>
                                <p className="text-gray-700">به‌روزرسانی و بهبود مستمر تکنولوژی‌ها</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xl">
                                🤝
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">پشتیبانی دلسوزانه</h3>
                                <p className="text-gray-700">پاسخگویی سریع و حل مشکلات مشتریان</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xl">
                                🔒
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">امنیت و حریم خصوصی</h3>
                                <p className="text-gray-700">حفاظت کامل از داده‌های حساس کاربران</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
