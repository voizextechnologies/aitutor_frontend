/**
 * HTTP Client with authentication interceptors
 * Handles global error handling and token management
 */

import { jwtUtils } from './jwt-utils';

interface AuthContext {
  logout: () => Promise<void>;
}

let authContext: AuthContext | null = null;

/**
 * Register auth context for global 401 handling
 */
export function setAuthContext(context: AuthContext): void {
  authContext = context;
}

/**
 * HTTP client with authentication
 */
class HttpClient {
  private baseURL: string = '';

  /**
   * Make authenticated request
   */
  async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = jwtUtils.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;

    try {
      const response = await fetch(fullUrl, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        jwtUtils.removeToken();
        if (authContext) {
          await authContext.logout();
        }
        throw new Error('Unauthorized - please login again');
      }

      if (response.status === 403) {
        throw new Error('Forbidden - you do not have permission');
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP ${response.status}: ${response.statusText}`);
      }

      if (response.status === 204) {
        return null as T;
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return await response.text() as unknown as T;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network request failed');
    }
  }

  /**
   * GET request
   */
  async get<T>(url: string, options?: RequestInit): Promise<T> {
    return this.request<T>(url, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(url: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(url: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(url: string, options?: RequestInit): Promise<T> {
    return this.request<T>(url, { ...options, method: 'DELETE' });
  }

  /**
   * PATCH request
   */
  async patch<T>(url: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Set base URL for all requests
   */
  setBaseURL(url: string): void {
    this.baseURL = url;
  }
}

export const httpClient = new HttpClient();
