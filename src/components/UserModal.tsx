import React, { useState, useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { isModalOpenAtom, editingUserAtom, saveUserAtom } from '../store/userAtoms';

export const UserModal: React.FC = () => {
  const [isOpen, setIsOpen] = useAtom(isModalOpenAtom);
  const [editingUser, setEditingUser] = useAtom(editingUserAtom);
  const saveUser = useSetAtom(saveUserAtom);

  const [name, setName] = useState('');
  const [status, setStatus] = useState(false);

  useEffect(() => {
    if (editingUser) {
      setName(editingUser.name);
      setStatus(editingUser.status);
    } else {
      setName('');
      setStatus(false);
    }
  }, [editingUser, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    saveUser({ name, status });
  };


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4">{editingUser ? 'Edit User' : 'Add User'}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter name"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={status}
              onChange={(e) => setStatus(e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              id="status"
            />
            <label htmlFor="status" className="ml-2 block text-sm text-gray-900">
              Active Status
            </label>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => { setIsOpen(false); setEditingUser(null); }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
