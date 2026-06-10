import React, { useState, useMemo } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "./store/store"
import {
  addUser,
  editUser,
  deleteUser,
  toggleUserStatus,
} from "./reducer/UserSlice"
import type { User } from "./reducer/UserSlice"
import {
  Plus,
  Search,
  User as UserIcon,
  UserCheck,
  UserX,
  Edit2,
  Trash2,
  X,
  AlertTriangle,
  SlidersHorizontal,
  ChevronDown,
  Users,
} from "lucide-react"

export default function App() {
  const users = useSelector((state: RootState) => state.users.users)
  const dispatch = useDispatch()

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  // Form states for modals
  const [newUser, setNewUser] = useState({ name: "", status: true })
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.status) ||
        (statusFilter === "inactive" && !user.status)
      return matchesSearch && matchesStatus
    })
  }, [users, searchTerm, statusFilter])

  // Stats calculation
  const stats = useMemo(() => {
    const total = users.length
    const active = users.filter((u) => u.status).length
    const inactive = total - active
    return { total, active, inactive }
  }, [users])

  
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUser.name.trim()) return
    dispatch(addUser({ name: newUser.name.trim(), status: newUser.status }))
    setNewUser({ name: "", status: true })
    setIsAddModalOpen(false)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser || !selectedUser.name.trim()) return
    dispatch(editUser(selectedUser))
    setSelectedUser(null)
    setIsEditModalOpen(false)
  }

  const handleDeleteConfirm = () => {
    if (selectedUser) {
      dispatch(deleteUser(selectedUser.id))
      setSelectedUser(null)
      setIsDeleteModalOpen(false)
    }
  }

  // Get color gradient based on string for avatar
  const getAvatarBg = (name: string) => {
    const code = name.charCodeAt(0) % 5
    const colors = [
      "from-pink-500 to-rose-500 text-white",
      "from-purple-500 to-indigo-500 text-white",
      "from-blue-500 to-cyan-500 text-white",
      "from-teal-500 to-emerald-500 text-white",
      "from-amber-500 to-orange-500 text-white",
    ]
    return colors[code]
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background decoration elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-950/20 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-200 via-slate-100 to-violet-300 bg-clip-text text-transparent">
              User Directory
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Create, read, update, and delete members of your workspace. Powered by Redux Toolkit.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 active:scale-98 transition-all duration-200 cursor-pointer"
          >
            <Plus className="size-4" />
            Add New Member
          </button>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1 */}
          <div className="relative overflow-hidden rounded-2xl bg-slate-900/50 border border-slate-800/80 p-6 backdrop-blur-md transition-all duration-300 hover:border-slate-700/60">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                <Users className="size-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">Total Workspace Members</p>
                <h3 className="text-3xl font-bold text-slate-100 mt-1">{stats.total}</h3>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative overflow-hidden rounded-2xl bg-slate-900/50 border border-slate-800/80 p-6 backdrop-blur-md transition-all duration-300 hover:border-slate-700/60">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                <UserCheck className="size-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">Active Status</p>
                <h3 className="text-3xl font-bold text-slate-100 mt-1">{stats.active}</h3>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="relative overflow-hidden rounded-2xl bg-slate-900/50 border border-slate-800/80 p-6 backdrop-blur-md transition-all duration-300 hover:border-slate-700/60">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
                <UserX className="size-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">Inactive Status</p>
                <h3 className="text-3xl font-bold text-slate-100 mt-1">{stats.inactive}</h3>
              </div>
            </div>
          </div>
        </section>

        {/* Toolbar: Search & Filters */}
        <section className="flex flex-col sm:flex-row items-center gap-4 mb-6 p-4 rounded-xl bg-slate-900/30 border border-slate-900 backdrop-blur-sm">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950/70 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <SlidersHorizontal className="size-4 text-slate-400 hidden sm:block" />
            <div className="relative w-full sm:w-44">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full appearance-none bg-slate-950/70 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 pl-4 pr-10 text-sm text-slate-300 outline-none transition-all cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </section>

        {/* Directory Grid / Table */}
        <main className="bg-slate-900/30 border border-slate-850 rounded-2xl overflow-hidden backdrop-blur-md">
          {filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-800/80 bg-slate-900/50">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">User</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">User ID</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="group hover:bg-slate-800/20 transition-all duration-150"
                    >
                      {/* Name & Avatar */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`size-10 rounded-full bg-gradient-to-br flex items-center justify-center font-bold text-sm select-none shadow-inner ${getAvatarBg(user.name)}`}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-200 group-hover:text-white transition-colors">
                              {user.name}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* ID */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium bg-slate-800 text-slate-300">
                          #{user.id}
                        </span>
                      </td>

                      {/* Status Toggle Badge */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => dispatch(toggleUserStatus(user.id))}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 border cursor-pointer select-none ${
                            user.status
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                              : "bg-slate-800 text-slate-400 border-slate-700/60 hover:bg-slate-800/80 hover:text-slate-300"
                          }`}
                          title="Click to toggle status"
                        >
                          <span className={`size-1.5 rounded-full ${user.status ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} />
                          {user.status ? "Active" : "Inactive"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user)
                              setIsEditModalOpen(true)
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800/80 transition-all cursor-pointer"
                            title="Edit User"
                          >
                            <Edit2 className="size-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user)
                              setIsDeleteModalOpen(true)
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition-all cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="p-4 rounded-full bg-slate-900 border border-slate-800 text-slate-500 mb-4">
                <UserIcon className="size-8" />
              </div>
              <h3 className="text-lg font-semibold text-slate-200">No members found</h3>
              <p className="text-sm text-slate-400 mt-1 max-w-sm">
                We couldn't find any workspace members matching your search or filters. Try adjusting your query.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* ================= MODALS ================= */}

      {/* 1. ADD USER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsAddModalOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl transition-all z-10 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <X className="size-4" />
            </button>

            <div className="mb-5">
              <h3 className="text-lg font-bold text-slate-100">Add Workspace Member</h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter details to add a new person to your organization directory.
              </p>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Johnathan Doe"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Status
                </label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-sm font-medium text-slate-300">
                    <input
                      type="radio"
                      name="status"
                      checked={newUser.status === true}
                      onChange={() => setNewUser({ ...newUser, status: true })}
                      className="size-4 text-indigo-600 border-slate-800 bg-slate-950 focus:ring-indigo-500"
                    />
                    <span>Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none text-sm font-medium text-slate-300">
                    <input
                      type="radio"
                      name="status"
                      checked={newUser.status === false}
                      onChange={() => setNewUser({ ...newUser, status: false })}
                      className="size-4 text-indigo-600 border-slate-800 bg-slate-950 focus:ring-indigo-500"
                    />
                    <span>Inactive</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/10 transition-colors"
                >
                  Create Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. EDIT USER MODAL */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => {
              setIsEditModalOpen(false)
              setSelectedUser(null)
            }}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl transition-all z-10 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                setIsEditModalOpen(false)
                setSelectedUser(null)
              }}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <X className="size-4" />
            </button>

            <div className="mb-5">
              <h3 className="text-lg font-bold text-slate-100">Edit Member Details</h3>
              <p className="text-xs text-slate-400 mt-1">
                Modify information for workspace member <span className="font-mono text-indigo-400">#{selectedUser.id}</span>.
              </p>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Johnathan Doe"
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Status
                </label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-sm font-medium text-slate-300">
                    <input
                      type="radio"
                      name="editStatus"
                      checked={selectedUser.status === true}
                      onChange={() => setSelectedUser({ ...selectedUser, status: true })}
                      className="size-4 text-indigo-600 border-slate-800 bg-slate-950 focus:ring-indigo-500"
                    />
                    <span>Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none text-sm font-medium text-slate-300">
                    <input
                      type="radio"
                      name="editStatus"
                      checked={selectedUser.status === false}
                      onChange={() => setSelectedUser({ ...selectedUser, status: false })}
                      className="size-4 text-indigo-600 border-slate-800 bg-slate-950 focus:ring-indigo-500"
                    />
                    <span>Inactive</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false)
                    setSelectedUser(null)
                  }}
                  className="px-4 py-2 text-sm font-semibold rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/10 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. DELETE USER MODAL */}
      {isDeleteModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => {
              setIsDeleteModalOpen(false)
              setSelectedUser(null)
            }}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-slate-900 border border-slate-805 p-6 shadow-2xl transition-all z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 shrink-0">
                <AlertTriangle className="size-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">Delete Member?</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Are you sure you want to remove <strong className="text-slate-200">{selectedUser.name}</strong> from your database? This action is permanent and cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/85">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false)
                  setSelectedUser(null)
                }}
                className="px-4 py-2 text-sm font-semibold rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-5 py-2 text-sm font-semibold rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/10 transition-colors"
              >
                Delete Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
