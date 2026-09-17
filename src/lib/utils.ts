import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amountJMD: number): string {
  return new Intl.NumberFormat('en-JM', {
    style: 'currency',
    currency: 'JMD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amountJMD);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-JM', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export function generateReferenceNumber(): string {
  const prefix = 'TEL';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function getSeatsRemaining(capacity: number, enrolledCount: number): number {
  return Math.max(0, capacity - enrolledCount);
}

export function getSeatUrgency(remaining: number): 'available' | 'low' | 'full' {
  if (remaining <= 0) return 'full';
  if (remaining <= 2) return 'low';
  return 'available';
}

const slugToColorMap: Record<string, string> = {
  'pep-language-arts': 'green',
  'csec-english-a': 'blue',
  'igcse-english-language': 'purple',
  'ib-english': 'red',
  'essay-writing': 'amber',
  'comprehension-skills': 'teal',
};

export function getProgrammeColor(colorOrSlug: string): {
  bg: string;
  text: string;
  badge: string;
  border: string;
} {
  const resolvedColor = slugToColorMap[colorOrSlug] || colorOrSlug;
  const colors: Record<string, { bg: string; text: string; badge: string; border: string }> = {
    green: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      badge: 'bg-green-100 text-green-800',
      border: 'border-green-500',
    },
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      badge: 'bg-blue-100 text-blue-800',
      border: 'border-blue-500',
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      badge: 'bg-purple-100 text-purple-800',
      border: 'border-purple-500',
    },
    red: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      badge: 'bg-red-100 text-red-800',
      border: 'border-red-500',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      badge: 'bg-amber-100 text-amber-800',
      border: 'border-amber-500',
    },
    teal: {
      bg: 'bg-teal-50',
      text: 'text-teal-700',
      badge: 'bg-teal-100 text-teal-800',
      border: 'border-teal-500',
    },
  };
  return colors[resolvedColor] || colors.blue;
}

export function getStatusBadge(status: string): { bg: string; text: string; label: string } {
  const statuses: Record<string, { bg: string; text: string; label: string }> = {
    PENDING_PAYMENT: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending Payment' },
    RECEIPT_UPLOADED: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Receipt Uploaded' },
    CONFIRMED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Confirmed' },
    CANCELLED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' },
    EXPIRED: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Expired' },
  };
  return statuses[status] || statuses.PENDING_PAYMENT;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export interface ProgrammeInfo {
  slug: string;
  name: string;
  tagline: string;
  examBoard: string;
  ageRange: string;
  color: string;
  icon: string;
  description: string;
  curriculum: readonly string[];
  features: readonly string[];
}

export const PROGRAMME_DATA: readonly ProgrammeInfo[] = [
  {
    slug: 'pep-language-arts',
    name: 'PEP Language Arts',
    tagline: 'Build a strong foundation for the Primary Exit Profile',
    examBoard: 'Ministry of Education, Jamaica',
    ageRange: 'Grades 4–6 (Ages 9–12)',
    color: 'green',
    icon: 'GraduationCap',
    description: `The Primary Exit Profile (PEP) determines your child's placement into Jamaica's top traditional high schools. Our PEP Language Arts programme covers all three components — the Ability Test, the Curriculum-Based Test (CBT), and Performance Tasks — with expert guidance from teachers who understand the marking scheme.\n\nWe focus on building the critical thinking, reading comprehension, and writing skills that the PEP assessments demand. Students work through real past-paper-style questions, develop strong vocabulary, and master the structured composition format required for top scores.`,
    curriculum: [
      'Ability Test verbal reasoning and analogies',
      'CBT reading comprehension and inference',
      'Grammar, punctuation, and vocabulary building',
      'Structured composition writing',
      'Performance Task analysis and response',
      'Past paper practice with examiner-level feedback',
    ],
    features: [
      'Ability Test verbal reasoning and analogies',
      'CBT reading comprehension and inference',
      'Grammar, punctuation, and vocabulary building',
      'Structured composition writing',
      'Performance Task analysis and response',
      'Past paper practice with examiner-level feedback',
    ],
  },
  {
    slug: 'csec-english-a',
    name: 'CSEC English A',
    tagline: 'Master Paper 01, Paper 02, and SBA with confidence',
    examBoard: 'Caribbean Examinations Council (CXC)',
    ageRange: 'Grades 10–11 (Ages 15–17)',
    color: 'blue',
    icon: 'BookOpen',
    description: `A Grade I or II in CSEC English A is the gateway to sixth form, university, and professional opportunity across the Caribbean. Our programme systematically prepares students for every component of the exam — from the 60-item multiple-choice Paper 01 to the demanding four-section Paper 02.\n\nWe provide intensive practice in summary writing, reading comprehension, narrative/descriptive writing, and persuasive/argumentative essays. Students also receive structured SBA portfolio guidance, including topic development, artifact creation, reflective writing, and oral presentation coaching.`,
    curriculum: [
      'Paper 01: Grammar, usage, vocabulary, and comprehension MCQs',
      'Paper 02 Section A: Summary writing (120–150 words)',
      'Paper 02 Section B: Reading comprehension and textual analysis',
      'Paper 02 Section C: Narrative and descriptive writing',
      'Paper 02 Section D: Persuasive and argumentative essays',
      'SBA portfolio: Plan of Investigation, Artifacts, Reflections, Oral',
    ],
    features: [
      'Paper 01: Grammar, usage, vocabulary, and comprehension MCQs',
      'Paper 02 Section A: Summary writing (120–150 words)',
      'Paper 02 Section B: Reading comprehension and textual analysis',
      'Paper 02 Section C: Narrative and descriptive writing',
      'Paper 02 Section D: Persuasive and argumentative essays',
      'SBA portfolio: Plan of Investigation, Artifacts, Reflections, Oral',
    ],
  },
  {
    slug: 'igcse-english-language',
    name: 'IGCSE English Language',
    tagline: 'Excel in Cambridge First Language English',
    examBoard: 'Cambridge Assessment International Education',
    ageRange: 'Grades 10–11 (Ages 14–16)',
    color: 'purple',
    icon: 'Globe',
    description: `Our IGCSE English Language programme prepares students for Cambridge First Language English (0500), developing the analytical reading and polished writing skills that distinguish top candidates.\n\nStudents learn to dissect writer's effect questions, synthesise information from multiple texts, produce directed writing in varied formats (reports, articles, speeches, letters), and craft compelling narrative and descriptive compositions. Every lesson includes timed practice under exam conditions.`,
    curriculum: [
      'Paper 1: Reading — comprehension, summary, and writer\'s effect',
      'Paper 2: Directed Writing and Composition',
      'Analysis of language techniques and rhetorical devices',
      'Synthesis and comparison across multiple texts',
      'Directed writing: reports, articles, speeches, letters',
      'Narrative and descriptive composition under timed conditions',
    ],
    features: [
      'Paper 1: Reading — comprehension, summary, and writer\'s effect',
      'Paper 2: Directed Writing and Composition',
      'Analysis of language techniques and rhetorical devices',
      'Synthesis and comparison across multiple texts',
      'Directed writing: reports, articles, speeches, letters',
      'Narrative and descriptive composition under timed conditions',
    ],
  },
  {
    slug: 'ib-english',
    name: 'IB English',
    tagline: 'Navigate Language A with analytical rigour',
    examBoard: 'International Baccalaureate',
    ageRange: 'Grades 12–13 (Ages 16–19)',
    color: 'red',
    icon: 'Award',
    description: `The IB Diploma demands sophisticated literary analysis and independent critical thinking. Our IB English programme supports students in both Language A: Literature and Language A: Language and Literature at Standard and Higher Level.\n\nWe guide students through the Individual Oral, Paper 1 guided textual analysis, Paper 2 comparative essays, and the HL Essay research paper. Students develop the academic register, thesis construction, and textual analysis skills that earn top marks.`,
    curriculum: [
      'Individual Oral (IO): Global Issue exploration',
      'Paper 1: Guided textual analysis of unseen texts',
      'Paper 2: Comparative literary essay',
      'HL Essay: 1,200–1,500-word academic research paper',
      'Close reading and literary analysis techniques',
      'Academic writing conventions and thesis development',
    ],
    features: [
      'Individual Oral (IO): Global Issue exploration',
      'Paper 1: Guided textual analysis of unseen texts',
      'Paper 2: Comparative literary essay',
      'HL Essay: 1,200–1,500-word academic research paper',
      'Close reading and literary analysis techniques',
      'Academic writing conventions and thesis development',
    ],
  },
  {
    slug: 'essay-writing',
    name: 'Essay Writing',
    tagline: 'Master every essay type with structure and style',
    examBoard: 'All Levels',
    ageRange: 'Grades 4–13 (Ages 9–19)',
    color: 'amber',
    icon: 'PenTool',
    description: `Strong essay writing is the single most transferable skill across all English examinations. Our essay writing programme takes students from basic paragraph construction to sophisticated multi-paragraph compositions.\n\nStudents learn the architecture of narrative, descriptive, persuasive, argumentative, and expository essays. Every session includes guided planning, drafting, and self-editing with detailed feedback on structure, language, and mechanics.`,
    curriculum: [
      'Paragraph structure and topic sentences',
      'Narrative essay: plot, character, setting, dialogue',
      'Descriptive essay: sensory detail and figurative language',
      'Persuasive essay: rhetorical techniques and counterargument',
      'Argumentative essay: thesis, evidence, and analysis',
      'Self-editing, proofreading, and revision strategies',
    ],
    features: [
      'Paragraph structure and topic sentences',
      'Narrative essay: plot, character, setting, dialogue',
      'Descriptive essay: sensory detail and figurative language',
      'Persuasive essay: rhetorical techniques and counterargument',
      'Argumentative essay: thesis, evidence, and analysis',
      'Self-editing, proofreading, and revision strategies',
    ],
  },
  {
    slug: 'comprehension-skills',
    name: 'Comprehension Skills',
    tagline: 'Read critically, think deeply, answer precisely',
    examBoard: 'All Levels',
    ageRange: 'Grades 4–13 (Ages 9–19)',
    color: 'teal',
    icon: 'Search',
    description: `Comprehension is the foundation of every English exam. Our programme develops students' ability to read critically, identify main ideas, make inferences, analyse author purpose, and construct precise written responses.\n\nUsing texts from a wide range of genres and difficulty levels, students build the reading stamina and analytical skills needed for PEP, CSEC, IGCSE, and IB examinations. Every session includes timed practice with mark-scheme-aligned feedback.`,
    curriculum: [
      'Literal comprehension: fact-finding and recall',
      'Inferential comprehension: reading between the lines',
      'Evaluative comprehension: judging purpose and bias',
      'Summary writing techniques',
      'Vocabulary in context',
      'Answering techniques: PEE (Point, Evidence, Explanation)',
    ],
    features: [
      'Literal comprehension: fact-finding and recall',
      'Inferential comprehension: reading between the lines',
      'Evaluative comprehension: judging purpose and bias',
      'Summary writing techniques',
      'Vocabulary in context',
      'Answering techniques: PEE (Point, Evidence, Explanation)',
    ],
  },
] as const;

export const PROGRAMME_MAP = PROGRAMME_DATA.reduce<Record<string, ProgrammeInfo>>((acc, item) => {
  acc[item.slug] = item;
  return acc;
}, {});

export function getProgrammeBySlug(slug: string): ProgrammeInfo | undefined {
  return PROGRAMME_MAP[slug];
}
