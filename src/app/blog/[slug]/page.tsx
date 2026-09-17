import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

interface BlogPostPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    select: { slug: true },
  });
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: `${post.title} | The English Language Blog`,
    description: post.metaDescription || post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post || !post.isPublished) {
    notFound();
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    description: post.excerpt,
  };

  const paragraphs = post.content.split('\n\n').filter(p => p.trim() !== '');

  return (
    <main className="container-main section-padding">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      
      <nav className="flex items-center text-sm text-slate-500 mb-8">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link href="/blog" className="hover:text-blue-600">Blog</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-slate-900 truncate max-w-[200px] sm:max-w-none">{post.title}</span>
      </nav>

      <article className="max-w-3xl mx-auto">
        <header className="mb-10 text-center">
          <div className="flex justify-center gap-2 mb-6 flex-wrap">
            {(post.tags ? post.tags.split(',').map(t => t.trim()).filter(Boolean) : []).map(tag => (
              <span key={tag} className="badge bg-slate-100 text-slate-700">{tag}</span>
            ))}
          </div>
          <h1 className="heading-1 mb-6">{post.title}</h1>
          <p className="text-slate-500">
            Published on {post.publishedAt ? format(new Date(post.publishedAt), 'MMMM d, yyyy') : 'Recently'}
          </p>
        </header>

        <div className="prose prose-slate prose-lg max-w-none mb-16">
          {paragraphs.map((p, i) => (
            <p key={i} className="mb-6 body-text leading-relaxed">
              {p}
            </p>
          ))}
        </div>

        <section className="bg-blue-50 rounded-2xl p-8 text-center mt-12 border border-blue-100">
          <h2 className="heading-2 mb-4 text-blue-900">Ready to improve your English?</h2>
          <p className="text-blue-800 mb-6 max-w-xl mx-auto">
            Join our structured programmes designed for academic excellence and language mastery.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/classes" className="btn-primary">
              Book a class today
            </Link>
            <Link href="/programmes" className="btn-secondary">
              Explore Programmes
            </Link>
          </div>
        </section>
      </article>
    </main>
  );
}
