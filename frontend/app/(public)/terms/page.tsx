import React from 'react';

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8 text-gray-900 text-center">شرایط و قوانین استفاده</h1>

            <div className="bg-white rounded-lg shadow-md p-8">
                <p className="text-gray-700 mb-6">
                    آخرین بروزرسانی: 1403/09/08
                </p>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">1. پذیرش شرایط</h2>
                    <p className="text-gray-700 leading-relaxed">
                        با دسترسی و استفاده از خدمات ما، شما موافقت می‌کنید که به این شرایط و قوانین پایبند باشید.
                        اگر با هر یک از این شرایط مخالف هستید، لطفاً از خدمات ما استفاده نکنید.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">2. حساب کاربری</h2>
                    <p className="text-gray-700 leading-relaxed">
                        برای استفاده از برخی خدمات، نیاز به ایجاد حساب کاربری دارید. شما مسئول حفظ محرمانگی اطلاعات حساب خود هستید
                        و مسئولیت تمام فعالیت‌هایی که با حساب کاربری شما انجام می‌شود، بر عهده شماست.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">3. استفاده مجاز</h2>
                    <p className="text-gray-700 leading-relaxed">
                        شما متعهد می‌شوید که از خدمات ما فقط برای مقاصد قانونی استفاده کنید. هرگونه استفاده غیرمجاز،
                        از جمله تلاش برای نفوذ به سیستم‌ها، ارسال اسپم یا نقض حقوق مالکیت فکری، ممنوع است.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">4. تغییرات در شرایط</h2>
                    <p className="text-gray-700 leading-relaxed">
                        ما حق داریم در هر زمان این شرایط را تغییر دهیم. تغییرات جدید در همین صفحه منتشر خواهد شد
                        و استفاده مداوم شما از خدمات به منزله پذیرش تغییرات است.
                    </p>
                </section>
            </div>
        </div>
    );
}
