'use client';

import React, { useState } from 'react';
import { formatPrice, formatTime, getSeatsRemaining, getSeatUrgency, getProgrammeColor } from '@/lib/utils';
import { CheckCircle2, UploadCloud, ChevronRight, ChevronLeft, Clock, Users, CreditCard, Loader2 } from 'lucide-react';
import { createBooking, uploadReceipt } from '@/actions/booking';
import Link from 'next/link';

const GRADES = [
  'Grade 4', 'Grade 5', 'Grade 6',
  'Grade 7', 'Grade 8', 'Grade 9',
  'Grade 10', 'Grade 11',
  'Lower 6th', 'Upper 6th',
];

interface ClassData {
  id: string;
  title: string;
  description: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  capacity: number;
  enrolledCount: number;
  priceJMD: number;
  term: string;
  programme: {
    name: string;
    slug: string;
    color: string;
  };
}

export default function BookingWizard({ classData }: { classData: ClassData }) {
  const [step, setStep] = useState(1);
  const [bookingId, setBookingId] = useState('');
  const [reference, setReference] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    studentName: '',
    studentGrade: '',
    studentSchool: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const seatsRemaining = getSeatsRemaining(classData.capacity, classData.enrolledCount);
  const urgency = getSeatUrgency(seatsRemaining);
  const programmeColor = getProgrammeColor(classData.programme.color);

  const seatColorClass = urgency === 'full'
    ? 'text-red-600 bg-red-50'
    : urgency === 'low'
      ? 'text-amber-600 bg-amber-50'
      : 'text-green-600 bg-green-50';

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.studentName.trim()) errors.studentName = 'Student name is required';
    if (!formData.studentGrade) errors.studentGrade = 'Please select a grade';
    if (!formData.parentName.trim()) errors.parentName = 'Parent name is required';
    if (!formData.parentEmail.trim()) errors.parentEmail = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parentEmail)) errors.parentEmail = 'Please enter a valid email';
    if (!formData.parentPhone.trim()) errors.parentPhone = 'Phone number is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (formErrors[e.target.name]) {
      setFormErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const handleSubmitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError('');

    try {
      const res = await createBooking(classData.id, formData);
      if (res.success && res.referenceNumber && res.bookingId) {
        setReference(res.referenceNumber);
        setBookingId(res.bookingId);
        setStep(3);
      } else {
        setError(res.error || 'Failed to create booking. Please try again.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Please upload a JPG, PNG, or PDF file');
      return;
    }
    if (selectedFile.size > 4 * 1024 * 1024) {
      setError('File must be under 4MB');
      return;
    }

    setFile(selectedFile);
    setError('');

    // Create preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target?.result as string);
      reader.readAsDataURL(selectedFile);
    } else {
      setFilePreview(null);
    }
  };

  const handleUploadReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !bookingId) return;

    setIsSubmitting(true);
    setError('');

    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await uploadReceipt(bookingId, fd);

      if (res.success) {
        setStep(4);
      } else {
        setError(res.error || 'Failed to upload receipt. Please try again.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step indicators
  const steps = ['Class Details', 'Your Details', 'Payment', 'Confirmed'];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                i + 1 < step ? 'bg-green-500 text-white' :
                i + 1 === step ? 'bg-primary-600 text-white' :
                'bg-slate-200 text-slate-500'
              }`}>
                {i + 1 < step ? '✓' : i + 1}
              </div>
              <span className={`ml-2 text-sm hidden sm:inline ${
                i + 1 === step ? 'text-primary-600 font-semibold' : 'text-slate-500'
              }`}>
                {label}
              </span>
              {i < steps.length - 1 && (
                <div className={`mx-3 h-0.5 w-8 sm:w-16 ${
                  i + 1 < step ? 'bg-green-500' : 'bg-slate-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Step 1: Class Details */}
      {step === 1 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <span className={`badge ${programmeColor.badge}`}>
              {classData.programme.name}
            </span>
            <span className={`badge ${seatColorClass} px-3 py-1`}>
              <Users className="w-3.5 h-3.5 mr-1 inline" />
              {seatsRemaining} of {classData.capacity} seats left
            </span>
          </div>

          <h1 className="heading-2 mb-3">{classData.title}</h1>
          <p className="body-text mb-6">{classData.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-5 border-y border-slate-100 mb-6">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm text-slate-500">Schedule</p>
                <p className="font-medium">{classData.dayOfWeek}</p>
                <p className="text-sm text-slate-600">{formatTime(classData.startTime)} – {formatTime(classData.endTime)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm text-slate-500">Price per session</p>
                <p className="font-medium text-lg">{formatPrice(classData.priceJMD)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm text-slate-500">Class Size</p>
                <p className="font-medium">Max {classData.capacity} students</p>
              </div>
            </div>
          </div>

          {classData.term && (
            <p className="text-sm text-slate-500 mb-4">Term: {classData.term}</p>
          )}

          <button onClick={() => setStep(2)} className="btn-primary w-full flex justify-center items-center gap-2">
            Proceed to Booking <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Step 2: Student & Parent Details */}
      {step === 2 && (
        <div className="card">
          <h2 className="heading-3 mb-6">Student & Parent Details</h2>

          <form onSubmit={handleSubmitDetails} className="space-y-5">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Student Information</h3>

              <div>
                <label htmlFor="studentName" className="label-text">Student Name *</label>
                <input id="studentName" name="studentName" value={formData.studentName} onChange={handleInputChange}
                  className="input-field" placeholder="Enter student's full name" />
                {formErrors.studentName && <p className="error-text">{formErrors.studentName}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="studentGrade" className="label-text">Grade / Form *</label>
                  <select id="studentGrade" name="studentGrade" value={formData.studentGrade} onChange={handleInputChange}
                    className="input-field">
                    <option value="">Select grade</option>
                    {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                  {formErrors.studentGrade && <p className="error-text">{formErrors.studentGrade}</p>}
                </div>
                <div>
                  <label htmlFor="studentSchool" className="label-text">School (optional)</label>
                  <input id="studentSchool" name="studentSchool" value={formData.studentSchool} onChange={handleInputChange}
                    className="input-field" placeholder="e.g. Campion College" />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Parent / Guardian</h3>

              <div>
                <label htmlFor="parentName" className="label-text">Full Name *</label>
                <input id="parentName" name="parentName" value={formData.parentName} onChange={handleInputChange}
                  className="input-field" placeholder="Enter parent's full name" />
                {formErrors.parentName && <p className="error-text">{formErrors.parentName}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="parentEmail" className="label-text">Email Address *</label>
                  <input id="parentEmail" name="parentEmail" type="email" value={formData.parentEmail} onChange={handleInputChange}
                    className="input-field" placeholder="email@example.com" />
                  {formErrors.parentEmail && <p className="error-text">{formErrors.parentEmail}</p>}
                </div>
                <div>
                  <label htmlFor="parentPhone" className="label-text">Phone Number *</label>
                  <input id="parentPhone" name="parentPhone" type="tel" value={formData.parentPhone} onChange={handleInputChange}
                    className="input-field" placeholder="(876) 555-5555" />
                  {formErrors.parentPhone && <p className="error-text">{formErrors.parentPhone}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="label-text">Additional Notes (optional)</label>
                <textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange}
                  className="input-field h-24" placeholder="Any learning goals, concerns, or special requirements..." />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 flex justify-center items-center gap-2">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 flex justify-center items-center gap-2">
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Creating Booking...</>
                ) : (
                  <>Continue to Payment <ChevronRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Step 3: Payment Instructions & Receipt Upload */}
      {step === 3 && (
        <div className="card">
          <h2 className="heading-3 mb-2">Payment Instructions</h2>
          <p className="text-sm text-slate-500 mb-6">
            Transfer the class fee to our bank account and upload your receipt below.
          </p>

          {/* Reference Number */}
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 text-center mb-6">
            <p className="text-sm text-primary-600 mb-1">Your Booking Reference</p>
            <p className="font-mono text-2xl font-bold tracking-wider text-primary-800">{reference}</p>
          </div>

          {/* Bank Details */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-amber-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" /> Bank Transfer Details
            </h3>
            <div className="space-y-2 text-amber-800">
              <p><span className="font-medium">Bank:</span> National Commercial Bank (NCB)</p>
              <p><span className="font-medium">Account Name:</span> The English Language</p>
              <p><span className="font-medium">Account Number:</span> 000000000</p>
              <p><span className="font-medium">Branch:</span> Kingston</p>
              <div className="pt-3 mt-3 border-t border-amber-300">
                <p><span className="font-medium">Amount:</span> {formatPrice(classData.priceJMD)}</p>
                <p className="text-sm mt-1">Please include <strong>{reference}</strong> in your transfer description.</p>
              </div>
            </div>
          </div>

          {/* Receipt Upload */}
          <form onSubmit={handleUploadReceipt} className="space-y-4">
            <div>
              <label className="label-text">Upload Payment Receipt *</label>
              <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                file ? 'border-green-300 bg-green-50' : 'border-slate-300 hover:border-primary-400 hover:bg-slate-50'
              }`}>
                <input
                  type="file"
                  id="receipt"
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={handleFileChange}
                />
                <label htmlFor="receipt" className="cursor-pointer flex flex-col items-center gap-3">
                  {file ? (
                    <>
                      {filePreview && (
                        <img src={filePreview} alt="Receipt preview" className="max-h-32 rounded-lg shadow-sm" />
                      )}
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="font-medium">{file.name}</span>
                      </div>
                      <span className="text-sm text-slate-500">Click to change file</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-12 h-12 text-slate-400" />
                      <span className="font-medium text-primary-600">Click to upload your receipt</span>
                      <span className="text-sm text-slate-500">JPG, PNG, or PDF — max 4MB</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => { setStep(4); }} className="btn-secondary flex-1">
                Skip for Now
              </button>
              <button type="submit" disabled={!file || isSubmitting} className="btn-primary flex-1 flex justify-center items-center gap-2">
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                ) : (
                  <>Submit Receipt <ChevronRight className="w-4 h-4" /></>
                )}
              </button>
            </div>

            <p className="text-xs text-slate-400 text-center">
              You can also upload your receipt later using the link in your confirmation email.
              Bookings without payment proof will expire after 12 hours.
            </p>
          </form>
        </div>
      )}

      {/* Step 4: Confirmation */}
      {step === 4 && (
        <div className="card text-center py-10">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
          </div>

          <h2 className="heading-2 mb-2">Booking Received!</h2>
          <p className="body-text mb-6">
            {file
              ? "We've received your booking and payment receipt."
              : "We've received your booking. Please complete your bank transfer soon."}
          </p>

          <div className="bg-slate-50 rounded-lg p-6 max-w-sm mx-auto mb-6">
            <p className="text-sm text-slate-500 mb-1">Reference Number</p>
            <p className="font-mono text-2xl font-bold tracking-wider text-slate-900">{reference}</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 max-w-md mx-auto mb-8 text-left">
            <p className="text-sm text-blue-800 font-medium mb-1">What happens next?</p>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>✓ You&apos;ll receive a confirmation email shortly</li>
              <li>✓ We&apos;ll verify your payment within 24 hours</li>
              <li>✓ Once approved, you&apos;ll get class details and the meeting link</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/classes" className="btn-secondary">
              Browse More Classes
            </Link>
            <Link href="/" className="btn-primary">
              Back to Home
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
