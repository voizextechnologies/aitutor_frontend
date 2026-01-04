/**
 * API Utilities
 * Helper functions for making API calls
 */

import { httpClient } from './http-client';

const TEACHING_ASSISTANT_API_URL = import.meta.env.VITE_TEACHING_ASSISTANT_API_URL || 'http://localhost:8002';

export const apiUtils = {
  /**
   * Generic GET request
   */
  async get<T = any>(url: string): Promise<T> {
    return await httpClient.get<T>(url);
  },

  /**
   * Generic POST request
   */
  async post<T = any>(url: string, data?: any): Promise<T> {
    return await httpClient.post<T>(url, data);
  },

  /**
   * Get grading for a specific skill
   */
  async getGrading(skillId: string): Promise<any> {
    try {
      return await httpClient.get(`${TEACHING_ASSISTANT_API_URL}/grading/${skillId}`);
    } catch (error) {
      console.error('Failed to get grading:', error);
      throw error;
    }
  },

  /**
   * Submit answer for grading
   */
  async submitAnswer(skillId: string, answer: any): Promise<any> {
    try {
      return await httpClient.post(`${TEACHING_ASSISTANT_API_URL}/grading/${skillId}/submit`, {
        answer,
      });
    } catch (error) {
      console.error('Failed to submit answer:', error);
      throw error;
    }
  },

  /**
   * Get question by ID
   */
  async getQuestion(questionId: string): Promise<any> {
    try {
      return await httpClient.get(`${TEACHING_ASSISTANT_API_URL}/questions/${questionId}`);
    } catch (error) {
      console.error('Failed to get question:', error);
      throw error;
    }
  },

  /**
   * Get next question for skill
   */
  async getNextQuestion(skillId: string): Promise<any> {
    try {
      return await httpClient.get(`${TEACHING_ASSISTANT_API_URL}/skills/${skillId}/next-question`);
    } catch (error) {
      console.error('Failed to get next question:', error);
      throw error;
    }
  },

  /**
   * Get skill progress
   */
  async getSkillProgress(skillId: string): Promise<any> {
    try {
      return await httpClient.get(`${TEACHING_ASSISTANT_API_URL}/skills/${skillId}/progress`);
    } catch (error) {
      console.error('Failed to get skill progress:', error);
      throw error;
    }
  },
};
