import type { Programme, Class, Booking, Testimonial, BlogPost } from '@prisma/client';

export type ClassWithProgramme = Class & {
  programme: Programme;
};

export type BookingWithClass = Booking & {
  class: ClassWithProgramme;
};

export type BookingStatus =
  | 'PENDING_PAYMENT'
  | 'RECEIPT_UPLOADED'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'EXPIRED';

export type { Programme, Class, Booking, Testimonial, BlogPost };

export interface DashboardStats {
  totalStudents: number;
  pendingPayments: number;
  upcomingClasses: number;
  confirmedBookings: number;
  totalRevenue: number;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface AdminNavItem extends NavItem {
  icon: string;
  badge?: number;
}
