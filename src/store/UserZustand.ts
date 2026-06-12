import { create } from 'zustand'

export interface UserZ {
  id: string
  firstName: string
  lastName: string
  status: boolean
}

interface UserZState {
  users: UserZ[]
  selectedUser: UserZ | null
  addUser: (user: UserZ) => void
  editUser: (user: UserZ) => void
  deleteUser: (id: string) => void
  setInfo: (user: UserZ | null) => void
} 

export const useUserZustand = create<UserZState>((set) => ({
  users: [
    { id: '1', firstName: 'Shirinshoh', lastName: 'Shohtemur', status: true },
    { id: '2', firstName: 'Bobojon', lastName: 'Gafurov', status: false },
    
  ],
  selectedUser: null,
  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
  editUser: (user) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === user.id ? user : u))
    })),
  deleteUser: (id) =>
    set((state) => ({
      users: state.users.filter((u) => u.id !== id)
    })),
  setInfo: (user) => set({ selectedUser: user })
}))
