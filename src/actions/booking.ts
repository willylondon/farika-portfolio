'use server';

import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { generateReferenceNumber } from '@/lib/utils';
import {
  sendBookingReceivedEmail,
  sendReceiptUploadedAdminEmail,
  sendBookingConfirmedEmail,
  sendBookingRejectedEmail,
} from '@/lib/email';
import { revalidatePath } from 'next/cache';

interface BookingFormData {
  studentName: string;
  studentGrade: string;
  studentSchool?: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  notes?: string;
}

export async function createBooking(classId: string, formData: BookingFormData) {
  try {
    // Validate required fields
    if (!formData.studentName || !formData.studentGrade || !formData.parentName || !formData.parentEmail || !formData.parentPhone) {
      return { success: false, error: 'Please fill in all required fields.' };
    }

    const classItem = await prisma.class.findUnique({
      where: { id: classId },
      include: { programme: true },
    });

    if (!classItem) return { success: false, error: 'Class not found.' };
    if (!classItem.isActive) return { success: false, error: 'This class is no longer available.' };
    if (classItem.enrolledCount >= classItem.capacity) {
      return { success: false, error: 'Sorry, this class is now full.' };
    }

    const referenceNumber = generateReferenceNumber();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 12);

    const booking = await prisma.$transaction(async (tx) => {
      const newBooking = await tx.booking.create({
        data: {
          classId,
          referenceNumber,
          status: 'PENDING_PAYMENT',
          expiresAt,
          studentName: formData.studentName,
          studentGrade: formData.studentGrade,
          studentSchool: formData.studentSchool || '',
          parentName: formData.parentName,
          parentEmail: formData.parentEmail,
          parentPhone: formData.parentPhone,
          notes: formData.notes || '',
        },
      });

      await tx.class.update({
        where: { id: classId },
        data: { enrolledCount: { increment: 1 } },
      });

      return newBooking;
    });

    // Send booking received email
    await sendBookingReceivedEmail({
      studentName: formData.studentName,
      parentName: formData.parentName,
      parentEmail: formData.parentEmail,
      classTitle: classItem.title,
      programmeName: classItem.programme.name,
      dayOfWeek: classItem.dayOfWeek,
      startTime: classItem.startTime,
      endTime: classItem.endTime,
      priceJMD: classItem.priceJMD,
      referenceNumber,
    });

    revalidatePath('/classes');
    revalidatePath('/admin/bookings');

    return { success: true, referenceNumber, bookingId: booking.id };
  } catch (error: unknown) {
    console.error('Create booking error:', error);
    return { success: false, error: 'An error occurred. Please try again.' };
  }
}

export async function uploadReceipt(bookingId: string, formData: FormData) {
  try {
    const file = formData.get('file') as File | null;
    if (!file) return { success: false, error: 'No file provided.' };

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      return { success: false, error: 'Invalid file type. Please upload a JPG, PNG, or PDF.' };
    }
    if (file.size > 4 * 1024 * 1024) {
      return { success: false, error: 'File exceeds 4MB limit.' };
    }

    const extension = file.name.split('.').pop() || 'jpg';
    const filename = `${uuidv4()}.${extension}`;
    let receiptUrl = `/uploads/receipts/${filename}`;

    // If Vercel Blob token is available, upload directly to cloud storage
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import('@vercel/blob');
      const blob = await put(`receipts/${filename}`, file, {
        access: 'public',
      });
      receiptUrl = blob.url;
    } else {
      // Local development fallback
      const uploadDir = path.join(process.cwd(), 'uploads', 'receipts');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(path.join(uploadDir, filename), buffer);
    }

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        receiptPath: receiptUrl,
        receiptFilename: filename,
        receiptUploadedAt: new Date(),
        status: 'RECEIPT_UPLOADED',
      },
      include: { class: { include: { programme: true } } },
    });

    // Send admin notification
    await sendReceiptUploadedAdminEmail({
      studentName: booking.studentName,
      parentName: booking.parentName,
      parentEmail: booking.parentEmail,
      classTitle: booking.class.title,
      programmeName: booking.class.programme.name,
      dayOfWeek: booking.class.dayOfWeek,
      startTime: booking.class.startTime,
      endTime: booking.class.endTime,
      priceJMD: booking.class.priceJMD,
      referenceNumber: booking.referenceNumber,
    });

    revalidatePath('/admin/bookings');

    return { success: true };
  } catch (error: unknown) {
    console.error('Upload receipt error:', error);
    return { success: false, error: 'Failed to upload receipt.' };
  }
}

export async function approveBooking(bookingId: string) {
  try {
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CONFIRMED',
        confirmedAt: new Date(),
      },
      include: { class: { include: { programme: true } } },
    });

    // Send confirmation email
    await sendBookingConfirmedEmail({
      studentName: booking.studentName,
      parentName: booking.parentName,
      parentEmail: booking.parentEmail,
      classTitle: booking.class.title,
      programmeName: booking.class.programme.name,
      dayOfWeek: booking.class.dayOfWeek,
      startTime: booking.class.startTime,
      endTime: booking.class.endTime,
      priceJMD: booking.class.priceJMD,
      referenceNumber: booking.referenceNumber,
      meetingLink: booking.class.meetingLink || undefined,
    });

    revalidatePath('/admin/bookings');
    revalidatePath('/admin');
    revalidatePath('/classes');

    return { success: true };
  } catch (error: unknown) {
    console.error('Approve booking error:', error);
    return { success: false, error: 'Failed to approve booking.' };
  }
}

export async function rejectBooking(bookingId: string) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { class: { include: { programme: true } } },
    });

    if (!booking) return { success: false, error: 'Booking not found.' };

    await prisma.$transaction(async (tx) => {
      await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: 'CANCELLED',
          rejectedAt: new Date(),
        },
      });

      await tx.class.update({
        where: { id: booking.classId },
        data: { enrolledCount: { decrement: 1 } },
      });
    });

    // Send rejection email
    await sendBookingRejectedEmail({
      studentName: booking.studentName,
      parentName: booking.parentName,
      parentEmail: booking.parentEmail,
      classTitle: booking.class.title,
      programmeName: booking.class.programme.name,
      dayOfWeek: booking.class.dayOfWeek,
      startTime: booking.class.startTime,
      endTime: booking.class.endTime,
      priceJMD: booking.class.priceJMD,
      referenceNumber: booking.referenceNumber,
    });

    revalidatePath('/admin/bookings');
    revalidatePath('/admin');
    revalidatePath('/classes');

    return { success: true };
  } catch (error: unknown) {
    console.error('Reject booking error:', error);
    return { success: false, error: 'Failed to reject booking.' };
  }
}
