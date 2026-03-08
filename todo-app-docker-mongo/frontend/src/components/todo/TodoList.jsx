import React, { useState, useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTodos } from '../../hooks/useTodos';
import GmailLayout from '../layout/GmailLayout';
import MailList from './MailList';
import MailDetail from './MailDetail';
import ComposeModal from './ComposeModal';
import SnoozeAuthModal from './SnoozeAuthModal';

const TodoList = () => {
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [selectedIds, setSelectedIds] = useState([]);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [viewingTodo, setViewingTodo] = useState(null);
  const [replyRecipient, setReplyRecipient] = useState('');
  const [isSnoozeAuthOpen, setIsSnoozeAuthOpen] = useState(false);
  const [isSnoozeAuthenticated, setIsSnoozeAuthenticated] = useState(false);
  const [pendingFolder, setPendingFolder] = useState(null);

  const { user, logout } = useAuth();
  const { 
    todos, 
    loading, 
    error, 
    addTodo, 
    toggleTodo, 
    toggleStar, 
    snoozeTodo, 
    unsnoozeTodo,
    deleteTodo, 
    deleteBulkTodos, 
    refreshTodos 
  } = useTodos();

  const handleAddTodo = useCallback(async (title, description, recipientEmail) => {
    try {
      // Validate sơ bộ tại frontend
      const email = recipientEmail ? recipientEmail.trim() : null;
      await addTodo(title, description, email);
      setIsComposeOpen(false);
      
      if (activeFolder === 'sent' || (email && activeFolder === 'inbox')) {
        refreshTodos(activeFolder);
      }
    } catch (err) {
      throw err;
    }
  }, [addTodo, activeFolder, refreshTodos]);

  // Cập nhật danh sách khi đổi thư mục
  React.useEffect(() => {
    refreshTodos(activeFolder);
    setSelectedIds([]); // Reset selection when folder changes
    setViewingTodo(null); // Return to list view when folder changes
    
    // Reset snooze auth when leaving snoozed folder
    if (activeFolder !== 'snoozed') {
      setIsSnoozeAuthenticated(false);
    }
  }, [activeFolder, refreshTodos]);

  const handleFolderChange = (folder) => {
    if (folder === 'snoozed' && !isSnoozeAuthenticated) {
      setPendingFolder(folder);
      setIsSnoozeAuthOpen(true);
      return;
    }
    setActiveFolder(folder);
  };

  const handleSnoozeAuthSuccess = () => {
    setIsSnoozeAuthenticated(true);
    setIsSnoozeAuthOpen(false);
    if (pendingFolder) {
      setActiveFolder(pendingFolder);
      setPendingFolder(null);
    }
  };

  const handleSelectToggle = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(todos.map(t => t._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setIsDeleteConfirmOpen(true);
  };

  const confirmBulkDelete = async () => {
    try {
      await deleteBulkTodos(selectedIds);
      setSelectedIds([]);
      setIsDeleteConfirmOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleTodo = async (id) => {
    try {
      const updatedTodo = await toggleTodo(id, activeFolder);
      if (viewingTodo && viewingTodo._id === id) {
        setViewingTodo(updatedTodo);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleStar = async (id) => {
    try {
      const updatedTodo = await toggleStar(id, activeFolder);
      if (viewingTodo && viewingTodo._id === id) {
        setViewingTodo(updatedTodo);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSnoozeTodo = async (id) => {
    try {
      await snoozeTodo(id);
      if (viewingTodo && viewingTodo._id === id) {
        setViewingTodo(null);
      }
    } catch (err) {
      alert(err.message);
    }
  };
  const handleUnsnoozeTodo = async (id) => {
    try {
      await unsnoozeTodo(id);
      if (viewingTodo && viewingTodo._id === id) {
        setViewingTodo(null);
      }
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

  const handleReply = useCallback((email) => {
    setReplyRecipient(email);
    setIsComposeOpen(true);
  }, []);

  const closeCompose = useCallback(() => {
    setIsComposeOpen(false);
    setReplyRecipient('');
  }, []);

  return (
    <GmailLayout
      user={user}
      onLogout={logout}
      onCompose={() => { setReplyRecipient(''); setIsComposeOpen(true); }}
      activeFolder={activeFolder}
      setActiveFolder={handleFolderChange}
      inboxCount={todos.length}
    >
      {loading ? (
        <div className="flex items-center justify-center h-full bg-transparent">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-[var(--accent-blue)]/10 border-t-[var(--accent-blue)] rounded-full animate-spin"></div>
            <p className="text-[var(--text-soft)] font-hand text-xl animate-pulse italic">Đang tìm thư...</p>
          </div>
        </div>
      ) : (
        <>
          {error && (
            <div className="m-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
              {error}
            </div>
          )}
          {viewingTodo ? (
            <MailDetail
              todo={viewingTodo}
              user={user}
              onBack={() => setViewingTodo(null)}
              onDelete={handleDeleteTodo}
              onToggleStar={handleToggleStar}
              onSnooze={handleSnoozeTodo}
              onUnsnooze={handleUnsnoozeTodo}
              onReply={handleReply}
              activeFolder={activeFolder}
            />
          ) : (
            <MailList
              todos={todos}
              selectedIds={selectedIds}
              onToggle={handleToggleTodo}
              onStarToggle={handleToggleStar}
              onDelete={handleDeleteTodo}
              onSnooze={handleSnoozeTodo}
              onUnsnooze={handleUnsnoozeTodo}
              activeFolder={activeFolder}
              onSelectToggle={handleSelectToggle}
              onSelectAll={handleSelectAll}
              onBulkDelete={handleBulkDelete}
              onViewTodo={(todo) => setViewingTodo(todo)}
              refreshTodos={refreshTodos}
            />
          )}
        </>
      )}

      {/* Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-md animate-fade-in font-hand">
          <div className="parchment-modal w-full max-w-lg p-12 transform transition-all animate-slide-up">
            <h3 className="text-4xl font-bold text-[var(--text-main)] mb-8 flex items-center gap-4 font-logo">
              <span className="p-3 bg-red-50 text-red-600 rounded-full shadow-sm">
                <Trash2 className="w-8 h-8" />
              </span>
              Xác nhận xé giấy
            </h3>
            <p className="text-2xl text-[var(--text-soft)] mb-12 leading-relaxed italic">
              Bạn có chắc chắn muốn xé bỏ <span className="font-bold text-[var(--accent-blue)]">{selectedIds.length}</span> lá thư đã chọn? Hành động này sẽ khiến chúng biến mất mãi mãi vào hư vô.
            </p>
            <div className="flex justify-end gap-6">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-8 py-3 rounded-full text-[var(--text-soft)] font-bold text-xl hover:bg-black/5 transition-all active:scale-95"
              >
                Giữ lại
              </button>
              <button
                onClick={confirmBulkDelete}
                className="px-10 py-3 rounded-full bg-red-600 text-white font-bold text-2xl font-logo hover:bg-red-700 shadow-lg shadow-red-600/20 transform active:scale-90 transition-all"
              >
                Xác nhận xé
              </button>
            </div>
          </div>
        </div>
      )}
      <ComposeModal
        isOpen={isComposeOpen}
        onClose={closeCompose}
        onAddTodo={handleAddTodo}
        initialRecipient={replyRecipient}
      />
      <SnoozeAuthModal
        isOpen={isSnoozeAuthOpen}
        onClose={() => setIsSnoozeAuthOpen(false)}
        onAuthenticated={handleSnoozeAuthSuccess}
      />
    </GmailLayout>
  );
};

export default TodoList;
