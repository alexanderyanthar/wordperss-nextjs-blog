export const config = {
    wordpress: {
      apiUrl: process.env.WORDPRESS_API_URL || '',
    },
    site: {
      url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      name: 'My WordPress Blog',
      description: 'A headless WordPress blog built with Next.js',
    },
  };

