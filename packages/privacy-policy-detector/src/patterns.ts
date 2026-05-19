// All patterns are now managed in languages.ts
// This file is kept for backward compatibility but uses the language system

import { getAllKeywords, getAllSections, LANGUAGES } from './languages';

export const PRIVACY_POLICY_KEYWORDS = getAllKeywords();
export const PRIVACY_POLICY_SECTIONS = getAllSections();

export const URL_PATTERNS = {
  privacy: /\/(privacy|legal|terms|confidentiality|cookie|data-protection|gdpr|politique|protection|donnees|datenschutz|privacidad|protezione|dati)(?:\/|\.html|$|\?)/i,
  pathVariations: /\b(privacy|policy|terms|legal|data-protection|confidentiality|gdpr|ccpa|cookie|politique|protection|donnees|datenschutz|privacidad|protezione|dati)\b/i,
};

// Multi-language common sections
export const COMMON_PRIVACY_POLICY_SECTIONS_LIST = {
  en: LANGUAGES.en.sections,
  fr: LANGUAGES.fr.sections,
  es: LANGUAGES.es.sections,
  de: LANGUAGES.de.sections,
  it: LANGUAGES.it.sections,
};
