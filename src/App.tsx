import React from 'react';
import { UserList } from './components/UserList';
import { UserModal } from './components/UserModal';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-6xl mx-auto py-8">
        <UserList />
        <UserModal />
      </main>
    </div>
  );
}

export default App;
