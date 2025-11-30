import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps {
    params: { slug: string };
}

async function getPage(slug: string) {
    try {
        const res = await fetch(`http://localhost:8000/api/website/public/global-pages/${slug}/`, {
            cache: 'no-store',
        });

        if (!res.ok) {
            return null;
        }

        return res.json();
    } catch (error) {
        console.error('Error fetching page:', error);
        return null;
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const page = await getPage(params.slug);

    if (!page) {
        return {
            title: 'صفحه یافت نشد',
        };
    }

    return {
        title: page.meta_title || page.title,
        description: page.meta_description || '',
        keywords: page.meta_keywords || '',
    };
}

export default async function PublicPage({ params }: PageProps) {
    const page = await getPage(params.slug);

    if (!page) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <article className="bg-white rounded-lg shadow-lg p-8">
                    <header className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            {page.title}
                        </h1>
                        {page.published_date && (
                            <time className="text-sm text-gray-500">
                                {new Date(page.published_date).toLocaleDateString('fa-IR')}
                            </time>
                        )}
                    </header>

                    <div className="prose prose-lg max-w-none">
                        <div
                            className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                            dangerouslySetInnerHTML={{ __html: page.content }}
                        />
                    </div>
                </article>
            </div>
        </div>
    );
}
