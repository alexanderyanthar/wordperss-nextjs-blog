// Generic API Response wrapper
export interface ApiResponse<T> {
    data: T;
    status: number;
    message?: string;
  }
  
  // API Error interface
  export interface ApiError {
    code: string;
    message: string;
    data?: {
      status: number;
    };
  }
  
  // WordPress API Collection Response
  export interface WordPressApiResponse<T> {
    data: T[];
    total: number;
    totalPages: number;
    currentPage: number;
  }
  
  // Pagination parameters
  export interface PaginationParams {
    page?: number;
    per_page?: number;
    offset?: number;
  }
  
  // Post query parameters
  export interface PostQueryParams extends PaginationParams {
    search?: string;
    author?: number;
    categories?: number[];
    tags?: number[];
    status?: string;
    order?: 'asc' | 'desc';
    orderby?: 'date' | 'id' | 'title' | 'slug';
  }
  
  // Utility type for optional fields
  export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
  
  // Simplified post type for display purposes
  export interface SimplifiedPost {
    id: number;
    title: string;
    content: string;
    excerpt: string;
    slug: string;
    date: string;
    author: number;
    featuredImage?: string;
    categories: number[];
    tags: number[];
  }
