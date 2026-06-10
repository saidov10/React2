import { atom } from 'jotai';

export interface User {
  id: number; 
  name: string;
  status: boolean;
}

const initialUsers: User[] = [
  { id: 1, name: "Alice Johnson", status: true },
  { id: 2, name: "Bob Smith", status: false },
  { id: 3, name: "Charlie Brown", status: true },
  { id: 4, name: "David Wilson", status: false },
  { id: 5, name: "Eve Davis", status: true },
  { id: 6, name: "Frank Miller", status: false },
  { id: 7, name: "Grace Lee", status: true },
  { id: 8, name: "Heidi Garcia", status: false },
  { id: 9, name: "Ivan Martinez", status: true },
  { id: 10, name: "Judy Rodriguez", status: false },
];

export const usersAtom = atom<User[]>(initialUsers);

export const isModalOpenAtom = atom(false);
export const editingUserAtom = atom<User | null>(null);

export const deleteUserAtom = atom(
  null,
  (get, set, id: number) => {
    const users = get(usersAtom);
    set(usersAtom, users.filter(user => user.id !== id));
  }
);

export const openModalAtom = atom(
  null,
  (_, set, user: User | null) => {
    set(editingUserAtom, user);
    set(isModalOpenAtom, true);
  }
);

export const saveUserAtom = atom(
  null,
  (get, set, { name, status }: { name: string; status: boolean }) => {
    const users = get(usersAtom);
    const editingUser = get(editingUserAtom);

    if (editingUser) {
      set(usersAtom, users.map(u => u.id === editingUser.id ? { ...u, name, status } : u));
    } else {
      const newUser: User = {
        id: Math.max(0, ...users.map(u => u.id)) + 1,
        name,
        status,
      };
      set(usersAtom, [...users, newUser]);
    }
    set(isModalOpenAtom, false);
    set(editingUserAtom, null);
  }
);
