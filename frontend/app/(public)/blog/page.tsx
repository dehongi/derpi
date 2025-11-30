import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'وبلاگ',
    description: 'مقالات و پست‌های وبلاگ',
};

async function getBlogPosts() {
    try {
        const res = await fetch('http://localhost:8000/api/website/public/blog-posts/', {
            cache: 'no-store',
        });

        if (!res.ok) {
            return [];
        }

        return res.json();
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return [];
    }
}

export default async function BlogPage() {
    const posts = await getBlogPosts();

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">وبلاگ</h1>
                    <p className="text-lg text-gray-600">آخرین مقالات و پست‌های وبلاگ</p>
                </header>

                {posts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">هنوز پستی منتشر نشده است.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post: any) => (
                            <Link
                                key={post.id}
                                href={`/blog/${post.slug}`}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                            >
                                {post.featured_image_url && (
                                    <div className="aspect-video w-full overflow-hidden">
                                        <img
                                            src={post.featured_image_url}
                                            alt={post.title}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                )}

                                <div className="p-6">
                                    {post.category && (
                                        <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full mb-3">
                                            {post.category}
                                        </span>
                                    )}

                                    <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                                        {post.title}
                                    </h2>

                                    {post.excerpt && (
                                        <p className="text-gray-600 mb-4 line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <div className="flex items-center gap-4">
                                            {post.author_name && (
                                                <span>{post.author_name}</span>
                                            )}
                                            {post.company_name && (
                                                <span className="text-blue-600">{post.company_name}</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            <span>{post.views}</span>
                                        </div>
                                    </div>

                                    {post.published_date && (
                                        <time className="block mt-3 text-xs text-gray-400">
                                            {new Date(post.published_date).toLocaleDateString('fa-IR')}
                                        </time>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
