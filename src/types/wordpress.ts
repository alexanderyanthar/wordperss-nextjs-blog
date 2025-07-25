// WordPress Post Object Interface
export interface WordPressPost {
    id: number;
    date: string;
    date_gmt: string;
    guid: {
      rendered: string;
    };
    modified: string;
    modified_gmt: string;
    slug: string;
    status: string;
    type: string;
    link: string;
    title: {
      rendered: string;
    };
    content: {
      rendered: string;
      protected: boolean;
    };
    excerpt: {
      rendered: string;
      protected: boolean;
    };
    author: number;
    featured_media: number;
    comment_status: string;
    ping_status: string;
    sticky: boolean;
    template: string;
    format: string;
    meta: Record<string, any>;
    categories: number[];
    tags: number[];
    _links: WordPressLinks;
  }
  
  // WordPress Category Interface
  export interface WordPressCategory {
    id: number;
    count: number;
    description: string;
    link: string;
    name: string;
    slug: string;
    taxonomy: string;
    parent: number;
    meta: Record<string, any>;
    _links: WordPressLinks;
  }
  
  // WordPress Tag Interface
  export interface WordPressTag {
    id: number;
    count: number;
    description: string;
    link: string;
    name: string;
    slug: string;
    taxonomy: string;
    meta: Record<string, any>;
    _links: WordPressLinks;
  }
  
  // WordPress Media/Image Interface
  export interface WordPressMedia {
    id: number;
    date: string;
    slug: string;
    type: string;
    link: string;
    title: {
      rendered: string;
    };
    author: number;
    media_type: string;
    mime_type: string;
    media_details: {
      width: number;
      height: number;
      file: string;
      sizes: {
        [key: string]: {
          file: string;
          width: number;
          height: number;
          mime_type: string;
          source_url: string;
        };
      };
    };
    source_url: string;
    _links: WordPressLinks;
  }
  
  // WordPress Links Interface (for _links property)
  export interface WordPressLinks {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
    about: Array<{ href: string }>;
    author?: Array<{ 
      embeddable: boolean; 
      href: string; 
    }>;
    replies?: Array<{ 
      embeddable: boolean; 
      href: string; 
    }>;
    'version-history'?: Array<{ 
      count: number; 
      href: string; 
    }>;
    'predecessor-version'?: Array<{ 
      id: number; 
      href: string; 
    }>;
    'wp:attachment'?: Array<{ href: string }>;
    'wp:term'?: Array<{ 
      taxonomy: string; 
      embeddable: boolean; 
      href: string; 
    }>;
    curies?: Array<{ 
      name: string; 
      href: string; 
      templated: boolean; 
    }>;
  }
