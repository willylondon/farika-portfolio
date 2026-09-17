import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import ClassesFilter from '@/components/classes/ClassesFilter';
import { PROGRAMME_DATA } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Available Classes',
  description: 'Browse and book our available English and Language Arts classes.',
};

export default async function ClassesPage() {
  const classes = await prisma.class.findMany({
    where: { isActive: true },
    include: { programme: true },
    orderBy: [
      { programme: { name: 'asc' } },
      { createdAt: 'desc' }
    ],
  });

  // Extract a list of unique programmes that have active classes, or just use PROGRAMME_DATA
  const programmes = PROGRAMME_DATA.map(p => ({
    id: p.slug, // using slug as ID for filtering
    name: p.name,
    slug: p.slug
  }));

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container-main">
        <div className="mb-10 text-center">
          <h1 className="heading-1 font-serif mb-4">Available Classes</h1>
          <p className="body-text max-w-2xl mx-auto">
            Find the perfect class schedule for your learning needs. Small groups, expert instruction.
          </p>
        </div>

        <ClassesFilter 
          initialClasses={classes} 
          programmes={programmes} 
        />
      </div>
    </div>
  );
}
