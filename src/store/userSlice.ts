import { createSlice,type  PayloadAction } from '@reduxjs/toolkit';
import { type User } from './userAtoms';

interface UserState {
  users: User[];
}

const initialState: UserState = {
  users: [
    { id: 101, name: "Redux User A", status: true },
    { id: 102, name: "Redux User B", status: false },
  ],
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsersRedux: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    addUserRedux: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    updateUserRedux: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(u => u.id === action.payload.id);
      if (index !== -1) state.users[index] = action.payload;
    },
    deleteUserRedux: (state, action: PayloadAction<number>) => {
      state.users = state.users.filter(u => u.id !== action.payload);
    },
  },
});

export const { setUsersRedux, addUserRedux, updateUserRedux, deleteUserRedux } = userSlice.actions;
export default userSlice.reducer;
