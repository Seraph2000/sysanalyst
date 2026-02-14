import { AnalysisMode, ConversationStep } from '@/lib/types';

export interface ModeConfig {
  id: AnalysisMode;
  label: string;
  description: string;
  steps: ConversationStep[];
}

export const ANALYSIS_MODES: ModeConfig[] = [
  {
    id: 'analyse-mvp',
    label: 'Analyse my MVP',
    description: 'Break down what you have built so far and get structured feedback.',
    steps: [
      {
        id: 'what',
        question: 'What are you building?',
        placeholder: 'Describe your MVP in your own words — messy is fine...',
      },
      {
        id: 'who',
        question: 'Who is it for?',
        placeholder: 'Who are your target users? What do they struggle with?',
      },
      {
        id: 'works',
        question: 'What works so far?',
        placeholder: 'What parts are functional? What have you built or prototyped?',
      },
      {
        id: 'stuck',
        question: 'What is confusing you or feels stuck?',
        placeholder: 'Where do you feel uncertain, overwhelmed, or unclear?',
      },
    ],
  },
  {
    id: 'clarify-idea',
    label: 'Clarify my idea',
    description: 'Turn a vague concept into a clear, structured vision.',
    steps: [
      {
        id: 'idea',
        question: 'What is the idea?',
        placeholder: 'Describe your idea however it comes to mind...',
      },
      {
        id: 'why',
        question: 'Why does this matter to you?',
        placeholder: 'What motivated this? What problem did you notice?',
      },
      {
        id: 'exists',
        question: 'Does anything like this exist already?',
        placeholder: 'Any competitors, alternatives, or similar tools you know of?',
      },
      {
        id: 'dream',
        question: 'If it worked perfectly, what would it feel like to use?',
        placeholder: 'Describe the ideal experience for your user...',
      },
    ],
  },
  {
    id: 'what-to-build',
    label: 'What should I build next?',
    description: 'Get clear next steps based on where you are right now.',
    steps: [
      {
        id: 'current',
        question: 'Where are you right now?',
        placeholder: 'What have you built, launched, or prototyped so far?',
      },
      {
        id: 'goal',
        question: 'What is your goal for the next few weeks?',
        placeholder: 'First paying customer? Launch? Feature complete? Validation?',
      },
      {
        id: 'resources',
        question: 'What resources do you have?',
        placeholder: 'Are you solo? Do you have a budget? What skills do you have?',
      },
      {
        id: 'blockers',
        question: 'What feels like it is blocking you?',
        placeholder: 'Too many options? Technical uncertainty? Lack of clarity?',
      },
    ],
  },
  {
    id: 'review-architecture',
    label: 'Review my architecture',
    description: 'Get your technical architecture simplified and assessed.',
    steps: [
      {
        id: 'system',
        question: 'Describe your system or architecture.',
        placeholder: 'Tech stack, components, how things connect — as detailed or rough as you like...',
      },
      {
        id: 'purpose',
        question: 'What is this system supposed to do?',
        placeholder: 'The core job of this architecture...',
      },
      {
        id: 'concerns',
        question: 'What worries you about it?',
        placeholder: 'Complexity? Scalability? Cost? Maintainability?',
      },
      {
        id: 'constraints',
        question: 'Any constraints or non-negotiables?',
        placeholder: 'Budget, existing infrastructure, team skills, time pressure...',
      },
    ],
  },
];

export function getModeConfig(modeId: AnalysisMode): ModeConfig {
  const mode = ANALYSIS_MODES.find((m) => m.id === modeId);
  if (!mode) throw new Error(`Unknown analysis mode: ${modeId}`);
  return mode;
}
