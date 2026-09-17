import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import BookingWizard from '@/components/booking/BookingWizard';
import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { classId: string } }): Promise<Metadata> {
  const classItem = await prisma.class.findUnique({
    where: { id: params.classId },
  });

  if (!classItem) {
    return {
      title: 'Class Not Found | The English Language',
    };
  }

  return {
    title: `Book ${classItem.title} | The English Language`,
  };
}

export default async function BookClassPage({ params }: { params: { classId: string } }) {
  const classItem = await prisma.class.findUnique({
    where: { id: params.classId },
    include: {
      programme: true,
    },
  });

  if (!classItem || !classItem.isActive) {
    notFound();
  }

  if (classItem.enrolledCount >= classItem.capacity) {
    return (
      <div className="container-main section-padding">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h1 className="heading-1 text-danger">Class Full</h1>
          <p className="body-text">
            We&apos;re sorry, but {classItem.title} is currently full. Please check back later or explore our other available classes.
          </p>
          <Link href="/classes" className="btn-primary inline-block">
            View All Classes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-main section-padding min-h-screen">
      <div className="max-w-3xl mx-auto">
        <BookingWizard classData={classItem as any} />
      </div>
    </div>
  );
}
