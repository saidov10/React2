import { useUserZustand } from './userZustand'
import { useSelector, useDispatch } from 'react-redux'
import {type  RootState } from './store'
import { addUser as addR, editUser as editR, deleteUser as deleteR } from './userSlice'
import { useAtom } from 'jotai'
import { usersAtom, addUserAtom, editUserAtom, deleteUserAtom } from './userAtom'
import { useMemo, useState } from 'react'

export interface CombinedUser {
  id: string
  firstName: string
  lastName: string
  age: number
  job: string
  status: boolean
  role: string
}

export const useAll = () => {
  const [search, setSearch] = useState('')
  const zStore = useUserZustand()
  const rUsers = useSelector((state: RootState) => state.users.users)
  const dispatch = useDispatch()
  const [jUsers] = useAtom(usersAtom)
  const [, addJ] = useAtom(addUserAtom)
  const [, editJ] = useAtom(editUserAtom)
  const [, deleteJ] = useAtom(deleteUserAtom)

  const combined = useMemo(() => {
    return zStore.users.map(z => {
      const r = rUsers.find(u => u.id === z.id) || { age: 0, job: '', status: false }
      const j = jUsers.find(u => u.id === z.id) || { status: false, role: '' }
      // We take status from Zustand as the primary source for the combined view, 
      // but in a real app they should stay synced.
      return { ...z, ...r, ...j } as CombinedUser
    }).filter(u => 
      u.firstName.toLowerCase().includes(search.toLowerCase()) ||
      u.lastName.toLowerCase().includes(search.toLowerCase()) ||
      u.job.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
    )
  }, [zStore.users, rUsers, jUsers, search])

  const addUser = (user: CombinedUser) => {
    zStore.addUser({ id: user.id, firstName: user.firstName, lastName: user.lastName, status: user.status })
    dispatch(addR({ id: user.id, age: user.age, job: user.job, status: user.status }))
    addJ({ id: user.id, status: user.status, role: user.role })
  }

  const editUser = (user: CombinedUser) => {
    zStore.editUser({ id: user.id, firstName: user.firstName, lastName: user.lastName, status: user.status })
    dispatch(editR({ id: user.id, age: user.age, job: user.job, status: user.status }))
    editJ({ id: user.id, status: user.status, role: user.role })
  }

  const toggleStatus = (id: string) => {
    const user = combined.find(u => u.id === id)
    if (user) {
      const newStatus = !user.status
      zStore.editUser({ ...user, status: newStatus })
      dispatch(editR({ id: user.id, age: user.age, job: user.job, status: newStatus }))
      editJ({ id: user.id, status: newStatus, role: user.role })
    }
  }

  const deleteUser = (id: string) => {
    zStore.deleteUser(id)
    dispatch(deleteR(id))
    deleteJ(id)
  }

  return {
    users: combined,
    addUser,
    editUser,
    deleteUser,
    toggleStatus,
    search,
    setSearch
  }
}
