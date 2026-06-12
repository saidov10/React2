import { useUserZustand } from './UserZustand'
import { useSelector, useDispatch } from 'react-redux'
import { type RootState } from './store'
import { addUser as addR, editUser as editR, deleteUser as deleteR, setInfo as setInfoR } from './UserSlice'
import { useAtom } from 'jotai'
import { usersAtom, addUserAtom, editUserAtom, deleteUserAtom, selectedUserAtom, setInfoAtom } from './UserJotai'
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
  const rSelected = useSelector((state: RootState) => state.users.selectedUser)
  const dispatch = useDispatch()
  
  const [jUsers] = useAtom(usersAtom)
  const [jSelected] = useAtom(selectedUserAtom)
  const [, addJ] = useAtom(addUserAtom)
  const [, editJ] = useAtom(editUserAtom)
  const [, deleteJ] = useAtom(deleteUserAtom)
  const [, setInfoJ] = useAtom(setInfoAtom)

  const combined = useMemo(() => {
    return zStore.users.map(z => {
      const r = rUsers.find(u => u.id === z.id) || { age: 0, job: '', status: false }
      const j = jUsers.find(u => u.id === z.id) || { status: false, role: '' }
      return { ...z, ...r, ...j } as CombinedUser
    }).filter(u => 
      u.firstName.toLowerCase().includes(search.toLowerCase()) ||
      u.lastName.toLowerCase().includes(search.toLowerCase()) ||
      u.job.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
    )
  }, [zStore.users, rUsers, jUsers, search])

  const selectedUser = useMemo(() => {
    if (!zStore.selectedUser || !rSelected || !jSelected) return null
    return { ...zStore.selectedUser, ...rSelected, ...jSelected } as CombinedUser
  }, [zStore.selectedUser, rSelected, jSelected])

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

  const setInfo = (user: CombinedUser | null) => {
    if (user) {
      zStore.setInfo({ id: user.id, firstName: user.firstName, lastName: user.lastName, status: user.status })
      dispatch(setInfoR({ id: user.id, age: user.age, job: user.job, status: user.status }))
      setInfoJ({ id: user.id, status: user.status, role: user.role })
    } else {
      zStore.setInfo(null)
      dispatch(setInfoR(null))
      setInfoJ(null)
    }
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
    selectedUser,
    addUser,
    editUser,
    deleteUser,
    setInfo,
    toggleStatus,
    search,
    setSearch
  }
}
