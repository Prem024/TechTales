import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

// Async thunks
export const fetchBlogs = createAsyncThunk('blog/fetchBlogs', async (_, { rejectWithValue }) => {
  try {
    const response = await API.get('/blog/');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch blogs');
  }
});

export const fetchBlogById = createAsyncThunk('blog/fetchBlogById', async (id, { rejectWithValue }) => {
  try {
    const response = await API.get(`/blog/${id}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch blog');
  }
});

export const createBlog = createAsyncThunk('blog/createBlog', async (blogData, { rejectWithValue }) => {
  try {
    const response = await API.post('/blog/create', blogData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create blog');
  }
});

export const updateBlog = createAsyncThunk('blog/updateBlog', async ({ id, blogData }, { rejectWithValue }) => {
  try {
    const response = await API.put(`/blog/update/${id}`, blogData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update blog');
  }
});

export const deleteBlog = createAsyncThunk('blog/deleteBlog', async (id, { rejectWithValue }) => {
  try {
    const response = await API.delete(`/blog/delete/${id}`);
    return id; // return id to remove from state
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete blog');
  }
});

const initialState = {
  blogs: [],
  currentBlog: null,
  isLoading: false,
  error: null,
};

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    clearCurrentBlog: (state) => {
      state.currentBlog = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch all blogs
    builder.addCase(fetchBlogs.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(fetchBlogs.fulfilled, (state, action) => {
      state.isLoading = false;
      state.blogs = action.payload.data || [];
    })
    .addCase(fetchBlogs.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Fetch single blog
    builder.addCase(fetchBlogById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(fetchBlogById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentBlog = action.payload.data;
    })
    .addCase(fetchBlogById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Create blog
    builder.addCase(createBlog.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(createBlog.fulfilled, (state, action) => {
      state.isLoading = false;
      const newBlog = action.payload.data;
      if (Array.isArray(state.blogs)) {
        state.blogs.unshift(newBlog);
      }
    })
    .addCase(createBlog.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Update blog
    builder.addCase(updateBlog.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(updateBlog.fulfilled, (state, action) => {
      state.isLoading = false;
      const updatedBlog = action.payload.data;
      if (Array.isArray(state.blogs)) {
        const index = state.blogs.findIndex(b => b._id === updatedBlog._id);
        if (index !== -1) {
          state.blogs[index] = updatedBlog;
        }
      }
      if (state.currentBlog && state.currentBlog._id === updatedBlog._id) {
        state.currentBlog = updatedBlog;
      }
    })
    .addCase(updateBlog.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Delete blog
    builder.addCase(deleteBlog.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(deleteBlog.fulfilled, (state, action) => {
      state.isLoading = false;
      state.blogs = state.blogs.filter(b => b._id !== action.payload);
      if (state.currentBlog && state.currentBlog._id === action.payload) {
        state.currentBlog = null;
      }
    })
    .addCase(deleteBlog.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  }
});

export const { clearCurrentBlog, clearError } = blogSlice.actions;
export default blogSlice.reducer;
