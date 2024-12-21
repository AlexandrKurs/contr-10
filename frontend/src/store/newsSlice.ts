import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface NewsState {
  news: { id: number; title: string; content: string }[];
  loading: boolean;
  error: string | null;
  fullPost: { id: number; title: string; content: string } | null;
}

const initialState: NewsState = {
  news: [],
  loading: false,
  error: null,
  fullPost: null,
};

export const fetchNews = createAsyncThunk('news/fetchNews', async () => {
  const response = await axios.get('http://localhost:8000/news');
  return response.data;
});

export const deleteNews = createAsyncThunk('news/deleteNews', async (id: number) => {
  await axios.delete(`http://localhost:8000/news/${id}`);
  return id;
});

export const fetchFullPost = createAsyncThunk('news/fetchFullPost', async (id: number) => {
  const response = await axios.get(`http://localhost:8000/news/${id}`);
  return response.data;
});

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news = action.payload;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch news';
      })
      .addCase(deleteNews.fulfilled, (state, action) => {
        state.news = state.news.filter((item) => item.id !== action.payload);
      })
      .addCase(fetchFullPost.fulfilled, (state, action) => {
        state.fullPost = action.payload;
      });
  },
});

export default newsSlice.reducer;