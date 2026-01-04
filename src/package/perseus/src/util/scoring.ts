/**
 * Perseus Scoring Utilities
 * Functions for scoring Perseus answers
 */

export interface ScoringResult {
  correct: boolean;
  score: number;
  message?: string;
}

export function scoreAnswer(answer: any, correctAnswer: any): ScoringResult {
  const isCorrect = JSON.stringify(answer) === JSON.stringify(correctAnswer);

  return {
    correct: isCorrect,
    score: isCorrect ? 1 : 0,
    message: isCorrect ? 'Correct!' : 'Incorrect',
  };
}

export function keScoreFromPerseusScore(perseusScore: any): any {
  if (!perseusScore) {
    return {
      correct: false,
      score: 0,
    };
  }

  return {
    correct: perseusScore.correct || false,
    score: perseusScore.correct ? 1 : 0,
    message: perseusScore.message,
  };
}

export default {
  scoreAnswer,
  keScoreFromPerseusScore,
};
