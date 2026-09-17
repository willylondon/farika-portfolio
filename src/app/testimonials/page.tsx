import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { Star } from 'lucide-react';
import { cn, getProgrammeColor } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Testimonials | The English Language',
  description: 'Read what parents and students say about our English tutoring services. Trusted by families across Jamaica.',
};

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
  });

  const aggregateRating = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'The English Language',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: testimonials.length > 0 ? testimonials.length.toString() : '1',
    },
  };

  return (
    <main className="container-main section-padding">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRating) }}
      />
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="heading-1 mb-4">What Parents & Students Say</h1>
        <p className="text-xl text-slate-600">
          Trusted by families across Jamaica to deliver excellence in English education.
        </p>
      </div>

      {testimonials.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-lg text-slate-600">We are currently gathering testimonials. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="card p-6 flex flex-col h-full">
              <div className="flex text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <blockquote className="flex-1 text-slate-700 italic mb-6">
                &quot;{testimonial.content}&quot;
              </blockquote>
              <div className="mt-auto border-t border-slate-100 pt-4">
                <p className="font-semibold text-slate-900">{testimonial.parentName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-slate-500">{testimonial.studentGrade}</span>
                  {testimonial.programme && (
                    <span className={cn('badge', getProgrammeColor(testimonial.programme).badge)}>
                      {testimonial.programme}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
