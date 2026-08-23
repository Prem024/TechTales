import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs } from '../redux/slices/blogSlice';
import BlogCard from '../components/BlogCard';
import Spinner from '../components/Spinner';
import SEOHead from '../components/SEOHead';
import { SEO_CONFIG } from '../utils/seoConstants';

const Home = () => {
  const dispatch = useDispatch();
  const { blogs, isLoading, error } = useSelector((state) => state.blog);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  // JSON-LD structured data for the WebSite
  const jsonLd = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SEO_CONFIG.siteName,
    url: SEO_CONFIG.siteUrl,
    description: SEO_CONFIG.defaultDescription,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SEO_CONFIG.siteUrl}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }), []);

  if (isLoading) return <Spinner />;

  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        <p className="text-xl">Opzz! Something went wrong.</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <SEOHead
        title="Discover Tech Stories, Tutorials & Insights"
        description="Explore the latest tech articles, programming tutorials, and developer insights on TechTales. Join our community of writers and readers."
        keywords="tech blog, technology articles, programming tutorials, web development, software engineering, coding tips, developer community, TechTales"
        canonicalUrl={`${SEO_CONFIG.siteUrl}/`}
        ogType="website"
        jsonLd={jsonLd}
      />

      {/* Hero Section */}
      <section className="text-center py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          Welcome to <span className="text-indigo-600">TechTales</span>
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-gray-500">
          Discover stories, thinking, and expertise from writers on any topic.
        </p>
      </section>

      {/* Blog Grid */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b pb-4">Latest Posts</h2>
        {blogs && blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl">No blogs found. Be the first to write one!</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;

