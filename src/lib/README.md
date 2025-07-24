# WordPress API Library

This directory contains all the API-related functionality for connecting to WordPress.

## Files Overview

- `api-client.ts` - Core API client with HTTP methods
- `api-errors.ts` - Error handling utilities
- `api-utils.ts` - General API utility functions
- `wordpress-api.ts` - WordPress-specific API functions
- `pagination-utils.ts` - Pagination helper functions
- `data-transforms.ts` - Data transformation utilities

## Quick Start

```typescript
import { getPosts, getPostBySlug } from '@/lib/wordpress-api';

// Get recent posts
const posts = await getPosts({ per_page: 5 });

// Get specific post
const post = await getPostBySlug('my-post-slug');