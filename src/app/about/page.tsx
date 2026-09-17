import { Metadata } from 'next';
import Link from 'next/link';
import { Users, Target, MessageSquare, Heart, GraduationCap, Award, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About | The English Language',
  description: 'Learn about our teaching philosophy, methodology, and experienced educators dedicated to student success in English.',
};

export default function AboutPage() {
  return (
    <main>
      <section className="bg-slate-900 text-white py-20">
        <div className="container-main text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">About The English Language</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Empowering students across Jamaica to master the English language and achieve academic excellence.
          </p>
        </div>
      </section>

      <div className="container-main section-padding">
        <section className="mb-24 flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/3">
            <div className="aspect-square bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-slate-200">
              <div className="text-slate-400 flex flex-col items-center">
                <Users className="w-24 h-24 mb-4 opacity-50" />
                <span className="text-lg font-medium">Head Educator</span>
              </div>
            </div>
          </div>
          <div className="w-full md:w-2/3">
            <h2 className="heading-2 mb-2">Meet Our Lead Educator</h2>
            <p className="text-blue-600 font-medium mb-6">BA English, MA Education • 10+ Years Experience</p>
            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                &quot;My teaching philosophy centers on the belief that every student has the potential to excel in English when provided with the right structure, support, and encouragement. I focus on building strong foundational skills while developing critical thinking abilities essential for higher-level exams.&quot;
              </p>
            </div>
            
            <div className="mt-8">
              <h3 className="font-semibold text-slate-900 mb-4">Specializations</h3>
              <div className="flex flex-wrap gap-2">
                {['CSEC English A & B', 'CAPE Literatures', 'IB English A', 'Creative Writing', 'Comprehension Strategies'].map(spec => (
                  <span key={spec} className="badge bg-blue-50 text-blue-700 border border-blue-200">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mb-24">
          <h2 className="heading-2 text-center mb-12">Our Approach</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card p-6 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="heading-3 mb-2">Small Groups</h3>
              <p className="text-slate-600">Maximum 8 students per class ensures personalized attention and targeted feedback.</p>
            </div>
            <div className="card p-6 text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="heading-3 mb-2">Exam-Focused</h3>
              <p className="text-slate-600">Methodologies tailored specifically to CSEC, CAPE, and IB examination requirements.</p>
            </div>
            <div className="card p-6 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="heading-3 mb-2">Parent Updates</h3>
              <p className="text-slate-600">Regular progress reports and open communication channels with parents.</p>
            </div>
            <div className="card p-6 text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="heading-3 mb-2">Supportive Space</h3>
              <p className="text-slate-600">An encouraging environment where students feel confident to express ideas and ask questions.</p>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 rounded-3xl p-12 mb-20 text-center border border-slate-200">
          <h2 className="heading-2 mb-10">Qualifications & Experience</h2>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-xl shadow-sm border border-slate-100">
              <GraduationCap className="text-blue-600 w-6 h-6" />
              <span className="font-medium text-slate-800">Master of Arts in Education</span>
            </div>
            <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-xl shadow-sm border border-slate-100">
              <BookOpen className="text-blue-600 w-6 h-6" />
              <span className="font-medium text-slate-800">BA English Literature</span>
            </div>
            <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-xl shadow-sm border border-slate-100">
              <Award className="text-blue-600 w-6 h-6" />
              <span className="font-medium text-slate-800">Certified Educator</span>
            </div>
          </div>
        </section>

        <section className="text-center">
          <h2 className="heading-2 mb-6">Ready to start your journey?</h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Join hundreds of successful students who have improved their grades and confidence with our structured programmes.
          </p>
          <Link href="/classes" className="btn-primary text-lg px-8 py-4">
            Book a session with us
          </Link>
        </section>
      </div>
    </main>
  );
}
