export interface Hexagram {
  id: number;
  name: string; // Chinese Name e.g. 乾为天
  pinyin: string; // e.g. Qián wéi Tiān
  english: string; // e.g. The Creative
  structure: number[]; // 0 for broken, 1 for solid (bottom to top)
  tag?: string; // e.g. 上上卦
  judgment: string; // The main text (卦辞)
  lines: string[]; // Line interpretations (爻辞)
  image?: string; // Optional specific artistic image
}

export enum DivinationTopic {
  CAREER = 'career',
  HEALTH = 'health',
  WEALTH = 'wealth',
  RELATIONSHIPS = 'relationships',
}

export enum DivinationContext {
  PROSPERITY = 'prosperity', // 顺境
  STABLE = 'stable',         // 平境
  ADVERSITY = 'adversity',   // 逆境
}

export interface DivinationRecord {
  id: string;
  timestamp: number;
  topicId: DivinationTopic;
  query: string;
  context: DivinationContext;
  hexagramId: number;
}

export interface NavItem {
  label: string;
  subLabel: string;
  icon: string;
  path: string;
}