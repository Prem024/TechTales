import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchBlogById, clearCurrentBlog } from '../redux/slices/blogSlice';
import Spinner from '../components/Spinner';
import API from '../services/api';
import toast from 'react-hot-toast';
import { Trash2, User } from 'lucide-react';

const BlogDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentBlog, isLoading, error } = useSelector((state) => state.blog);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isCommentLoading, setIsCommentLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchBlogById(id));
    fetchComments();
    return () => {
      dispatch(clearCurrentBlog());
    };
  }, [dispatch, id]);

  const fetchComments = async () => {
    try {
      const response = await API.get(`/comment/${id}`);
      if (response.data.success) {
        setComments(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch comments', err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsCommentLoading(true);
    try {
      const response = await API.post('/comment/add', { content: newComment, BlogId: id });
      if (response.data.success) {
        toast.success('Comment added');
        setNewComment('');
        fetchComments(); // refresh comments
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setIsCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      const response = await API.delete(`/comment/delete/${commentId}`);
      if (response.data.success) {
        toast.success('Comment deleted');
        setComments(comments.filter((c) => c._id !== commentId));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete comment');
    }
  };

  if (isLoading && !currentBlog) return <Spinner />;

  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        <p className="text-xl">Opzz! Something went wrong.</p>
        <p>{error}</p>
        <Link to="/" className="text-indigo-600 underline mt-4 inline-block">Go back home</Link>
      </div>
    );
  }

  if (!currentBlog) return null;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-12">
        {currentBlog.image && (
          <div className="aspect-[21/9] bg-gray-100 relative">
            <img
              src={currentBlog.image}
              alt={currentBlog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-8 md:p-12">
          <div className="flex items-center space-x-2 text-sm text-indigo-600 font-semibold mb-4 tracking-wide uppercase">
            <span>{currentBlog.category}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            {currentBlog.title}
          </h1>
          
          <div className="flex items-center text-sm text-gray-500 mb-10 pb-8 border-b border-gray-100">
            <span className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
              <User className="w-4 h-4 mr-2" />
              {currentBlog.author?.userName || 'Unknown Author'}
            </span>
            <span className="mx-4">•</span>
            <span>{new Date(currentBlog.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="prose prose-lg prose-indigo max-w-none text-gray-700 whitespace-pre-wrap">
            {currentBlog.content}
          </div>
        </div>
      </article>

      {/* Comment Section */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-8">Comments ({comments.length})</h3>
        
        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} className="mb-10">
            <textarea
              className="w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-lg p-4 sm:text-sm"
              rows={3}
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            />
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                disabled={isCommentLoading}
                className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75 transition-colors"
              >
                {isCommentLoading ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-10 bg-gray-50 rounded-lg p-6 text-center border-dashed border-2 border-gray-200">
            <p className="text-gray-600">Please <Link to="/login" className="text-indigo-600 font-medium hover:underline">log in</Link> to post a comment.</p>
          </div>
        )}

        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment._id} className="flex space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold uppercase">
                  {(comment.authorId?.userName || 'U')[0]}
                </div>
              </div>
              <div className="flex-grow bg-gray-50 rounded-lg p-4 relative">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-gray-900">{comment.authorId?.userName || 'Unknown'}</span>
                  {user && user._id === (comment.authorId?._id || comment.authorId) && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete Comment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                <div className="mt-2 text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-gray-500 text-center py-8">No comments yet. Be the first to share your thoughts!</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogDetails;
