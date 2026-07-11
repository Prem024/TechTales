import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { getImageUrl } from '../utils/imageHelper';
import { Search, Trash2, Edit, Eye, EyeOff, ChevronLeft, ChevronRight, Filter, AlertTriangle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter and pagination states
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, blogId: null, blogTitle: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset page to 1 on search change
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page when other filters change
  useEffect(() => {
    setPage(1);
  }, [categoryFilter, statusFilter, sortOrder]);

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const response = await API.get('/admin/blogs', {
        params: {
          search: debouncedSearch,
          category: categoryFilter,
          status: statusFilter,
          sort: sortOrder,
          page,
          limit: 10,
        },
      });

      if (response.data.success) {
        setBlogs(response.data.blogs || []);
        setTotalPages(response.data.totalPages || 1);
        setTotalBlogs(response.data.totalBlogs || 0);
        setCategories(response.data.categories || []);
        setError(null);
      } else {
        setError('Failed to fetch blogs');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to fetch blogs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [debouncedSearch, categoryFilter, statusFilter, sortOrder, page]);

  const handleToggleVisibility = async (id, currentVisibility) => {
    const newVisibility = currentVisibility === false ? true : false;
    
    // Optimistic UI update
    setBlogs((prevBlogs) =>
      prevBlogs.map((blog) =>
        blog._id === id ? { ...blog, is_visible: newVisibility } : blog
      )
    );

    try {
      const response = await API.patch(`/admin/blogs/${id}/visibility`, {
        is_visible: newVisibility,
      });

      if (response.data.success) {
        toast.success(response.data.message || `Blog visibility updated`);
      } else {
        // Rollback on failure
        setBlogs((prevBlogs) =>
          prevBlogs.map((blog) =>
            blog._id === id ? { ...blog, is_visible: currentVisibility } : blog
          )
        );
        toast.error(response.data.message || 'Failed to update visibility');
      }
    } catch (err) {
      console.error(err);
      // Rollback on failure
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog._id === id ? { ...blog, is_visible: currentVisibility } : blog
        )
      );
      toast.error(err.response?.data?.message || 'Failed to update visibility');
    }
  };

  const openDeleteModal = (id, title) => {
    setDeleteModal({ isOpen: true, blogId: id, blogTitle: title });
  };

  const confirmDelete = async (id) => {
    setIsDeleting(true);
    const toastId = toast.loading('Deleting blog...');
    try {
      const response = await API.delete(`/admin/blogs/${id}`);
      
      if (response.data.success) {
        toast.success('Blog permanently deleted', { id: toastId });
        setDeleteModal({ isOpen: false, blogId: null, blogTitle: '' });
        // Refresh list
        fetchBlogs();
      } else {
        toast.error(response.data.message || 'Failed to delete blog', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to delete blog', { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    const day = String(d.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
    setStatusFilter('');
    setSortOrder('newest');
    setPage(1);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Blog Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage posts, edit settings, toggle visibility, and delete blogs.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchBlogs}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-sm font-semibold rounded-full bg-white hover:bg-gray-50 text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            title="Refresh Blogs"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by blog title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm bg-white appearance-none cursor-pointer text-gray-700"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <Filter className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm bg-white appearance-none cursor-pointer text-gray-700"
            >
              <option value="">All Statuses</option>
              <option value="visible">🟢 Visible</option>
              <option value="hidden">⚫ Hidden</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <Filter className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Sort Order */}
          <div className="relative">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm bg-white appearance-none cursor-pointer text-gray-700"
            >
              <option value="newest">Sort by: Newest</option>
              <option value="oldest">Sort by: Oldest</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <Filter className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Clear filter helper button if filters are active */}
        {(searchQuery || categoryFilter || statusFilter || sortOrder !== 'newest') && (
          <div className="flex justify-end">
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Blogs Main View */}
      {error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-3xl border border-red-100 flex items-center justify-center">
          <p className="font-semibold text-center">{error}</p>
        </div>
      ) : isLoading ? (
        /* Loading Skeleton */
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 space-y-4 animate-pulse">
            <div className="h-8 bg-gray-100 rounded w-1/4"></div>
            <div className="space-y-3 pt-4">
              {[...Array(5)].map((_, idx) => (
                <div key={idx} className="flex items-center space-x-4">
                  <div className="w-14 h-10 bg-gray-100 rounded"></div>
                  <div className="flex-1 h-6 bg-gray-100 rounded"></div>
                  <div className="w-20 h-6 bg-gray-100 rounded"></div>
                  <div className="w-10 h-6 bg-gray-100 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : blogs.length > 0 ? (
        /* Table View */
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-gray-500">
              <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-100 uppercase text-xs tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-4">Image</th>
                  <th scope="col" className="px-6 py-4">Title</th>
                  <th scope="col" className="px-6 py-4">Category</th>
                  <th scope="col" className="px-6 py-4">Author</th>
                  <th scope="col" className="px-6 py-4">Date</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                {blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Thumbnail */}
                    <td className="px-6 py-4">
                      <div className="w-14 h-10 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={getImageUrl(blog.featuredImage || blog.image)}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                          }}
                        />
                      </div>
                    </td>

                    {/* Title */}
                    <td className="px-6 py-4 font-semibold text-gray-900 max-w-xs truncate">
                      <Link to={`/blog/${blog._id}`} className="hover:text-indigo-600 transition-colors" title={blog.title}>
                        {blog.title}
                      </Link>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-semibold text-gray-600 border border-gray-200 capitalize">
                        {blog.category}
                      </span>
                    </td>

                    {/* Author */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={getImageUrl(blog.author?.profileImage)}
                          alt="Author"
                          className="w-6 h-6 rounded-full object-cover border border-gray-100 bg-gray-100"
                          onError={(e) => {
                            e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                          }}
                        />
                        <span className="font-medium text-gray-700 capitalize text-xs">
                          {blog.author?.userName || 'Deleted Author'}
                        </span>
                      </div>
                    </td>

                    {/* Created Date */}
                    <td className="px-6 py-4 text-xs font-medium text-gray-600">
                      {formatDate(blog.createdAt)}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {blog.is_visible !== false ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                          Visible
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-50 text-gray-500 border border-gray-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          Hidden
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3.5">
                        {/* iOS Toggle Switch */}
                        <button
                          onClick={() => handleToggleVisibility(blog._id, blog.is_visible)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                            blog.is_visible !== false ? 'bg-indigo-600' : 'bg-gray-300'
                          }`}
                          title={blog.is_visible !== false ? "Hide from website" : "Show on website"}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              blog.is_visible !== false ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>

                        {/* Edit Button */}
                        <Link
                          to={`/edit/${blog._id}`}
                          className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-indigo-600 transition-colors"
                          title="Edit Blog"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        {/* Delete Button */}
                        <button
                          onClick={() => openDeleteModal(blog._id, blog.title)}
                          className="p-1 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete Blog"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4 bg-gray-50/50">
            <div className="text-xs text-gray-500 font-medium">
              Showing <span className="font-semibold text-gray-800">{blogs.length}</span> of <span className="font-semibold text-gray-800">{totalBlogs}</span> blogs
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="inline-flex items-center justify-center p-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-800 disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-gray-600 font-semibold px-2">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="inline-flex items-center justify-center p-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-800 disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-lg">No blogs match your filter criteria.</p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full transition-colors shadow-md shadow-indigo-100"
          >
            Clear Search & Filters
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs transition-opacity px-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-gray-100 transform scale-100 transition-all space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2 bg-red-50 rounded-2xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-gray-900">Delete Blog Post?</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-gray-900">"{deleteModal.blogTitle}"</span>? This action cannot be undone and will permanently remove the post and its uploaded media files.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteModal({ isOpen: false, blogId: null, blogTitle: '' })}
                disabled={isDeleting}
                className="px-5 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-full transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(deleteModal.blogId)}
                disabled={isDeleting}
                className="px-5 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-full transition-colors shadow-sm shadow-red-100 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {isDeleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogs;
