import React, { useState } from 'react'
import { useAll, type CombinedUser } from './store/All'
import { InfoModal } from './components/InfoModal'
import { AddUserModal } from './components/AddUserModal'
import { EditUserModal } from './components/EditUserModal'
import { DeleteUserModal } from './components/DeleteUserModal'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Checkbox } from "./components/ui/checkbox"
import { Search, Plus, Pencil, Trash2, Info } from "lucide-react"

export default function App() {
  const { users, selectedUser, addUser, editUser, deleteUser, setInfo, toggleStatus, search, setSearch } = useAll()
  
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  
  const [userToEdit, setUserToEdit] = useState<CombinedUser | null>(null)
  const [userToDelete, setUserToDelete] = useState<CombinedUser | null>(null)

  const handleOpenEdit = (user: CombinedUser) => {
    setUserToEdit(user)
    setIsEditOpen(true)
  }

  const handleOpenInfo = (user: CombinedUser) => {
    setInfo(user)
    setIsInfoOpen(true)
  }

  const handleOpenDelete = (user: CombinedUser) => {
    setUserToDelete(user)
    setIsDeleteOpen(true)
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="container mx-auto py-10 px-6 space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name, job or role..."
                className="pl-10 bg-white border-slate-200 h-11 rounded-xl shadow-sm focus:ring-primary/20"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button onClick={() => setIsAddOpen(true)} className="h-11 rounded-xl px-6 shadow-md transition-all hover:shadow-lg gap-2 bg-indigo-600 hover:bg-indigo-700">
              <Plus className="h-5 w-5" /> Add
            </Button>
          </div>
        </header>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-slate-200">
                <TableHead className="w-[40px] px-4">
                  <Checkbox className="rounded-md border-slate-300" />
                </TableHead>
                <TableHead className="font-semibold text-slate-700 py-4">User</TableHead>
                <TableHead className="font-semibold text-slate-700 py-4">Status</TableHead>
                <TableHead className="font-semibold text-slate-700 py-4">Age</TableHead>
                <TableHead className="font-semibold text-slate-700 py-4">Job Title</TableHead>
                <TableHead className="font-semibold text-slate-700 py-4">Role</TableHead>
                <TableHead className="text-right font-semibold text-slate-700 py-4 pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-64 text-center">
                   no users
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} className="group border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <TableCell className="px-4">
                      <Checkbox
                        className="rounded-md border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                        checked={user.status}
                        onCheckedChange={() => toggleStatus(user.id)}
                      />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div> 
                          <p className="font-semibold text-slate-900 leading-none">{user.firstName} {user.lastName}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border ${user.status
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                        <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${user.status ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                        {user.status ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-600 font-medium">{user.age}</TableCell>
                    <TableCell className="text-slate-600 font-medium">{user.job}</TableCell>
                    <TableCell>
                      <span className="text-slate-600 font-medium bg-slate-100 px-2 py-1 rounded-md text-xs">{user.role}</span>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-1 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenInfo(user)} className="h-9 w-9 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                          <Info className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(user)} className="h-9 w-9 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDelete(user)} className="h-9 w-9 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <InfoModal 
        user={selectedUser} 
        isOpen={isInfoOpen} 
        onClose={() => {
          setIsInfoOpen(false)
          setInfo(null)
        }} 
      />

      <AddUserModal 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
        onSave={addUser} 
      />

      <EditUserModal 
        user={userToEdit} 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        onSave={editUser} 
      />

      <DeleteUserModal 
        user={userToDelete} 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        onConfirm={deleteUser} 
      />
    </div>
  )
}
