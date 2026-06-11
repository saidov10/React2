import React, { useState, useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { isModalOpenAtom, editingUserAtom } from '../store/userAtoms';
import { useSyncActions } from '../store/syncActions';

export const UserModal: React.FC = () => {
  const [isOpen, setIsOpen] = useAtom(isModalOpenAtom);
  const [editingUser, setEditingUser] = useAtom(editingUserAtom);
  const { handleGlobalSave } = useSyncActions();

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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl transform transition-all">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {editingUser ? 'Edit User' : 'Create New User'}
        </h2>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
              placeholder="John Doe"
            />
          </div>
          <div className="flex items-center p-4 bg-gray-50 rounded-xl">
            <input
              type="checkbox"
              checked={status}
              onChange={(e) => setStatus(e.target.checked)}
              className="h-5 w-5 text-blue-600 border-gray-300 rounded-lg focus:ring-blue-500 cursor-pointer"
              id="status"
            />
            <label htmlFor="status" className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer">
              Active Member
            </label>
          </div>
        </div>
        <div className="mt-8 flex gap-3">
          <button
            onClick={() => { setIsOpen(false); setEditingUser(null); }}
            className="flex-1 px-4 py-3 text-sm font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => handleGlobalSave(name, status, editingUser)}
            className="flex-1 px-4 py-3 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            {editingUser ? 'Save Changes' : 'Add User'}
          </button>
        </div>
      </div>
    </div>
  );
};
