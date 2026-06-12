import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Checkbox } from "./ui/checkbox"
import {type CombinedUser } from "../store/All"

interface EditUserModalProps {
  user: CombinedUser | null
  isOpen: boolean
  onClose: () => void
  onSave: (user: CombinedUser) => void
}

export const EditUserModal = ({ user, isOpen, onClose, onSave }: EditUserModalProps) => {
  const [formData, setFormData] = useState<CombinedUser | null>(null)

  useEffect(() => {
    if (user) {
      setFormData(user)
    }
  }, [user])

  const handleSave = () => {
    if (formData) {
      onSave(formData)
      onClose()
    }
  }

  if (!formData) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="firstName" className="text-right">First Name</Label>
            <Input id="firstName" className="col-span-3" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastName" className="text-right">Last Name</Label>
            <Input id="lastName" className="col-span-3" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="job" className="text-right">Job</Label>
            <Input id="job" className="col-span-3" value={formData.job} onChange={(e) => setFormData({ ...formData, job: e.target.value })} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">Role</Label>
            <Input id="role" className="col-span-3" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="age" className="text-right">Age</Label>
            <Input id="age" type="number" className="col-span-3" value={formData.age} onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Active</Label>
            <Checkbox id="status" checked={formData.status} onCheckedChange={(checked) => setFormData({ ...formData, status: !!checked })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}