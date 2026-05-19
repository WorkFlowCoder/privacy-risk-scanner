import {
  PRIVACY_POLICY_KEYWORDS,
  PRIVACY_POLICY_SECTIONS,
  URL_PATTERNS,
} from './patterns';
import { PrivacyPolicyDetectionResult, DetectionFinding } from './types';
import { getLanguagePatterns, LanguagePatterns } from './languages';

export function detectPrivacyPolicy(
  pageContent: string,
  pageUrl: string,
  pageTitle?: string
): PrivacyPolicyDetectionResult {
  const findings: DetectionFinding[] = [];
  let totalScore = 0;

  // Détecte la langue et charge les bons patterns
  const langPatterns = getLanguagePatterns(pageUrl, pageContent, pageTitle);

  // 1. URL Detection
  const urlScore = detectFromUrl(pageUrl, langPatterns);
  if (urlScore.score > 0) {
    findings.push(urlScore);
    totalScore += urlScore.score;
  }

  // 2. Title Detection
  if (pageTitle) {
    const titleScore = detectFromTitle(pageTitle, langPatterns);
    if (titleScore.score > 0) {
      findings.push(titleScore);
      totalScore += titleScore.score;
    }
  }

  // 3. Content Detection
  const contentScore = detectFromContent(pageContent, langPatterns);
  if (contentScore.score > 0) {
    findings.push(contentScore);
    totalScore += contentScore.score;
  }

  // 4. Structure Detection
  const structureScore = detectFromStructure(pageContent, langPatterns);
  if (structureScore.score > 0) {
    findings.push(structureScore);
    totalScore += structureScore.score;
  }

  const confidence = Math.min(100, totalScore);
  const isPrivacyPolicy = confidence >= 50;

  return {
    isPrivacyPolicy,
    confidence,
    findings,
    summary: generateSummary(isPrivacyPolicy, confidence, findings),
  };
}

function detectFromUrl(url: string, langPatterns: LanguagePatterns): DetectionFinding {
  // Strong match: known privacy URL patterns
  if (langPatterns.urlPatterns.some((pattern: RegExp) => pattern.test(url))) {
    return {
      type: 'url',
      score: 35,
      reason: 'URL matches known privacy policy patterns',
      details: [url],
    };
  }

  // Weak match: contains privacy-related keywords
  if (URL_PATTERNS.pathVariations.test(url)) {
    return {
      type: 'url',
      score: 15,
      reason: 'URL contains privacy-related keywords',
      details: [url],
    };
  }

  return { type: 'url', score: 0, reason: 'No privacy indicators in URL' };
}

function detectFromTitle(title: string, langPatterns: LanguagePatterns): DetectionFinding {
  const lowerTitle = title.toLowerCase();
  const matchedKeywords = langPatterns.keywords.filter((kw: string) =>
    lowerTitle.includes(kw.toLowerCase())
  );

  if (matchedKeywords.length > 0) {
    return {
      type: 'title',
      score: Math.min(25, matchedKeywords.length * 8),
      reason: `Title contains privacy-related keywords`,
      details: matchedKeywords.slice(0, 3),
    };
  }

  return { type: 'title', score: 0, reason: 'No privacy indicators in title' };
}

function detectFromContent(content: string, langPatterns: LanguagePatterns): DetectionFinding {
  const lowerContent = content.toLowerCase();
  const matchedKeywords = langPatterns.keywords.filter((kw: string) =>
    lowerContent.includes(kw.toLowerCase())
  );

  if (matchedKeywords.length === 0) {
    return { type: 'content', score: 0, reason: 'No privacy keywords found' };
  }

  const contentLength = content.length;
  const keywordDensity = (matchedKeywords.length / (contentLength / 1000)) * 10;
  const score = Math.min(50, 15 + keywordDensity);

  return {
    type: 'content',
    score,
    reason: `Found ${matchedKeywords.length} privacy-related keywords in content`,
    details: Array.from(new Set(matchedKeywords)).slice(0, 5),
  };
}

function detectFromStructure(content: string, langPatterns: LanguagePatterns): DetectionFinding {
  const lowerContent = content.toLowerCase();
  const matchedSections = langPatterns.sections.filter((section: string) =>
    lowerContent.includes(section.toLowerCase())
  );

  if (matchedSections.length === 0) {
    return {
      type: 'structure',
      score: 0,
      reason: 'No typical privacy policy sections found',
    };
  }

  const score = Math.min(35, matchedSections.length * 4);

  return {
    type: 'structure',
    score,
    reason: `Found ${matchedSections.length} typical privacy policy sections`,
    details: Array.from(new Set(matchedSections)).slice(0, 5),
  };
}

function generateSummary(
  isPrivacyPolicy: boolean,
  confidence: number,
  findings: DetectionFinding[]
): string {
  if (isPrivacyPolicy) {
    return `This appears to be a privacy policy document (${confidence}% confidence). Found ${findings.length} detection indicators.`;
  }
  return `This does not appear to be a privacy policy document (${confidence}% confidence).`;
}
