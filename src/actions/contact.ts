'use server';

import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(2, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export async function submitContact(formData: ContactFormData) {
  try {
    const validatedData = contactSchema.parse(formData);

    await prisma.contactMessage.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || '',
        subject: validatedData.subject || '',
        message: validatedData.message,
      },
    });

    return { success: true, message: 'Thank you for your message! We will get back to you soon.' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Please check your inputs and try again.' };
    }
    console.error('Contact form error:', error);
    return { success: false, error: 'An unexpected error occurred. Please try again later.' };
  }
}
