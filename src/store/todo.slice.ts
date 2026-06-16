import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://to-dos-api.softclub.tj/api/to-dos';

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await axios.get(API_URL);
  return response.data.data;
});

export const addTodo = createAsyncThunk('todos/addTodo', async (newTodo: any, { dispatch }) => {
  await axios.post(API_URL, newTodo);
  dispatch(fetchTodos());
});

export const deleteTodo = createAsyncThunk('todos/deleteTodo', async (id: number, { dispatch }) => {
  await axios.delete(`${API_URL}?id=${id}`);
  dispatch(fetchTodos());
});

export const updateTodo = createAsyncThunk('todos/updateTodo', async (updatedTodo: any, { dispatch }) => {
  await axios.put(API_URL, updatedTodo);
  dispatch(fetchTodos());
});

interface TodoState {
  items: any[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TodoState = {
  items: [],
  status: 'idle',
  error: null,
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export default todoSlice.reducer;
