/**
 * Authentication API
 * Handles all authentication-related API calls
 */

import { httpClient } from './http-client';

const AUTH_SERVICE_URL = import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:8003';

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface AuthUser {
  user_id: string;
  email: string;
  name: string;
  age: number;
  current_grade?: string;
  user_type: string;
  learning_style?: string;
}

export interface GoogleAuthUrlResponse {
  authorization_url: string;
}

export interface SignupData {
  name: string;
  age: number;
  current_grade: string;
  learning_style?: string;
}

export const authAPI = {
  /**
   * Get Google OAuth authorization URL
   */
  async getGoogleAuthUrl(): Promise<GoogleAuthUrlResponse> {
    const response = await fetch(`${AUTH_SERVICE_URL}/auth/google/authorize`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get Google auth URL');
    }

    return await response.json();
  },

  /**
   * Complete user signup with additional information
   */
  async completeSignup(setupToken: string, data: SignupData): Promise<AuthResponse> {
    const response = await fetch(`${AUTH_SERVICE_URL}/auth/setup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${setupToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to complete signup');
    }

    return await response.json();
  },

  /**
   * Get current user information
   */
  async getCurrentUser(token: string): Promise<AuthUser> {
    const response = await fetch(`${AUTH_SERVICE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get user information');
    }

    return await response.json();
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await httpClient.post(`${AUTH_SERVICE_URL}/auth/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  /**
   * Refresh authentication token
   */
  async refreshToken(token: string): Promise<AuthResponse> {
    const response = await fetch(`${AUTH_SERVICE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    return await response.json();
  },

  completeSetup: function(setupToken: string, data: SignupData): Promise<AuthResponse> {
    return this.completeSignup(setupToken, data);
  },
};
