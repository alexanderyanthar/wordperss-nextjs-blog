import { ApiError } from '@/types/api';

// Custom error class for API errors
export class WordPressApiError extends Error {
  public code: string;
  public status: number;
  public data?: any;

  constructor(message: string, code: string, status: number, data?: any) {
    super(message);
    this.name = 'WordPressApiError';
    this.code = code;
    this.status = status;
    this.data = data;
  }
}

// Error handler for API responses
export const handleApiError = (error: any): WordPressApiError => {
  if (error instanceof WordPressApiError) {
    return error;
  }

  // Handle fetch errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return new WordPressApiError(
      'Network error: Unable to connect to WordPress API',
      'NETWORK_ERROR',
      0
    );
  }

  // Handle HTTP errors
  if (error.status) {
    const message = error.message || `HTTP Error ${error.status}`;
    return new WordPressApiError(message, 'HTTP_ERROR', error.status);
  }

  // Handle WordPress API errors
  if (error.code && error.message) {
    return new WordPressApiError(
      error.message,
      error.code,
      error.data?.status || 500,
      error.data
    );
  }

  // Default error
  return new WordPressApiError(
    'An unknown error occurred',
    'UNKNOWN_ERROR',
    500
  );
};

// Check if response is ok
export const checkResponse = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    let errorCode = 'HTTP_ERROR';

    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      }
      if (errorData.code) {
        errorCode = errorData.code;
      }
    } catch {
      // If can't parse JSON, stick with HTTP error
    }

    throw new WordPressApiError(errorMessage, errorCode, response.status);
  }

  return response;
};
