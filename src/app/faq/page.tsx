import { Metadata } from 'next';
import FaqAccordion from '@/components/FaqAccordion';

export const metadata: Metadata = {
  title: 'FAQ | The English Language',
  description: 'Frequently asked questions about our online English lessons, pricing, programmes, and payment methods.',
};

const faqs = [
  {
    question: "How do online lessons work?",
    answer: "Our classes are conducted live via Zoom or Google Meet. We keep our groups small to ensure interactive and engaging sessions where every student can participate and receive personalized attention."
  },
  {
    question: "What programmes do you offer?",
    answer: "We offer comprehensive tutoring for CSEC English A, CSEC English B (Literature in English), IGCSE First Language English, IB English A (Literature and Language & Literature), Advanced Essay Writing workshops, and Analytical Comprehension skills building."
  },
  {
    question: "How large are the classes?",
    answer: "We strictly limit our classes to a maximum of 8 students per group. This ensures that the educator can dedicate enough time to each student's specific needs and questions."
  },
  {
    question: "How much do lessons cost?",
    answer: "Pricing varies by programme and level. Please check our Classes page for detailed pricing information for each specific group session."
  },
  {
    question: "How do I pay?",
    answer: "Payments are made via bank transfer to our NCB account. Once you make a transfer, you simply upload a screenshot or photo of the receipt through your student dashboard to verify payment."
  },
  {
    question: "Which banks do you accept transfers from?",
    answer: "Our primary account is with NCB, but we accept transfers from any local bank including BNS/Scotiabank, JN Bank, and CIBC FirstCaribbean via the RTGS or ACH networks."
  },
  {
    question: "How quickly are payments verified?",
    answer: "We aim to verify all submitted payment receipts within 24 hours. You will receive an email confirmation once your payment has been processed and your class seat is confirmed."
  },
  {
    question: "What if my child needs to miss a class?",
    answer: "We require at least 24 hours' notice for cancellations. If proper notice is given, we will do our best to provide lesson materials and recordings (if applicable) so your child doesn't fall behind."
  },
  {
    question: "Do you offer one-on-one tutoring?",
    answer: "Yes, we do offer private one-on-one sessions based on availability. Please contact us directly via email or WhatsApp to discuss your specific needs and schedule."
  },
  {
    question: "How do I know if my child is making progress?",
    answer: "We conduct regular assessments and provide detailed progress updates to parents. Our educators maintain open lines of communication to discuss your child's development."
  },
  {
    question: "What materials do students need?",
    answer: "Students will need a notebook, pens, a stable internet connection, and a device (laptop or tablet preferred) with a working camera and microphone for interactive participation."
  },
  {
    question: "Can my child try a class before committing?",
    answer: "We occasionally offer trial sessions depending on seat availability. Please reach out to our team to discuss trial options for your preferred programme."
  }
];

export default function FAQPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return (
    <main className="container-main section-padding">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="heading-1 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-slate-600">
            Find answers to common questions about our programmes and operations.
          </p>
        </div>
        
        <FaqAccordion faqs={faqs} />
        
        <div className="mt-12 text-center p-8 bg-blue-50 rounded-2xl border border-blue-100">
          <h3 className="heading-3 text-blue-900 mb-2">Still have questions?</h3>
          <p className="text-blue-800 mb-6">We&apos;re here to help! Reach out to our team directly.</p>
          <a href="/contact" className="btn-primary inline-block">Contact Us</a>
        </div>
      </div>
    </main>
  );
}
