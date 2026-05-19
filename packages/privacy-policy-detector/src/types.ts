export interface DetectionFinding {
  type: 'url' | 'title' | 'content' | 'structure';
  score: number;
  reason: string;
  details?: string[];
}

export interface PrivacyPolicyDetectionResult {
  isPrivacyPolicy: boolean;
  confidence: number;
  findings: DetectionFinding[];
  summary: string;
}
