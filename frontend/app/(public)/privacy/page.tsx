import React from 'react';

export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8 text-gray-900 text-center">سیاست حفظ حریم خصوصی</h1>

            <div className="bg-white rounded-lg shadow-md p-8">
                <p className="text-gray-700 mb-6">
                    ما به حریم خصوصی شما احترام می‌گذاریم و متعهد به حفاظت از اطلاعات شخصی شما هستیم.
                </p>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">اطلاعاتی که جمع‌آوری می‌کنیم</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        ما ممکن است اطلاعات زیر را جمع‌آوری کنیم:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>اطلاعات هویتی (مانند نام و نام خانوادگی)</li>
                        <li>اطلاعات تماس (مانند آدرس ایمیل و شماره تلفن)</li>
                        <li>اطلاعات مربوط به استفاده از خدمات</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">چگونه از اطلاعات استفاده می‌کنیم</h2>
                    <p className="text-gray-700 leading-relaxed">
                        اطلاعات جمع‌آوری شده برای ارائه خدمات، بهبود تجربه کاربری، ارتباط با شما و رعایت الزامات قانونی استفاده می‌شود.
                        ما اطلاعات شما را به اشخاص ثالث نمی‌فروشیم.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">امنیت اطلاعات</h2>
                    <p className="text-gray-700 leading-relaxed">
                        ما اقدامات امنیتی مناسبی را برای محافظت از اطلاعات شما در برابر دسترسی غیرمجاز، تغییر یا افشا به کار می‌گیریم.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">تماس با ما</h2>
                    <p className="text-gray-700 leading-relaxed">
                        اگر سوالی در مورد این سیاست حفظ حریم خصوصی دارید، لطفاً از طریق صفحه تماس با ما اقدام کنید.
                    </p>
                </section>
            </div>
        </div>
    );
}
