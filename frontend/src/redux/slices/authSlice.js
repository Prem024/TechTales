import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';
import toast from 'react-hot-toast';

// Async thunks
export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await API.post('/user/login', credentials);
    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data)); // backend returns user in 'data'
    }
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await API.post('/user/register', userData);
    // Backend doesn't return a token on register, user needs to login.
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Registration failed');
  }
});

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.success('Logged out successfully');
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload.success) {
        state.isAuthenticated = true;
        state.user = action.payload.data;
        state.token = action.payload.token;
      } else {
        state.error = action.payload.message || 'Login failed';
      }
    })
    .addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Register
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(registerUser.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload.success) {
        // Did not login yet. Token is null.
        toast.success('Registration successful. Please log in.');
      } else {
        state.error = action.payload.message || 'Registration failed';
      }
    })
    .addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
