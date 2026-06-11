import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface UserR {
  id: string
  age: number
  job: string
  status: boolean
}

interface UserState {
  users: UserR[]
}

const initialState: UserState = {
  users: [
    { id: '1', age: 25, job: 'Developer', status: true },
    { id: '2', age: 30, job: 'Designer', status: false }
  ]
}

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<UserR>) => {
      state.users.push(action.payload)
    },
    editUser: (state, action: PayloadAction<UserR>) => {
      const index = state.users.findIndex((u) => u.id === action.payload.id)
      if (index !== -1) state.users[index] = action.payload
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((u) => u.id !== action.payload)
    }
  }
})

export const { addUser, editUser, deleteUser } = userSlice.actions
export default userSlice.reducer
