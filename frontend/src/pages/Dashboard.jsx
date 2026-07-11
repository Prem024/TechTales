import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchBlogs, deleteBlog } from '../redux/slices/blogSlice';
import Spinner from '../components/Spinner';
import { getImageUrl } from '../utils/imageHelper';
import { Edit, Trash2, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const stripHtml = (html) => {
  if (!html) return '';
  let cleanText = html.replace(/<[^>]*>/g, ' ');
  cleanText = cleanText.replace(/&nbsp;/g, ' ');
  return cleanText.replace(/\s+/g, ' ').trim();
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const { blogs, isLoading, error } = useSelector((state) => state.blog);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      const result = await dispatch(deleteBlog(id));
      if (deleteBlog.fulfilled.match(result)) {
        toast.success('Blog deleted successfully');
      } else {
        toast.error(result.payload || 'Failed to delete blog');
      }
    }
  };

  if (isLoading) return <Spinner />;

  // Filter blogs authored by the current user
  const userBlogs = blogs.filter((blog) => {
    const authorId = blog.author?._id || blog.author;
    return authorId === user?._id;
  });

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Profile Overview Banner */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
          <img
            src={getImageUrl(user?.profileImage)}
            alt={user?.userName}
            className="w-20 h-20 rounded-full object-cover border border-indigo-100 bg-gray-50 shadow-sm"
            onError={(e) => {
              e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
            }}
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 capitalize flex items-center justify-center md:justify-start gap-2">
              {user?.userName}
              <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                {user?.role || 'user'}
              </span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/profile/edit"
            className="inline-flex items-center px-5 py-2 border border-gray-300 text-sm font-semibold rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Edit Profile
          </Link>
          <Link
            to="/create"
            className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-semibold rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Post
          </Link>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Your Stories</h2>
          <p className="text-xs text-gray-500 mt-0.5">Manage and edit your posts</p>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      ) : userBlogs.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-100">
          <ul className="divide-y divide-gray-200">
            {userBlogs.map((blog) => (
              <li key={blog._id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex flex-1 min-w-0 items-start pr-4 space-x-4">
                    {(blog.featuredImage || blog.image) && (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
                        <img
                          src={getImageUrl(blog.featuredImage || blog.image)}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div className="flex-grow min-w-0">
                      <Link to={`/blog/${blog._id}`} className="block focus:outline-none">
                        <h3 className="text-lg font-semibold text-indigo-600 hover:text-indigo-800 truncate">{blog.title}</h3>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                          {stripHtml(blog.content)}
                        </p>
                      </Link>
                      <div className="mt-2 flex flex-wrap items-center text-xs text-gray-500 gap-x-3 gap-y-1">
                        <span className="font-medium text-gray-700 capitalize">By {user?.userName}</span>
                        <span>•</span>
                        <span>Category: {blog.category}</span>
                        <span>•</span>
                        <span>
                          Created: {new Date(blog.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end space-x-2">
                    <Link
                      to={`/edit/${blog._id}`}
                      className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                      title="Edit"
                    >
                      <Edit className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">You haven't written any posts yet.</p>
          <Link
            to="/create"
            className="text-indigo-600 font-medium hover:text-indigo-500"
          >
            Start writing your first blog post →
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
