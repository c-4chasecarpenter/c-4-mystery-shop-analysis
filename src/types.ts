export interface VehicleInfo {
  year: string;
  make: string;
  model: string;
  trim: string;
}

export interface BaseChannelDetails {
  timestamp: string;
  minutesElapsed: number;
  passedTarget: boolean;
}

export interface Channels {
  text: BaseChannelDetails;
  autoEmail: BaseChannelDetails;
  phoneCall: BaseChannelDetails;
  personalEmail: BaseChannelDetails;
}

export interface MessageContent {
  sender?: string;
  recipient?: string;
  subject?: string;
  date?: string;
  body: string;
}

export interface Messages {
  autoEmail: MessageContent;
  personalEmail: MessageContent;
  textMessage: MessageContent & { senderPhone?: string };
  phoneCall: { timestamp: string; duration: string; details?: string };
}

export interface QualityCriterion {
  name: string;
  score: number;
  maxScore: number;
  description: string;
}

export interface DealerScores {
  responseSpeed: number;
  autoEmailQuality: number;
  personalEmailQuality: number;
  textQuality: number;
  callResponse: number;
}

export interface Finding {
  type: 'positive' | 'negative' | 'neutral';
  text: string;
}

export interface ChannelFindings {
  autoEmail: Finding[];
  personalEmail: Finding[];
  textMessage: Finding[];
  phoneCall: Finding[];
}

export interface ResponseQuality {
  autoEmailPersonalization: string;
  autoEmailVehicleDetail: string;
  autoEmailCtaQuality: string;
  textPersonalization: string;
  textContentValue: string;
  personalEmailReceived: string;
  grammarSpelling: string;
  overallSpeedRating: string;
}

export interface DealershipData {
  dealershipName: string;
  shopperName: string;
  submissionTimestamp: string;
  vehicle: VehicleInfo;
  vin?: string;
  websiteUrl?: string;
  passed: boolean;
  channels: Channels;
  messages: Messages;
  scores: DealerScores;
  findings: ChannelFindings;
  customerQuestion?: string;
  responseQuality?: ResponseQuality;
}

export interface Takeaway {
  priority: 'Critical' | 'Overhaul Needed' | 'Process Gap' | 'Bright Spot' | 'Quick Fix';
  emoji: string;
  title: string;
  description: string;
  fullWidth?: boolean;
}

export interface MysteryShopReport {
  client: DealershipData;
  competitor: DealershipData;
  takeaways: Takeaway[];
  metadata: {
    analysisDate: string;
    notes?: string;
  };
}
