import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { uploadReceipt } from '@/actions/booking';

export default async function UploadReceiptPage({ params }: { params: { referenceNumber: string } }) {
  const booking = await prisma.booking.findUnique({
    where: { referenceNumber: params.referenceNumber },
    include: { class: true }
  });

  if (!booking) {
    notFound();
  }

  if (booking.status === 'EXPIRED' || booking.status === 'CANCELLED') {
    return (
      <div className="container-main section-padding">
        <div className="max-w-md mx-auto card text-center space-y-4">
          <h1 className="heading-2 text-danger">Booking Expired or Cancelled</h1>
          <p className="body-text">This booking is no longer valid.</p>
          <Link href="/classes" className="btn-primary inline-block">Browse Classes</Link>
        </div>
      </div>
    );
  }

  if (booking.status !== 'PENDING_PAYMENT') {
    return (
      <div className="container-main section-padding">
        <div className="max-w-md mx-auto card text-center space-y-4">
          <h1 className="heading-2 text-success">Receipt Already Uploaded</h1>
          <p className="body-text">We have received your payment receipt and will notify you once it&apos;s verified.</p>
          <Link href="/" className="btn-primary inline-block">Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-main section-padding min-h-screen">
      <div className="max-w-2xl mx-auto card">
        <h1 className="heading-2 mb-4">Upload Payment Receipt</h1>
        <p className="body-text mb-6">Booking Reference: <span className="font-bold">{booking.referenceNumber}</span></p>

        <form action={async (formData: FormData) => {
          'use server';
          await uploadReceipt(booking.id, formData);
          // Just dummy reload or handle properly. Client components handle this better, but using basic server action logic here.
        }}>
          <div className="mb-4">
            <label className="label-text block mb-2">Select Receipt (JPG, PNG, PDF up to 4MB)</label>
            <input type="file" name="file" accept="image/jpeg,image/png,image/webp,application/pdf" required className="input-field" />
          </div>
          <button type="submit" className="btn-primary w-full">Upload Receipt</button>
        </form>
      </div>
    </div>
  );
}
