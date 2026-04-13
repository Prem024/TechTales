import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchBlogs, deleteBlog } from '../redux/slices/blogSlice';
import Spinner from '../components/Spinner';
import { Edit, Trash2, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';

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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 capitalize">{user?.userName}&apos;s Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your blog posts securely</p>
        </div>
        <Link
          to="/create"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Post
        </Link>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      ) : userBlogs.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-100">
          <ul className="divide-y divide-gray-200">
            {userBlogs.map((blog) => (
              <li key={blog._id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 pr-4">
                    <Link to={`/blog/${blog._id}`} className="block focus:outline-none">
                      <h3 className="text-lg font-medium text-indigo-600 truncate">{blog.title}</h3>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                        {blog.content}
                      </p>
                    </Link>
                    <div className="mt-2 flex items-center text-sm text-gray-500 space-x-4">
                      <span className="font-medium text-gray-700">By {user?.userName}</span>
                      <span>•</span>
                      <span>Category: {blog.category}</span>
                      <span>•</span>
                      <span>
                        Created: {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
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
