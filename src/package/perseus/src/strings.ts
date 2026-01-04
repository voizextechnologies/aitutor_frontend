/**
 * Perseus Strings
 * Localized strings for Perseus components
 */

export const strings = {
  en: {
    'check-answer': 'Check Answer',
    'try-again': 'Try Again',
    'next-question': 'Next Question',
    'hint': 'Hint',
    'correct': 'Correct!',
    'incorrect': 'Incorrect',
    'show-solution': 'Show Solution',
    'hide-solution': 'Hide Solution',
  },
};

export const mockStrings = strings;

export function getString(key: string, locale: string = 'en'): string {
  return (strings as any)[locale]?.[key] || key;
}

export default strings;
