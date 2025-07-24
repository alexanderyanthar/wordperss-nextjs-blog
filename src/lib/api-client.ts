import { config } from '@/config';
import { handleApiError, checkResponse, WordPressApiError } from '../lib/api-errors';

// API Client class for WordPress
export class WordPressApiClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;

  constructor() {
    this.baseUrl = config.wordpress.apiUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  // Generic GET request method
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    try {
      const url = new URL(`${this.baseUrl}${endpoint}`);
      
      // Add query parameters
      if (params) {
        Object.keys(params).forEach(key => {
          const value = params[key];
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              url.searchParams.append(key, value.join(','));
            } else {
              url.searchParams.append(key, value.toString());
            }
          }
        });
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.defaultHeaders,
      });

      await checkResponse(response);
      const data = await response.json();
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Generic POST request method
  async post<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.defaultHeaders,
        body: JSON.stringify(data),
      });

      await checkResponse(response);
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get headers from response (useful for pagination)
  async getWithHeaders<T>(
    endpoint: string, 
    params?: Record<string, any>
  ): Promise<{ data: T; headers: Headers }> {
    try {
      const url = new URL(`${this.baseUrl}${endpoint}`);
      
      if (params) {
        Object.keys(params).forEach(key => {
          const value = params[key];
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              url.searchParams.append(key, value.join(','));
            } else {
              url.searchParams.append(key, value.toString());
            }
          }
        });
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.defaultHeaders,
      });

      await checkResponse(response);
      const data = await response.json();
      
      return {
        data,
        headers: response.headers,
      };
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Health check method
  async healthCheck(): Promise<boolean> {
    try {
      await this.get('/posts?per_page=1');
      return true;
    } catch (error) {
      console.error('WordPress API health check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const apiClient = new WordPressApiClient();

// Export the error class for use in other files
export { WordPressApiError };
