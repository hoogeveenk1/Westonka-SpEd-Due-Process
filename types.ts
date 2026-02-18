
export enum StudentGroup {
  K12 = 'k12',
  BIRTH_TO_3 = 'birth_to_3'
}

export interface PlaybookSection {
  id: string;
  title: string;
  icon: string;
  description: string;
  group: StudentGroup;
  content: string[];
  checklists: string[];
  timelines: { label: string; duration: string }[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum AppRoute {
  DASHBOARD = 'dashboard',
  PLAYBOOK = 'playbook',
  ASSISTANT = 'assistant',
  RESOURCES = 'resources'
}
