import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';

const BlogCard = ({ blog }) => {
  const formattedDate = new Date(blog.createdAt || Date.now()).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      {blog.image && (
        <Link to={`/blog/${blog._id}`} className="block aspect-[16/9] overflow-hidden bg-gray-100">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
        </Link>
      )}
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex items-center text-xs text-gray-500 mb-3 space-x-4">
          <span className="flex items-center">
            <User className="w-3 h-3 mr-1" />
            {blog.author?.userName || 'Unknown Author'}
          </span>
          <span className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {formattedDate}
          </span>
        </div>
        <Link to={`/blog/${blog._id}`} className="block group flex-grow">
          <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
            {blog.title}
          </h2>
          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
            {blog.content || blog.description}
          </p>
        </Link>
        <div className="mt-auto pt-4 border-t border-gray-50">
          <Link
            to={`/blog/${blog._id}`}
            className="text-indigo-600 text-sm font-medium hover:text-indigo-800 transition-colors"
          >
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
