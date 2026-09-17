import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog | The English Language',
  description: 'Tips, strategies, and insights for English & Language Arts success. Read our latest articles.',
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <main className="container-main section-padding">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="heading-1 mb-4">The English Language Blog</h1>
        <p className="text-xl text-slate-600">
          Tips, strategies, and insights for English & Language Arts success
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-lg text-slate-600">No blog posts available at the moment. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.id} className="card p-6 flex flex-col h-full hover:shadow-lg transition-shadow">
              <div className="flex gap-2 mb-3 flex-wrap">
                {(post.tags ? post.tags.split(',').map(t => t.trim()).filter(Boolean) : []).map(tag => (
                  <span key={tag} className="badge bg-slate-100 text-slate-600" title={tag}>{tag}</span>
                ))}
              </div>
              <Link href={`/blog/${post.slug}`}>
                <h2 className="heading-3 mb-3 hover:text-blue-600 transition-colors">{post.title}</h2>
              </Link>
              <p className="text-slate-600 mb-4 line-clamp-3 flex-1">{post.excerpt}</p>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                <time className="text-sm text-slate-500">
                  {post.publishedAt ? format(new Date(post.publishedAt), 'MMMM d, yyyy') : 'Recently'}
                </time>
                <Link href={`/blog/${post.slug}`} className="text-blue-600 font-medium text-sm flex items-center gap-1 hover:text-blue-700">
                  Read More <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
