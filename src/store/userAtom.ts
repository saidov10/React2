import { atom } from 'jotai'

export interface UserJ {
  id: string
  status: boolean
  role: string
}

export const usersAtom = atom<UserJ[]>([
  { id: '1', status: true, role: 'Admin' },
  { id: '2', status: false, role: 'User' } 
])



export const addUserAtom = atom(null, (get, set, user: UserJ) => {
  set(usersAtom, [...get(usersAtom), user])
})

export const editUserAtom = atom(null, (get, set, user: UserJ) => {
  set(usersAtom, get(usersAtom).map((u) => (u.id === user.id ? user : u)))
})

export const deleteUserAtom = atom(null, (get, set, id: string) => {
  set(usersAtom, get(usersAtom).filter((u) => u.id !== id))
})
