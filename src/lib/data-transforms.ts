import { WordPressPost, WordPressCategory, WordPressTag } from '@/types/wordpress';
import { SimplifiedPost } from '@/types/api';
import { extractPlainText, formatWordPressDate } from './api-utils';

// Transform WordPress post for display
export const transformPostForDisplay = (
  post: WordPressPost,
  categories: WordPressCategory[] = [],
  tags: WordPressTag[] = []
): SimplifiedPost & {
  formattedDate: string;
  plainTextExcerpt: string;
  readingTime: number;
  categoryNames: string[];
  tagNames: string[];
} => {
  // Calculate reading time (average 200 words per minute)
  const wordCount = extractPlainText(post.content.rendered).split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  // Get category names
  const categoryNames = categories
    .filter(cat => post.categories.includes(cat.id))
    .map(cat => cat.name);

  // Get tag names
  const tagNames = tags
    .filter(tag => post.tags.includes(tag.id))
    .map(tag => tag.name);

  return {
    id: post.id,
    title: post.title.rendered,
    content: post.content.rendered,
    excerpt: post.excerpt.rendered,
    slug: post.slug,
    date: post.date,
    author: post.author,
    categories: post.categories,
    tags: post.tags,
    formattedDate: formatWordPressDate(post.date),
    plainTextExcerpt: extractPlainText(post.excerpt.rendered, 160),
    readingTime,
    categoryNames,
    tagNames,
  };
};

// Validate post data
export const validatePost = (post: any): post is WordPressPost => {
  return (
    post &&
    typeof post.id === 'number' &&
    typeof post.slug === 'string' &&
    post.title &&
    typeof post.title.rendered === 'string' &&
    post.content &&
    typeof post.content.rendered === 'string'
  );
};

// Filter posts by status
export const filterPublishedPosts = (posts: WordPressPost[]): WordPressPost[] => {
  return posts.filter(post => post.status === 'publish');
};

// Sort posts by date
export const sortPostsByDate = (
  posts: WordPressPost[],
  order: 'asc' | 'desc' = 'desc'
): WordPressPost[] => {
  return [...posts].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
};

// Group posts by category
export const groupPostsByCategory = (
  posts: WordPressPost[],
  categories: WordPressCategory[]
): Record<string, WordPressPost[]> => {
  const grouped: Record<string, WordPressPost[]> = {};

  categories.forEach(category => {
    grouped[category.name] = posts.filter(post =>
      post.categories.includes(category.id)
    );
  });

  return grouped;
};

// Create post excerpt if none exists
export const createExcerpt = (content: string, maxLength: number = 160): string => {
  const plainText = extractPlainText(content);
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  const truncated = plainText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
};