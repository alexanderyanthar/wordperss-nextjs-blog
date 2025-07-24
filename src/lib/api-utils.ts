import { PostQueryParams, PaginationParams } from '@/types/api';

// Build query parameters for posts
export const buildPostQuery = (params: PostQueryParams = {}): Record<string, any> => {
  const query: Record<string, any> = {};

  // Pagination
  if (params.page) query.page = params.page;
  if (params.per_page) query.per_page = params.per_page;
  if (params.offset) query.offset = params.offset;

  // Filtering
  if (params.search) query.search = params.search;
  if (params.author) query.author = params.author;
  if (params.categories && params.categories.length > 0) {
    query.categories = params.categories;
  }
  if (params.tags && params.tags.length > 0) {
    query.tags = params.tags;
  }
  if (params.status) query.status = params.status;

  // Ordering
  if (params.order) query.order = params.order;
  if (params.orderby) query.orderby = params.orderby;

  return query;
};

// Extract pagination info from response headers
export const extractPaginationInfo = (headers: Headers) => {
  return {
    total: parseInt(headers.get('X-WP-Total') || '0', 10),
    totalPages: parseInt(headers.get('X-WP-TotalPages') || '0', 10),
    currentPage: 1, // This would need to be passed in or calculated
  };
};

// Transform WordPress date to readable format
export const formatWordPressDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Extract plain text from HTML content
export const extractPlainText = (html: string, maxLength?: number): string => {
  // Remove HTML tags
  const text = html.replace(/<[^>]*>/g, '');
  
  // Decode HTML entities
  const decoded = text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");

  if (maxLength && decoded.length > maxLength) {
    return decoded.substring(0, maxLength).trim() + '...';
  }

  return decoded.trim();
};

// Validate API URL
export const validateApiUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname.includes('/wp-json/wp/v2');
  } catch {
    return false;
  }
};
