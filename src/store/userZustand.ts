import { create } from 'zustand'

export interface UserZ {
  id: string
  firstName: string
  lastName: string
  status: boolean
}

interface UserState {
  users: UserZ[]
  addUser: (user: UserZ) => void
  editUser: (user: UserZ) => void
  deleteUser: (id: string) => void
}

export const useUserZustand = create<UserState>((set) => ({
  users: [
    { id: '1', firstName: 'Shrinshoh', lastName: 'Shohtemur', status: true },
    { id: '2', firstName: 'Bobojon', lastName: 'Gafurov', status: false }
  ],
  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
  editUser: (user) => set((state) => ({
    users: state.users.map((u) => (u.id === user.id ? user : u))
  })),
  deleteUser: (id) => set((state) => ({
    users: state.users.filter((u) => u.id !== id)
  }))
}))
