// Centralized SEO configuration for TechTales
export const SEO_CONFIG = {
  siteName: 'TechTales',
  siteUrl: 'https://tech-tales-five.vercel.app',
  titleTemplate: '%s — TechTales',
  defaultTitle: 'TechTales — Discover Tech Stories, Tutorials & Insights',
  defaultDescription:
    'TechTales is a community-driven blog platform where developers and tech enthusiasts share stories, tutorials, and insights on web development, programming, software engineering, and emerging technologies.',
  defaultKeywords:
    'tech blog, technology articles, programming tutorials, web development, software engineering, coding tips, developer community, TechTales, JavaScript, React, Node.js',
  defaultOgImage: 'https://tech-tales-five.vercel.app/favicon.svg',
  twitterHandle: '',
  author: 'TechTales',
};

/**
 * Helper to build a page title using the template.
 * @param {string} pageTitle
 * @returns {string}
 */
export const buildTitle = (pageTitle) => {
  if (!pageTitle) return SEO_CONFIG.defaultTitle;
  return SEO_CONFIG.titleTemplate.replace('%s', pageTitle);
};

/**
 * Strip HTML tags and truncate to a max length for meta descriptions.
 * @param {string} html
 * @param {number} maxLength
 * @returns {string}
 */
export const createMetaDescription = (html, maxLength = 160) => {
  if (!html) return SEO_CONFIG.defaultDescription;
  let text = html.replace(/<[^>]*>/g, ' ');
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/\s+/g, ' ').trim();
  if (text.length > maxLength) {
    text = text.substring(0, maxLength - 3) + '...';
  }
  return text;
};
