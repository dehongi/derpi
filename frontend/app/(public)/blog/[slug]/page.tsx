import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface BlogPostProps {
    params: { slug: string };
}

async function getBlogPost(slug: string) {
    try {
        const res = await fetch(`http://localhost:8000/api/website/public/blog-posts/${slug}/`, {
            cache: 'no-store',
        });

        if (!res.ok) {
            return null;
        }

        return res.json();
    } catch (error) {
        console.error('Error fetching blog post:', error);
        return null;
    }
}

export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
    const post = await getBlogPost(params.slug);

    if (!post) {
        return {
            title: 'پست یافت نشد',
        };
    }

    return {
        title: post.meta_title || post.title,
        description: post.meta_description || post.excerpt || '',
        keywords: post.meta_keywords || post.tags || '',
    };
}

export default async function BlogPostPage({ params }: BlogPostProps) {
    const post = await getBlogPost(params.slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <article className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {post.featured_image_url && (
                        <div className="aspect-video w-full overflow-hidden">
                            <img
                                src={post.featured_image_url}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="p-8">
                        <header className="mb-8">
                            {post.category && (
                                <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full mb-4">
                                    {post.category}
                                </span>
                            )}

                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                {post.title}
                            </h1>

                            <div className="flex items-center gap-6 text-sm text-gray-600">
                                {post.author_name && (
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span>{post.author_name}</span>
                                    </div>
                                )}

                                {post.company_name && (
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        <span className="text-blue-600">{post.company_name}</span>
                                    </div>
                                )}

                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    <span>{post.views} بازدید</span>
                                </div>

                                {post.published_date && (
                                    <time className="flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {new Date(post.published_date).toLocaleDateString('fa-IR')}
                                    </time>
                                )}
                            </div>

                            {post.tags && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {post.tags.split(',').map((tag: string, index: number) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                                        >
                                            #{tag.trim()}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </header>

                        {post.excerpt && (
                            <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                                <p className="text-gray-700 italic">{post.excerpt}</p>
                            </div>
                        )}

                        <div className="prose prose-lg max-w-none">
                            <div
                                className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                        </div>

                        <footer className="mt-12 pt-8 border-t border-gray-200">
                            <Link
                                href="/blog"
                                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                بازگشت به لیست مقالات
                            </Link>
                        </footer>
                    </div>
                </article>
            </div>
        </div>
    );
}
