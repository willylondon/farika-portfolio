import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="container-main mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="text-xl font-bold text-blue-700 font-serif">
              The English Language
            </Link>
            <p className="mt-4 text-sm text-slate-600">
              Expert English & Language Arts Tutoring in Jamaica
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-blue-600">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-600">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-600">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-slate-900 uppercase">Programmes</h3>
            <ul className="mt-4 space-y-4 text-sm text-slate-600">
              <li><Link href="/programmes/csec-english-b" className="hover:text-blue-600">CSEC English B (Literature)</Link></li>
              <li><Link href="/programmes/csec-english-a" className="hover:text-blue-600">CSEC English A</Link></li>
              <li><Link href="/programmes/igcse-english-language" className="hover:text-blue-600">IGCSE English</Link></li>
              <li><Link href="/programmes/ib-english" className="hover:text-blue-600">IB English</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider text-slate-900 uppercase">Resources</h3>
            <ul className="mt-4 space-y-4 text-sm text-slate-600">
              <li><Link href="/blog" className="hover:text-blue-600">Blog</Link></li>
              <li><Link href="/faq" className="hover:text-blue-600">FAQ</Link></li>
              <li><Link href="/testimonials" className="hover:text-blue-600">Testimonials</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider text-slate-900 uppercase">Company</h3>
            <ul className="mt-4 space-y-4 text-sm text-slate-600">
              <li><Link href="/about" className="hover:text-blue-600">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600">Contact</Link></li>
            </ul>
            <div className="mt-6 text-sm text-slate-600 space-y-1">
              <p><a href="mailto:farikaatkins@gmail.com" className="hover:text-blue-600">farikaatkins@gmail.com</a></p>
              <p><a href="tel:+18762952776" className="hover:text-blue-600">+1 (876) 295-2776</a></p>
              <p className="pt-2">
                <a href="https://farikaatkins.online" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                  Farika Atkins Portfolio &rarr;
                </a>
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-12 border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-slate-400">
            &copy; {currentYear} The English Language. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
