import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = 'https://to-dos-api.softclub.tj';

// Хелпер для получения URL изображения
export const getImageUrl = (imageName: string) =>
  `${BASE_URL}/images/${imageName}`;

export interface TodoImage {
  id: number;
  imageName: string;
}

export interface Todo {
  id: number;
  name: string;
  description: string;
  isCompleted: boolean;
  images: TodoImage[];
}

// Ответ GET /api/to-dos
export interface GetTodosResponse {
  data: Todo[];
  errors: string[];
  statusCode: number;
}

export interface GetTodosParams {
  query?: string;
  PageNumber?: number;
  PageSize?: number;
}

export interface UpdateTodoDto {
  id: number;
  name: string;
  description: string;
}

export const todosApi = createApi({
  reducerPath: 'todosApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ['Todo'],
  endpoints: (builder) => ({

   
    getTodos: builder.query<GetTodosResponse, GetTodosParams>({
      query: ({ query, PageNumber = 1, PageSize = 10 } = {}) => ({
        url: '/api/to-dos',
        params: { query, PageNumber, PageSize },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Todo' as const, id })),
              { type: 'Todo', id: 'LIST' },
            ]
          : [{ type: 'Todo', id: 'LIST' }],
    }),

   
    getTodoById: builder.query<Todo, number>({
      query: (todoId) => `/api/to-dos/${todoId}`,
      providesTags: (_result, _error, id) => [{ type: 'Todo', id }],
    }),

    // POST /api/to-dos (multipart/form-data)
    createTodo: builder.mutation<void, { name: string; description: string; images: File[] }>({
      query: ({ name, description, images }) => {
        const formData = new FormData();
        formData.append('Name', name);
        formData.append('Description', description);
        images.forEach((img) => formData.append('Images', img));
        return { url: '/api/to-dos', method: 'POST', body: formData };
      },
      invalidatesTags: [{ type: 'Todo', id: 'LIST' }],
    }),

    // PUT /api/to-dos
    updateTodo: builder.mutation<void, UpdateTodoDto>({
      query: (body) => ({
        url: '/api/to-dos',
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Todo', id },
        { type: 'Todo', id: 'LIST' },
      ],
    }),

    // DELETE /api/to-dos?id=
    deleteTodo: builder.mutation<void, number>({
      query: (id) => ({ url: '/api/to-dos', method: 'DELETE', params: { id } }),
      invalidatesTags: [{ type: 'Todo', id: 'LIST' }],
    }),

    // PUT /completed?id=
    toggleCompleted: builder.mutation<void, number>({
      query: (id) => ({ url: '/completed', method: 'PUT', params: { id } }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Todo', id },
        { type: 'Todo', id: 'LIST' },
      ],
    }),

    // POST /api/to-dos/{todoId}/images
    addImages: builder.mutation<void, { todoId: number; images: File[] }>({
      query: ({ todoId, images }) => {
        const formData = new FormData();
        images.forEach((img) => formData.append('Images', img));
        return { url: `/api/to-dos/${todoId}/images`, method: 'POST', body: formData };
      },
      invalidatesTags: (_result, _error, { todoId }) => [{ type: 'Todo', id: todoId }],
    }),

    // DELETE /api/to-dos/images/{imageId}
    deleteImage: builder.mutation<void, { imageId: number; todoId: number }>({
      query: ({ imageId }) => ({ url: `/api/to-dos/images/${imageId}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, { todoId }) => [{ type: 'Todo', id: todoId }],
    }),
  }),
});

export const {
  useGetTodosQuery,
  useGetTodoByIdQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
  useToggleCompletedMutation,
  useAddImagesMutation,
  useDeleteImageMutation,
} = todosApi;
