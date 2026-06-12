import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "./ui/dialog"
import { Button } from "./ui/button"
import { type CombinedUser } from "../store/All"

interface DeleteUserModalProps {
  user: CombinedUser | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (id: string) => void
}

export const DeleteUserModal = ({ user, isOpen, onClose, onConfirm }: DeleteUserModalProps) => {
  if (!user) return null

  const handleConfirm = () => {
    onConfirm(user.id)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{user.firstName} {user.lastName}</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={handleConfirm}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
