import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { PROGRAMME_DATA } from '@/lib/utils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.SITE_URL || 'https://www.theenglishlanguageja.com';

  const staticRoutes = [
    '',
    '/programmes',
    '/classes',
    '/about',
    '/contact',
    '/faq',
    '/testimonials',
    '/blog',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const programmeRoutes = PROGRAMME_DATA.map((prog) => ({
    url: `${baseUrl}/programmes/${prog.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  const blogPosts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    select: { slug: true, updatedAt: true },
  });

  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...programmeRoutes, ...blogRoutes];
}
