'use client';

import { useState } from 'react';
import { submitContact } from '@/actions/contact';
import { Send } from 'lucide-react';

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess('');
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    };

    const result = await submitContact(data);
    
    setIsSubmitting(false);
    if (result.success) {
      setSuccess(result.message || 'Success');
      (e.target as HTMLFormElement).reset();
    } else {
      setError(result.error || 'Error');
    }
  }

  return (
    <div className="card p-8 shadow-md">
      <h2 className="heading-3 mb-6">Send us a Message</h2>
      
      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md border border-green-200">
          {success}
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="label-text">Full Name *</label>
          <input type="text" id="name" name="name" required className="input-field" placeholder="Jane Doe" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="email" className="label-text">Email Address *</label>
            <input type="email" id="email" name="email" required className="input-field" placeholder="jane@example.com" />
          </div>
          <div>
            <label htmlFor="phone" className="label-text">Phone Number</label>
            <input type="tel" id="phone" name="phone" className="input-field" placeholder="(876) 555-0123" />
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="label-text">Subject *</label>
          <input type="text" id="subject" name="subject" required className="input-field" placeholder="Inquiry about PEP Programme" />
        </div>

        <div>
          <label htmlFor="message" className="label-text">Message *</label>
          <textarea id="message" name="message" required rows={5} className="input-field resize-none" placeholder="How can we help you?"></textarea>
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full flex items-center justify-center gap-2">
          {isSubmitting ? 'Sending...' : (
            <>Send Message <Send className="w-4 h-4" /></>
          )}
        </button>
      </form>
    </div>
  );
}
