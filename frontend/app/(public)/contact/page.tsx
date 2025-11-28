'use client';

import React, { useState } from 'react';
import { contactUs } from '@/utils/api';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        try {
            await contactUs(formData);
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            console.error('Error sending message:', error);
            setStatus('error');
            setErrorMessage('متاسفانه مشکلی پیش آمد. لطفا دوباره تلاش کنید.');
        }
    };

    return (
        <div className="py-16">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-5xl font-bold mb-4">
                        <span className="gradient-text">تماس با ما</span>
                    </h1>
                    <p className="text-xl text-gray-600">
                        سوالات یا پیشنهادات خود را با ما در میان بگذارید
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100 animate-scale-in">
                    {status === 'success' ? (
                        <div className="text-center py-12 animate-fade-in">
                            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-4xl">
                                ✓
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-3">پیام شما دریافت شد</h3>
                            <p className="text-gray-600 mb-8 text-lg">
                                از تماس شما متشکریم. به زودی با شما تماس خواهیم گرفت.
                            </p>
                            <button
                                onClick={() => setStatus('idle')}
                                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
                            >
                                ارسال پیام جدید
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {status === 'error' && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg animate-fade-in">
                                    {errorMessage}
                                </div>
                            )}

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        نام و نام خانوادگی
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        ایمیل
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                    موضوع
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                    پیام
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={6}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'submitting'}
                                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium text-lg rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {status === 'submitting' ? 'در حال ارسال...' : 'ارسال پیام'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
