import { atom } from 'jotai';

export interface User {
  id: number; 
  name: string;
  status: boolean;
  source?: string; 
} 

const initialUsers: User[] = [
  { id: 1, name: "Jotai User 1", status: true },
  { id: 2, name: "Jotai User 2", status: false },
];

export const usersAtom = atom<User[]>(initialUsers);
export const isModalOpenAtom = atom(false);
export const editingUserAtom = atom<User | null>(null);
