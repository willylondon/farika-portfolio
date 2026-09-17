import { Metadata } from 'next';
import Link from 'next/link';
import { GraduationCap, BookOpen, Globe, Award, PenTool, Search } from 'lucide-react';
import { PROGRAMME_DATA, getProgrammeColor, cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Our Programmes',
  description: 'Comprehensive English tutoring from primary to sixth form in Jamaica. PEP, CSEC, IGCSE, and IB preparation.',
};

const iconMap: Record<string, React.ReactNode> = {
  GraduationCap: <GraduationCap className="h-8 w-8" />,
  BookOpen: <BookOpen className="h-8 w-8" />,
  Globe: <Globe className="h-8 w-8" />,
  Award: <Award className="h-8 w-8" />,
  PenTool: <PenTool className="h-8 w-8" />,
  Search: <Search className="h-8 w-8" />,
};

export default function ProgrammesPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="bg-blue-700 text-white py-16 mb-12">
        <div className="container-main text-center">
          <h1 className="heading-1 font-serif text-white mb-4">Our Programmes</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Comprehensive English and Language Arts tutoring from primary to sixth form, designed to build confidence and mastery.
          </p>
        </div>
      </div>

      <div className="container-main">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROGRAMME_DATA.map((prog) => {
            const color = getProgrammeColor(prog.color || prog.slug);
            return (
              <div key={prog.slug} className={cn("card p-6 flex flex-col h-full border-t-4", color.border)}>
                <div className="flex items-center justify-between mb-4">
                  <div className={color.text}>{iconMap[prog.icon] || <BookOpen className="h-8 w-8" />}</div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded">
                    {prog.examBoard}
                  </span>
                </div>
                <h3 className="heading-3 mb-2">{prog.name}</h3>
                <p className={cn("text-sm font-medium mb-4", color.text)}>{prog.tagline} • Ages {prog.ageRange}</p>
                <p className="body-text flex-grow">{prog.description}</p>
                <Link href={`/programmes/${prog.slug}`} className="mt-6 w-full text-center py-2 border border-blue-600 text-blue-600 rounded-md font-semibold hover:bg-blue-50 transition-colors">
                  View Programme
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
