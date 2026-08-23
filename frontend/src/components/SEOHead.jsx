import { useEffect } from 'react';
import { SEO_CONFIG, buildTitle } from '../utils/seoConstants';

/**
 * SEOHead — Dynamically sets <head> meta tags for SEO.
 *
 * Props:
 *  - title        (string)  Page-specific title (gets wrapped in template)
 *  - description  (string)  Meta description (max ~160 chars)
 *  - keywords     (string)  Comma-separated keywords
 *  - canonicalUrl (string)  Full canonical URL for the page
 *  - ogImage      (string)  Open Graph image URL
 *  - ogType       (string)  'website' | 'article' (default: 'website')
 *  - noIndex      (bool)    If true, tells crawlers not to index this page
 *  - article      (object)  { publishedTime, modifiedTime, author, section, tags }
 *  - jsonLd       (object)  JSON-LD structured data object
 */
const SEOHead = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  ogType = 'website',
  noIndex = false,
  article,
  jsonLd,
}) => {
  useEffect(() => {
    // --- Title ---
    const fullTitle = title ? buildTitle(title) : SEO_CONFIG.defaultTitle;
    document.title = fullTitle;

    // --- Helper to set/create meta tags ---
    const setMeta = (attribute, attrValue, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attribute}="${attrValue}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attribute, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // --- Helper to set/create link tags ---
    const setLink = (rel, href) => {
      if (!href) return;
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    // --- Basic Meta ---
    setMeta('name', 'description', description || SEO_CONFIG.defaultDescription);
    setMeta('name', 'keywords', keywords || SEO_CONFIG.defaultKeywords);
    setMeta('name', 'author', SEO_CONFIG.author);
    setMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    // --- Canonical URL ---
    setLink('canonical', canonicalUrl || window.location.href);

    // --- Open Graph ---
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description || SEO_CONFIG.defaultDescription);
    setMeta('property', 'og:image', ogImage || SEO_CONFIG.defaultOgImage);
    setMeta('property', 'og:url', canonicalUrl || window.location.href);
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:site_name', SEO_CONFIG.siteName);

    // --- Article-specific OG ---
    if (article && ogType === 'article') {
      if (article.publishedTime) {
        setMeta('property', 'article:published_time', article.publishedTime);
      }
      if (article.modifiedTime) {
        setMeta('property', 'article:modified_time', article.modifiedTime);
      }
      if (article.author) {
        setMeta('property', 'article:author', article.author);
      }
      if (article.section) {
        setMeta('property', 'article:section', article.section);
      }
      if (article.tags && article.tags.length > 0) {
        article.tags.forEach((tag) => {
          // For article:tag, we append multiple meta tags
          const el = document.createElement('meta');
          el.setAttribute('property', 'article:tag');
          el.setAttribute('content', tag);
          el.setAttribute('data-seo-head', 'article-tag');
          document.head.appendChild(el);
        });
      }
    }

    // --- Twitter Cards ---
    setMeta('name', 'twitter:card', ogImage ? 'summary_large_image' : 'summary');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description || SEO_CONFIG.defaultDescription);
    setMeta('name', 'twitter:image', ogImage || SEO_CONFIG.defaultOgImage);
    if (SEO_CONFIG.twitterHandle) {
      setMeta('name', 'twitter:site', SEO_CONFIG.twitterHandle);
    }

    // --- JSON-LD Structured Data ---
    let scriptEl = document.querySelector('script[data-seo-head="json-ld"]');
    if (jsonLd) {
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.setAttribute('type', 'application/ld+json');
        scriptEl.setAttribute('data-seo-head', 'json-ld');
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(jsonLd);
    } else if (scriptEl) {
      scriptEl.remove();
    }

    // --- Cleanup on unmount ---
    return () => {
      // Remove article:tag meta tags
      document.querySelectorAll('meta[data-seo-head="article-tag"]').forEach((el) => el.remove());
      // Remove JSON-LD
      const ld = document.querySelector('script[data-seo-head="json-ld"]');
      if (ld) ld.remove();
    };
  }, [title, description, keywords, canonicalUrl, ogImage, ogType, noIndex, article, jsonLd]);

  return null; // This component renders nothing — it only manages <head>
};

export default SEOHead;
