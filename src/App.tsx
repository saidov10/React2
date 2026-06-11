import React, { useState } from 'react'
import { useAll, type CombinedUser } from './store/All'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Search, Plus, Pencil, Trash2, UserCircle } from "lucide-react"

const emptyUser: CombinedUser = {
  id: '',
  firstName: '',
  lastName: '',
  age: 0,
  job: '',
  status: true,
  role: ''
}

export default function App() {
  const { users, addUser, editUser, deleteUser, toggleStatus, search, setSearch } = useAll()
  const [isOpen, setIsOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<CombinedUser | null>(null)
  const [formData, setFormData] = useState<CombinedUser>(emptyUser)

  const handleOpenAdd = () => {
    setEditingUser(null)
    setFormData({ ...emptyUser, id: Math.random().toString(36).substr(2, 9) })
    setIsOpen(true)
  }

  const handleOpenEdit = (user: CombinedUser) => {
    setEditingUser(user)
    setFormData(user)
    setIsOpen(true)
  }

  const handleSave = () => {
    if (editingUser) {
      editUser(formData)
    } else {
      addUser(formData)
    }
    setIsOpen(false)
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
            <Button onClick={handleOpenAdd} className="h-11 rounded-xl px-6 shadow-md transition-all hover:shadow-lg gap-2 bg-indigo-600 hover:bg-indigo-700">
              <Plus className="h-5 w-5" /> Add Member
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
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <UserCircle className="h-12 w-12 mb-2 opacity-20" />
                      <p className="text-lg">No team members found</p>
                    </div>
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
                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                          {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 leading-none">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-slate-500 mt-1">{user.firstName.toLowerCase()}@example.com</p>
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
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(user)} className="h-9 w-9 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteUser(user.id)} className="h-9 w-9 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
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

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full sm:max-w-[600px] max-h-[80vh] p-0 overflow-hidden rounded-[2rem] border-none shadow-[0_30px_100px_-20px_rgba(0,0,0,0.15)] bg-white duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in data-[state=closed]:fade-out data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95">
          <div className="flex flex-col max-h-[80vh]">
            <div className="bg-slate-50/80 px-8 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
              <DialogHeader className="space-y-0">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                    {editingUser ? <Pencil className="h-4 w-4" /> : <Plus className="h-5 w-5" />}
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-extrabold text-slate-900 tracking-tight">
                      {editingUser ? 'Update Profile' : 'New Member'}
                    </DialogTitle>
                    <p className="text-slate-500 text-xs font-medium">
                      {editingUser ? 'Edit existing team member.' : 'Add a new member to the team.'}
                    </p>
                  </div>
                </div>
              </DialogHeader>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-5 space-y-4">
              <section className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName" className="text-slate-700 font-bold ml-1 text-xs">First Name</Label>
                    <Input
                      id="firstName"
                      className="h-10 border-slate-200 rounded-xl focus:ring-indigo-500/20 px-3 text-sm"
                      placeholder="e.g. John"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName" className="text-slate-700 font-bold ml-1 text-xs">Last Name</Label>
                    <Input
                      id="lastName"
                      className="h-10 border-slate-200 rounded-xl focus:ring-indigo-500/20 px-3 text-sm"
                      placeholder="e.g. Doe"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="job" className="text-slate-700 font-bold ml-1 text-xs">Job Title</Label>
                  <Input
                    id="job"
                    className="h-10 border-slate-200 rounded-xl focus:ring-indigo-500/20 px-3 text-sm"
                    placeholder="e.g. Senior Software Engineer"
                    value={formData.job}
                    onChange={(e) => setFormData({ ...formData, job: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="role" className="text-slate-700 font-bold ml-1 text-xs">Role</Label>
                    <Input
                      id="role"
                      className="h-10 border-slate-200 rounded-xl focus:ring-indigo-500/20 px-3 text-sm"
                      placeholder="e.g. Admin"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="age" className="text-slate-700 font-bold ml-1 text-xs">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      className="h-10 border-slate-200 rounded-xl focus:ring-indigo-500/20 px-3 text-sm"
                      placeholder="28"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl border border-slate-100 group transition-all hover:bg-slate-50">
                  <div className="space-y-0.5">
                    <Label htmlFor="status" className="text-slate-900 font-bold text-sm cursor-pointer">Active Status</Label>
                    <p className="text-[11px] text-slate-500 font-medium">Allow access to the workspace.</p>
                  </div>
                  <Checkbox
                    id="status"
                    className="h-5 w-5 rounded-md border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                    checked={formData.status}
                    onCheckedChange={(checked) => setFormData({ ...formData, status: !!checked })}
                  />
                </div>
              </section>
            </div>

            <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex gap-3 shrink-0">
              <Button
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="flex-1 rounded-xl h-10 font-bold text-sm text-slate-500 hover:bg-slate-200/50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="flex-[1.5] rounded-xl h-10 font-bold text-sm bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all hover:-translate-y-0.5"
              >
                {editingUser ? 'Save Changes' : 'Create Member'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}