import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTodos } from '../../hooks/useTodos';
import GmailLayout from '../layout/GmailLayout';
import MailList from './MailList';
import ComposeModal from './ComposeModal';

const TodoList = () => {
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [activeFolder, setActiveFolder] = useState('inbox');

  const { user, logout } = useAuth();
  const { todos, loading, error, addTodo, toggleTodo, deleteTodo } = useTodos();

  const handleAddTodo = async (title, description) => {
    try {
      await addTodo(title, description);
      setIsComposeOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleTodo = async (id) => {
    try {
      await toggleTodo(id);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteTodo = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa mục này?')) return;
    try {
      await deleteTodo(id);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <GmailLayout
      user={user}
      onLogout={logout}
      onCompose={() => setIsComposeOpen(true)}
      activeFolder={activeFolder}
      setActiveFolder={setActiveFolder}
      inboxCount={todos.length}
    >
      {error && (
        <div className="m-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
          {error}
        </div>
      )}
      <MailList
        todos={todos}
        onToggle={handleToggleTodo}
        onDelete={handleDeleteTodo}
      />
      <ComposeModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        onAddTodo={handleAddTodo}
      />
    </GmailLayout>
  );
};

export default TodoList;
