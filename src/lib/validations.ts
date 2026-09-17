import { z } from 'zod';

export const bookingSchema = z.object({
  classId: z.string().min(1, 'Class ID is required'),
  studentName: z.string().min(2, 'Student name must be at least 2 characters'),
  studentGrade: z.string().min(1, 'Please select a grade'),
  studentSchool: z.string().optional(),
  parentName: z.string().min(2, 'Parent name must be at least 2 characters'),
  parentEmail: z.string().email('Please enter a valid email address'),
  parentPhone: z.string().min(7, 'Please enter a valid phone number'),
  notes: z.string().optional(),
});

export type BookingFormData = z.infer<typeof bookingSchema>;

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Please enter a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const classSchema = z.object({
  programmeId: z.string().min(1, 'Programme is required'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  dayOfWeek: z.string().min(1, 'Day of week is required'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
  capacity: z.coerce.number().int().min(1, 'Capacity must be at least 1').max(20, 'Maximum capacity is 20'),
  priceJMD: z.coerce.number().int().min(0, 'Price must be positive'),
  term: z.string().optional(),
  meetingLink: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
});

export type ClassFormData = z.infer<typeof classSchema>;

export const blogPostSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase letters, numbers, and hyphens'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  metaDescription: z.string().max(160, 'Meta description must be under 160 characters').optional(),
  tags: z.string().optional(),
  isPublished: z.boolean().optional(),
});

export type BlogPostFormData = z.infer<typeof blogPostSchema>;

export const testimonialSchema = z.object({
  parentName: z.string().min(2, 'Name must be at least 2 characters'),
  studentGrade: z.string().optional(),
  programme: z.string().min(1, 'Programme is required'),
  rating: z.coerce.number().int().min(1).max(5),
  content: z.string().min(10, 'Testimonial must be at least 10 characters'),
  isPublished: z.boolean().optional(),
});

export type TestimonialFormData = z.infer<typeof testimonialSchema>;

export const GRADES = [
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7',
  'Grade 8',
  'Grade 9',
  'Grade 10',
  'Grade 11',
  'Lower 6th',
  'Upper 6th',
] as const;

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;
