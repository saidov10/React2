import { useAtom, useSetAtom } from 'jotai';
import { useDispatch, useSelector } from 'react-redux';
import { usersAtom, editingUserAtom, isModalOpenAtom, type User } from './userAtoms';
import { addUserRedux, updateUserRedux, deleteUserRedux, type RootState } from './userSlice';
import { useUserZustand } from './zustandStore';

export const useSyncActions = () => { 
  const [jotaiUsers, setJotaiUsers] = useAtom(usersAtom);
  const setEditingUser = useSetAtom(editingUserAtom);
  const setIsOpen = useSetAtom(isModalOpenAtom);
  
  const reduxUsers = useSelector((state: RootState) => state.users.users);
  const dispatch = useDispatch();
  
  const { users: zustandUsers, addUser: addZustand, updateUser: updateZustand, deleteUser: deleteZustand } = useUserZustand();

  const allUsers: User[] = [
    ...jotaiUsers.map(u => ({ ...u, source: 'Jotai' })),
    ...reduxUsers.map(u => ({ ...u, source: 'Redux' })),
    ...zustandUsers.map(u => ({ ...u, source: 'Zustand' }))
  ];

  const handleGlobalDelete = (id: number) => {
    setJotaiUsers(prev => prev.filter(u => u.id !== id));
    dispatch(deleteUserRedux(id));
    deleteZustand(id);
  };

  const handleGlobalSave = (name: string, status: boolean, editingUser: User | null) => {
    if (editingUser) {
      const updatedUser = { ...editingUser, name, status };
      
      setJotaiUsers(prev => prev.map(u => u.id === editingUser.id ? updatedUser : u));
      dispatch(updateUserRedux(updatedUser));
      updateZustand(updatedUser); 
    } else {
      const newId = Date.now();
      const newUser: User = { id: newId, name, status };
      setJotaiUsers(prev => [...prev, { ...newUser, name: `${name} (J)` }]);
      dispatch(addUserRedux({ ...newUser, name: `${name} (R)` }));
      addZustand({ ...newUser, name: `${name} (Z)` });
    }
    setIsOpen(false);
    setEditingUser(null);
  };

  return {
    allUsers,
    handleGlobalDelete,
    handleGlobalSave
  };
};
