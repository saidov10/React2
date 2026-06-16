import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import {type AppDispatch } from '../../store';
import { updateTodo } from '../../store/todo.slice';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
});

export function EditTodoModal({ todo }: { todo: any }) {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      id: todo.id,
      name: todo.name,
      description: todo.description,
      isCompleted: todo.isCompleted,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      await dispatch(updateTodo(values));
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit To-Do</DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                name="name"
                className="col-span-3"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.name && formik.errors.name ? (
              <div className="text-red-500 text-sm text-right">{formik.errors.name}</div>
            ) : null}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Description
              </Label>
              <Input
                id="edit-description"
                name="description"
                className="col-span-3"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.description && formik.errors.description ? (
              <div className="text-red-500 text-sm text-right">{formik.errors.description}</div>
            ) : null}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isCompleted"
                checked={formik.values.isCompleted}
                onCheckedChange={(checked) => formik.setFieldValue('isCompleted', checked)}
              />
              <Label htmlFor="isCompleted">Is Completed</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
