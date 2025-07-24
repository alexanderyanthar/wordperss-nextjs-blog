import { PaginationParams } from '@/types/api';

// Generate pagination parameters
export const createPaginationParams = (
  currentPage: number = 1,
  postsPerPage: number = 10
): PaginationParams => {
  return {
    page: currentPage,
    per_page: postsPerPage,
    offset: (currentPage - 1) * postsPerPage,
  };
};

// Calculate pagination info
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  postsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export const calculatePaginationInfo = (
  currentPage: number,
  totalPages: number,
  totalPosts: number,
  postsPerPage: number
): PaginationInfo => {
  return {
    currentPage,
    totalPages,
    totalPosts,
    postsPerPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
    prevPage: currentPage > 1 ? currentPage - 1 : null,
  };
};

// Generate page numbers for pagination UI
export const generatePageNumbers = (
  currentPage: number,
  totalPages: number,
  maxVisible: number = 5
): number[] => {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

// Build pagination URL parameters
export const buildPaginationUrl = (
  baseUrl: string,
  page: number,
  additionalParams?: Record<string, string>
): string => {
  const url = new URL(baseUrl, window.location.origin);
  url.searchParams.set('page', page.toString());
  
  if (additionalParams) {
    Object.entries(additionalParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  return url.toString();
};