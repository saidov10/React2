 import { Dialog } from './dialog'
 
 export default function AddDialog() {
   return (
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
            <DialogDescription>
              Add a new user to the list.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
   )
 }
 