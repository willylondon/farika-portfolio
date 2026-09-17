'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQ {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  faqs: FAQ[];
}

export default function FaqAccordion({ faqs }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className="card overflow-hidden">
            <button
              onClick={() => toggleFaq(index)}
              className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
            >
              <h3 className="font-semibold text-lg text-slate-900 pr-8">{faq.question}</h3>
              <ChevronDown className={cn("w-5 h-5 text-slate-500 transition-transform duration-200 flex-shrink-0", isOpen && "rotate-180")} />
            </button>
            <div
              className={cn(
                "px-6 overflow-hidden transition-all duration-300 ease-in-out",
                isOpen ? "max-h-[500px] pb-6 opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
