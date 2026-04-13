import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createBlog } from '../redux/slices/blogSlice';
import toast from 'react-hot-toast';

const CreateBlog = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
  });

  const { isLoading } = useSelector((state) => state.blog);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.content) {
      return toast.error('Please fill in all required fields');
    }

    const result = await dispatch(createBlog(formData));
    if (createBlog.fulfilled.match(result)) {
      toast.success('Blog created successfully!');
      navigate('/dashboard');
    } else {
      toast.error(result.payload || 'Failed to create blog');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Create a New Blog Post
          </h2>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-100 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title *
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="title"
                id="title"
                required
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-3 px-4 border"
                placeholder="Enter blog title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category *
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="category"
                id="category"
                required
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-3 px-4 border"
                placeholder="e.g., Technology, Lifestyle"
                value={formData.category}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Content *
            </label>
            <div className="mt-1">
              <textarea
                id="content"
                name="content"
                rows={12}
                required
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-4"
                placeholder="Write your story..."
                value={formData.content}
                onChange={handleChange}
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Markdown format or plain text applies here.
            </p>
          </div>

          <div className="flex justify-end pt-4 space-x-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75"
            >
              {isLoading ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
