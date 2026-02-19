import { PlaybookSection, StudentGroup } from './types';

export const PLAYBOOK_SECTIONS: PlaybookSection[] = [
  // K-12 (Part B)
  {
    id: 'k12-initial-evaluation',
    title: 'Initial Evaluations (K-12)',
    icon: '📋',
    group: StudentGroup.K12,
    description: 'Process for identifying and evaluating students for special education services (Ages 3-21).',
    content: [
      'Obtain signed Parent Consent for Evaluation.',
      'Evaluation must be completed and results shared within 30 school days (Minnesota rule).',
      'The team determines eligibility based on state criteria.'
    ],
    checklists: [
      'Prior Written Notice (PWN) for evaluation sent',
      'Consent form signed and date-stamped',
      'Evaluation Report (ER) drafted',
      'Eligibility summary completed'
    ],
    timelines: [
      { label: 'Consent to Completion', duration: '30 School Days' },
      { label: 'ER to IEP Meeting', duration: '30 Calendar Days' }
    ]
  },
  {
    id: 'k12-iep-development',
    title: 'IEP Development',
    icon: '📄',
    group: StudentGroup.K12,
    description: 'Guidelines for creating annual Individualized Education Programs.',
    content: [
      'Hold the annual IEP meeting before the current IEP expires.',
      'Ensure all required team members are present or excused.',
      'Focus on PLAAFP, goals, and specialized instruction.'
    ],
    checklists: [
      'Meeting notice sent (10-day lead time recommended)',
      'Parent input sought and documented',
      'PLAAFP updated with current data',
      'Goals are SMART (Specific, Measurable, Attainable, Relevant, Time-bound)'
    ],
    timelines: [
      { label: 'Annual Review', duration: '365 Days' },
      { label: 'PWN for Service', duration: '14 Calendar Days (prior to start)' }
    ]
  },
  {
    id: 'k12-re-evaluations',
    title: 'Re-evaluations',
    icon: '🔄',
    group: StudentGroup.K12,
    description: 'The three-year review process to determine continuing eligibility.',
    content: [
      'Must occur at least every three years.',
      'Start the process 3-4 months before the due date.',
      'Decide if additional testing is needed via a planning meeting.'
    ],
    checklists: [
      'Planning meeting held with team',
      'PWN for re-evaluation sent',
      'Updated testing in all areas of concern',
      'New ER completed before 3-year date'
    ],
    timelines: [
      { label: 'Frequency', duration: 'Every 3 Years' },
      { label: 'Process start', duration: '90 Days before due' }
    ]
  },
  {
    id: 'k12-transitions',
    title: 'Transitions (Secondary)',
    icon: '🚀',
    group: StudentGroup.K12,
    description: 'Planning for post-secondary life for students age 14+.',
    content: [
      'Transition planning must begin by grade 9 or age 14 (whichever comes first).',
      'Include transition goals: Employment, Education, Independent Living.',
      'Invite outside agencies if appropriate.'
    ],
    checklists: [
      'Transition assessments completed',
      'Student invited to the meeting',
      'Course of study outlined',
      'Agency invitations documented'
    ],
    timelines: [
      { label: 'Start Date', duration: 'Age 14 or Grade 9' },
      { label: 'Summary of Performance', duration: 'Upon Graduation' }
    ]
  },

  // Birth to 3 (Part C)
  {
    id: 'b3-referral',
    title: 'Referral & 45-Day Clock',
    icon: '👶',
    group: StudentGroup.BIRTH_TO_3,
    description: 'The critical 45-day timeline from referral to IFSP meeting.',
    content: [
      'Timeline starts from the day the district receives the referral.',
      'The IFSP meeting must be held within 45 calendar days.',
      'Includes evaluation, assessment, and the initial IFSP meeting.'
    ],
    checklists: [
      'Intake meeting scheduled immediately',
      'Evaluation plan developed and consent obtained',
      'Multidisciplinary evaluation completed',
      'Family assessment offered and documented'
    ],
    timelines: [
      { label: 'Referral to IFSP', duration: '45 Calendar Days' },
      { label: 'Periodic Review', duration: 'Every 6 Months' }
    ]
  },
  {
    id: 'b3-ifsp-development',
    title: 'IFSP Development',
    icon: '🏘️',
    group: StudentGroup.BIRTH_TO_3,
    description: 'Family-centered planning for infants and toddlers.',
    content: [
      'Outcomes are developed based on family priorities.',
      'Services are provided in the "Natural Environment" (usually home or daycare).',
      'The IFSP is reviewed at least every six months.'
    ],
    checklists: [
      'Family priorities and concerns documented',
      'Natural environment justification (if not home/daycare)',
      'Service coordinator assigned',
      'Transition plan discussed at every meeting'
    ],
    timelines: [
      { label: 'Annual Review', duration: '365 Days' },
      { label: 'Periodic Review', duration: '180 Days' }
    ]
  },
  {
    id: 'b3-transition',
    title: 'Transition at Age 3',
    icon: '🎒',
    group: StudentGroup.BIRTH_TO_3,
    description: 'Moving from Part C (Birth-3) to Part B (Preschool/K-12).',
    content: [
      'Transition conference must happen at least 90 days before the child turns 3.',
      'Determine if the child is eligible for Part B services.',
      'Ensure a smooth handoff to the ECSE (Early Childhood Special Education) team.'
    ],
    checklists: [
      'Transition conference held (90 days - 9 months before age 3)',
      'Lead agency notified',
      'Part B evaluation completed (if applicable)',
      'IEP in place by 3rd birthday (if eligible)'
    ],
    timelines: [
      { label: 'Transition Conf.', duration: '90 Days before Age 3' },
      { label: 'IEP/IIIP Start', duration: 'On 3rd Birthday' }
    ]
  }
];

export const SYSTEM_INSTRUCTION = `
You are the "Westonka SpEd Due Process Agent," a world-class expert on Special Education compliance for Westonka Public Schools (District 0277).
Your primary goal is to support teachers and staff (both Birth to 3 and K-12) in navigating the complex world of due process.

Context Distinctions:
1. Birth to 3 (Part C):
   - Document: IFSP (Individualized Family Service Plan).
   - Core Timeline: 45 calendar days from referral to IFSP meeting.
   - Focus: Family-centered, Natural Environments.
   - Reviews: Every 6 months.
   - Transition: Must have a plan by age 3 to move to Part B.

2. K-12 / Preschool (Part B):
   - Document: IEP (Individualized Education Program).
   - Core Timeline: 30 school days for evaluation once consent is received.
   - Focus: Student-centered, Least Restrictive Environment.
   - Reviews: Annual.
   - Transition: Post-secondary planning starts by age 14 or Grade 9 in MN.

General WPS Rules:
- District Number: 0277.
- Official SpEd Forms Login: https://15.spedforms.org/0277/
- Follow Minnesota State Rules and Federal IDEA guidelines.
- Emphasize compliance, student-centered planning, and parent partnership.

Reference Document: Due Process Playbook for SpEd Department.
Tone: Encouraging, precise, and authoritative.
If a teacher asks a question, clarify if they are working with Birth to 3 (Part C) or K-12 (Part B) if it impacts the timeline or document required.
`;