import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog"
import {type CombinedUser } from "../store/All"

interface InfoModalProps {
  user: CombinedUser | null
  isOpen: boolean
  onClose: () => void
}

export const InfoModal = ({ user, isOpen, onClose }: InfoModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Information</DialogTitle>
        
        </DialogHeader>
        {user ? (
         
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">Name:</span>
              <span className="col-span-3">{user.firstName} {user.lastName}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">Age:</span>
              <span className="col-span-3">{user.age}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">Job:</span>
              <span className="col-span-3">{user.job}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">Role:</span>
              <span className="col-span-3">{user.role}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">Status:</span>
              <span className="col-span-3">{user.status ? "Active" : "Inactive"}</span>
            </div>
          </div>
        ) : (
          <p>No user selected</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
