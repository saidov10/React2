import { create } from 'zustand';
import { type User } from './userAtoms';

interface UserZustandState {
  users: User[];
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: number) => void;
}

export const useUserZustand = create<UserZustandState>((set) => ({
  users: [
    { id: 201, name: "Zustand User X", status: true },
    { id: 202, name: "Zustand User Y", status: false },
  ],
  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
  updateUser: (user) => set((state) => ({
    users: state.users.map((u) => (u.id === user.id ? user : u)),
  })),
  deleteUser: (id) => set((state) => ({
    users: state.users.filter((u) => u.id !== id),
  })),
}));
