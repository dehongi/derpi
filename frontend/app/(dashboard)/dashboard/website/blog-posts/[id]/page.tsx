'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import api from '@/utils/api';

export default function EditBlogPostPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id;
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [existingImage, setExistingImage] = useState<string>('');

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: '',
        tags: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        is_published: false,
        published_date: '',
    });

    useEffect(() => {
        fetchBlogPost();
    }, [id]);

    const fetchBlogPost = async () => {
        try {
            const response = await api.get(`/website/blog-posts/${id}/`);
            const data = response.data;
            setFormData({
                title: data.title || '',
                slug: data.slug || '',
                excerpt: data.excerpt || '',
                content: data.content || '',
                category: data.category || '',
                tags: data.tags || '',
                meta_title: data.meta_title || '',
                meta_description: data.meta_description || '',
                meta_keywords: data.meta_keywords || '',
                is_published: data.is_published || false,
                published_date: data.published_date ? data.published_date.slice(0, 16) : '',
            });
            if (data.featured_image_url) {
                setExistingImage(data.featured_image_url);
            }
        } catch (error) {
            console.error('Error fetching blog post:', error);
            setError('خطا در بارگذاری پست');
        } finally {
            setFetchLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const submitFormData = new FormData();

            // Append all text fields
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'published_date' && !value) {
                    return;
                }
                submitFormData.append(key, value.toString());
            });

            // Append image if a new one is selected
            if (imageFile) {
                submitFormData.append('featured_image', imageFile);
            }

            await api.put(`/website/blog-posts/${id}/`, submitFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setSuccess('پست وبلاگ با موفقیت بروزرسانی شد');
            setTimeout(() => {
                router.push('/dashboard/website/blog-posts');
            }, 1500);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'خطا در بروزرسانی');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('آیا از حذف این پست اطمینان دارید؟')) return;

        try {
            await api.delete(`/website/blog-posts/${id}/`);
            router.push('/dashboard/website/blog-posts');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'خطا در حذف');
        }
    };

    if (fetchLoading) {
        return <div className="text-center py-8">در حال بارگذاری...</div>;
    }

    return (
        <div>
            <PageHeader
                title="ویرایش پست وبلاگ"
                subtitle="بروزرسانی اطلاعات پست وبلاگ"
            />

            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            عنوان *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            نامک (Slug) *
                        </label>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            خلاصه
                        </label>
                        <textarea
                            name="excerpt"
                            value={formData.excerpt}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            محتوا *
                        </label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            required
                            rows={12}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            دسته‌بندی
                        </label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            برچسب‌ها
                        </label>
                        <input
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            placeholder="برچسب‌ها را با کاما جدا کنید"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            تصویر شاخص
                        </label>
                        {existingImage && !imagePreview && (
                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-2">تصویر فعلی:</p>
                                <img src={existingImage} alt="تصویر فعلی" className="max-w-xs rounded shadow" />
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {imagePreview && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-600 mb-2">تصویر جدید:</p>
                                <img src={imagePreview} alt="پیش‌نمایش" className="max-w-xs rounded shadow" />
                            </div>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">تنظیمات SEO</h3>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            عنوان متا
                        </label>
                        <input
                            type="text"
                            name="meta_title"
                            value={formData.meta_title}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            توضیحات متا
                        </label>
                        <textarea
                            name="meta_description"
                            value={formData.meta_description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            کلمات کلیدی متا
                        </label>
                        <input
                            type="text"
                            name="meta_keywords"
                            value={formData.meta_keywords}
                            onChange={handleChange}
                            placeholder="کلمات را با کاما جدا کنید"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">تنظیمات انتشار</h3>
                    </div>

                    <div>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="is_published"
                                checked={formData.is_published}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            <span className="text-sm font-medium text-gray-700">منتشر شده</span>
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            تاریخ انتشار
                        </label>
                        <input
                            type="datetime-local"
                            name="published_date"
                            value={formData.published_date}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="mt-6 flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {loading ? 'در حال ذخیره...' : 'بروزرسانی'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard/website/blog-posts')}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300"
                    >
                        انصراف
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 mr-auto"
                    >
                        حذف
                    </button>
                </div>
            </form>
        </div>
    );
}
