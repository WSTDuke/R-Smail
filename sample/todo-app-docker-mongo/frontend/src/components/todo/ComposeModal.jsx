import React, { useState } from 'react';
import { Minus, X, Paperclip, Trash2, Maximize2, Image, Link, Smile, MoreVertical, AlertCircle } from 'lucide-react';

const ComposeModal = ({ isOpen, onClose, onAddTodo, initialRecipient = '' }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [recipientEmail, setRecipientEmail] = useState(initialRecipient);
  const [errorStatus, setErrorStatus] = useState(null);

  // Sync recipientEmail when initialRecipient prop changes (e.g., on Reply)
  React.useEffect(() => {
    if (isOpen) {
      setRecipientEmail(initialRecipient || '');
    }
  }, [initialRecipient, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    try {
      setErrorStatus(null);
      const email = recipientEmail ? recipientEmail.trim() : null;
      console.log('Frontend sending mail to:', email);
      await onAddTodo(title, description, email);
      setTitle('');
      setDescription('');
      setRecipientEmail('');
      onClose();
    } catch (err) {
      console.error('Frontend caught error:', err.message);
      setErrorStatus(err.message);
    }
  };

  return (
    <div className="fixed bottom-0 right-16 z-50 w-full max-w-[540px] shadow-2xl rounded-t-[var(--radius-xl)] flex flex-col transition-all duration-300 transform animate-slide-up overflow-hidden font-hand parchment-modal">
      {/* Header bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-[var(--bg-main)] text-[var(--accent-blue)] h-12 border-b border-[var(--border-subtle)]/50">
        <span className="text-lg font-bold font-logo tracking-tight">Viết thư tay</span>
        <div className="flex items-center gap-1.5">
          <button onClick={onClose} className="p-1.5 hover:bg-black/5 rounded-full transition-all active:scale-90 text-[var(--text-soft)]">
            <Minus className="w-5 h-5" />
          </button>
          <button onClick={onClose} className="p-1.5 hover:bg-black/5 rounded-full transition-all active:scale-90 text-[var(--text-soft)]">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col">
        {/* Recipients & Subject */}
        <div className="px-5 border-b border-[var(--border-subtle)]/30 flex flex-col justify-center min-h-[50px] py-2 bg-[var(--bg-content)]">
          <div className="flex items-center gap-3">
            <span className="text-base text-[var(--text-soft)] w-14 italic">Gửi tới:</span>
            <input
              type="email"
              placeholder="Địa chỉ hòm thư..."
              className="flex-1 text-lg outline-none text-[var(--text-main)] bg-transparent font-bold placeholder-[var(--text-soft)]/50"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
            />
          </div>
          {errorStatus && (
            <div className="flex items-center gap-2 mt-1 text-red-500 text-base">
              <AlertCircle className="w-4 h-4" />
              <span>{errorStatus}</span>
            </div>
          )}
        </div>
        <div className="px-5 border-b border-[var(--border-subtle)]/30 flex items-center h-12 bg-[var(--bg-content)]">
          <input
            type="text"
            placeholder="Chủ đề lá thư..."
            className="w-full text-lg outline-none focus:ring-0 font-bold bg-transparent text-[var(--accent-blue)] placeholder-[var(--text-soft)]/50"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
        </div>

        {/* Body Content - Lined Paper area */}
        <div className="px-5 py-4 min-h-[300px] relative bg-[var(--bg-content)]">
          {/* Notepad Margin Line */}
          <div className="absolute left-10 top-0 bottom-0 w-[1px] bg-red-200/50 pointer-events-none" />
          
          <textarea
            placeholder="Tôi muốn gửi lời tới..."
            className="w-full h-full text-lg outline-none resize-none focus:ring-0 min-h-[250px] leading-[1.4em] bg-transparent text-[var(--text-main)] placeholder-[var(--text-soft)]/30 paper-lined-hand pl-6"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-5 py-3 bg-[var(--bg-main)]/50 border-t border-[var(--border-subtle)]/30 h-16">
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="bg-[var(--accent-blue)] hover:bg-[var(--accent-blue)]/90 text-white px-8 py-2 rounded-full text-xl font-bold font-logo shadow-md shadow-[var(--accent-blue)]/20 transition-all active:scale-95 flex items-center gap-2"
            >
              Gửi thư
            </button>
            <div className="flex items-center gap-1.5 border-l border-[var(--border-subtle)] ml-1 pl-3">
              <IconButton icon={<Paperclip className="w-5 h-5" />} title="Kèm thêm giấy" />
              <IconButton icon={<Image className="w-5 h-5" />} title="Gửi ảnh" />
              <IconButton icon={<Smile className="w-5 h-5" />} title="Gửi nụ cười" />
              <IconButton icon={<Link className="w-5 h-5" />} title="Dẫn lối" />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

const IconButton = ({ icon, title, onClick }) => (
  <button 
    type="button"
    onClick={onClick}
    className="p-2.5 hover:bg-black/5 rounded-full text-[var(--text-soft)] transition-all active:scale-90" 
    title={title}
  >
    {icon}
  </button>
);

export default ComposeModal;


