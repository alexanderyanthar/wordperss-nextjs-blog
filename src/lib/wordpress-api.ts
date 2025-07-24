import { apiClient } from './api-client';
import { buildPostQuery, extractPaginationInfo, formatWordPressDate } from './api-utils';
import { 
  WordPressPost, 
  WordPressCategory, 
  WordPressTag, 
  WordPressMedia 
} from '@/types/wordpress';
import { 
  PostQueryParams, 
  WordPressApiResponse, 
  SimplifiedPost 
} from '@/types/api';

// Get all posts with optional filtering and pagination
export const getPosts = async (
  params: PostQueryParams = {}
): Promise<WordPressApiResponse<WordPressPost>> => {
  const query = buildPostQuery(params);
  const response = await apiClient.getWithHeaders<WordPressPost[]>('/posts', query);
  
  const paginationInfo = extractPaginationInfo(response.headers);
  
  return {
    data: response.data,
    total: paginationInfo.total,
    totalPages: paginationInfo.totalPages,
    currentPage: params.page || 1,
  };
};

// Get a single post by slug
export const getPostBySlug = async (slug: string): Promise<WordPressPost | null> => {
  try {
    const posts = await apiClient.get<WordPressPost[]>('/posts', { slug });
    return posts.length > 0 ? posts[0] : null;
  } catch (error) {
    console.error(`Error fetching post with slug "${slug}":`, error);
    return null;
  }
};

// Get a single post by ID
export const getPostById = async (id: number): Promise<WordPressPost | null> => {
  try {
    const post = await apiClient.get<WordPressPost>(`/posts/${id}`);
    return post;
  } catch (error) {
    console.error(`Error fetching post with ID ${id}:`, error);
    return null;
  }
};

// Get posts by category
export const getPostsByCategory = async (
  categoryId: number,
  params: Omit<PostQueryParams, 'categories'> = {}
): Promise<WordPressApiResponse<WordPressPost>> => {
  const queryParams = { ...params, categories: [categoryId] };
  return getPosts(queryParams);
};

// Get posts by tag
export const getPostsByTag = async (
  tagId: number,
  params: Omit<PostQueryParams, 'tags'> = {}
): Promise<WordPressApiResponse<WordPressPost>> => {
  const queryParams = { ...params, tags: [tagId] };
  return getPosts(queryParams);
};

// Search posts
export const searchPosts = async (
  searchTerm: string,
  params: Omit<PostQueryParams, 'search'> = {}
): Promise<WordPressApiResponse<WordPressPost>> => {
  const queryParams = { ...params, search: searchTerm };
  return getPosts(queryParams);
};

// Get all categories
export const getCategories = async (): Promise<WordPressCategory[]> => {
  try {
    const categories = await apiClient.get<WordPressCategory[]>('/categories');
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Get all tags
export const getTags = async (): Promise<WordPressTag[]> => {
  try {
    const tags = await apiClient.get<WordPressTag[]>('/tags');
    return tags;
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
};

// Get featured media/image
export const getFeaturedMedia = async (mediaId: number): Promise<WordPressMedia | null> => {
  if (mediaId === 0) return null;
  
  try {
    const media = await apiClient.get<WordPressMedia>(`/media/${mediaId}`);
    return media;
  } catch (error) {
    console.error(`Error fetching media with ID ${mediaId}:`, error);
    return null;
  }
};

// Transform WordPress post to simplified format
export const transformToSimplifiedPost = (post: WordPressPost): SimplifiedPost => {
  return {
    id: post.id,
    title: post.title.rendered,
    content: post.content.rendered,
    excerpt: post.excerpt.rendered,
    slug: post.slug,
    date: post.date,
    author: post.author,
    featuredImage: post.featured_media > 0 ? undefined : undefined,
    categories: post.categories,
    tags: post.tags,
  };
};

// Get posts with featured images (more complex query)
export const getPostsWithFeaturedImages = async (
  params: PostQueryParams = {}
): Promise<WordPressApiResponse<SimplifiedPost & { featuredImageUrl?: string }>> => {
  const postsResponse = await getPosts(params);
  
  // Get featured images for posts that have them
  const postsWithImages = await Promise.all(
    postsResponse.data.map(async (post) => {
      const simplifiedPost = transformToSimplifiedPost(post);
      
      if (post.featured_media > 0) {
        const media = await getFeaturedMedia(post.featured_media);
        return {
          ...simplifiedPost,
          featuredImageUrl: media?.source_url,
        };
      }
      
      return simplifiedPost;
    })
  );

  return {
    data: postsWithImages,
    total: postsResponse.total,
    totalPages: postsResponse.totalPages,
    currentPage: postsResponse.currentPage,
  };
};

// Get recent posts (helper function)
export const getRecentPosts = async (count: number = 5): Promise<SimplifiedPost[]> => {
  const response = await getPosts({
    per_page: count,
    orderby: 'date',
    order: 'desc',
  });
  
  return response.data.map(transformToSimplifiedPost);
};