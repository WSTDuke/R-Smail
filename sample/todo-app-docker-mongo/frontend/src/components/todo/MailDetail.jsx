import React, { useState } from 'react';
import { ArrowLeft, Trash2, Clock, MoreVertical, RotateCcw, ChevronLeft, ChevronRight, Reply, Star } from 'lucide-react';

const MailDetail = ({ todo, user, onBack, onDelete, onToggleStar, onSnooze, onUnsnooze, onReply, activeFolder }) => {
  const [currentPage, setCurrentPage] = useState(0);
  
  const date = new Date(todo.createdAt || Date.now());
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const formattedTime = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  const senderName = todo.sender?.name || (todo.sender?.email?.split('@')[0]) || 'Hệ thống';
  const senderEmail = todo.sender?.email || '';

  // Pagination Logic: Split by newlines and group into pages
  const lines = todo.description ? todo.description.split('\n') : [''];
  const linesPerPage = 20;
  const totalPages = Math.ceil(lines.length / linesPerPage);
  
  const getCurrentPageLines = () => {
    const start = currentPage * linesPerPage;
    return lines.slice(start, start + linesPerPage).join('\n');
  };

  const renderContentWithLinks = (text) => {
    if (!text) return text;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a 
            key={index} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline break-all"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden font-body relative">
      {/* Header Toolbar */}
      <div className="flex items-center justify-between px-6 py-2 border-b border-[var(--border-subtle)]/50 sticky top-0 bg-[var(--bg-content)]/90 backdrop-blur-md z-30 transition-all h-[56px]">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-black/5 rounded-full transition-all text-[var(--text-soft)] active:scale-90"
            title="Quay lại hòm thư"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="h-6 w-px bg-[var(--border-subtle)]/50 mx-1" />
          <ActionButton 
            icon={<Star className={`w-5 h-5 ${todo.starred ? 'fill-yellow-500 text-yellow-500' : ''}`} />} 
            title={todo.starred ? "Bỏ đánh dấu sao" : "Đánh dấu sao"} 
            onClick={() => onToggleStar(todo._id)} 
          />
          <ActionButton 
            icon={<Trash2 className="w-5 h-5" />} 
            title="Bỏ vào giỏ rác" 
            onClick={() => { onDelete(todo._id); onBack(); }} 
            danger 
          />
          {activeFolder === 'snoozed' ? (
            <ActionButton 
              icon={<RotateCcw className="w-5 h-5" />} 
              title="Đặt lại bàn" 
              onClick={() => onUnsnooze(todo._id)} 
            />
          ) : (
            <ActionButton 
              icon={<Clock className="w-5 h-5" />} 
              title="Gửi sau nhé" 
              onClick={() => onSnooze(todo._id)} 
            />
          )}
          <ActionButton icon={<MoreVertical className="w-5 h-5" />} title="Thêm việc" />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xl font-logo italic text-[var(--text-soft)]">Trang {currentPage + 1} / {totalPages}</span>
        </div>
      </div>

      {/* Traditional Letter Paper Area */}
      <div className="flex-1 overflow-y-auto px-8 py-8 flex justify-center scroll-smooth bg-[var(--bg-content)] relative paper-lined-container">
        <div className="w-full max-w-3xl relative min-h-[600px] flex flex-col">
          
          {/* 1. Date & Location (Top Right) */}
          <div className="flex justify-end p-4 mb-6 mt-2">
            <div className="text-right font-hand text-lg text-[var(--text-soft)] italic leading-tight">
              <p>Ngày {day} tháng {month} năm {year}</p>
              <p>Lúc {formattedTime}</p>
            </div>
          </div>

          {/* 2. Formal Greeting (Top Left) */}
          <div className="px-4 mb-6 text-left">
            <h2 className="text-3xl font-logo font-bold text-[var(--accent-blue)] border-b border-[var(--accent-blue)]/20 inline-block pb-1">
              {todo.title}
            </h2>
            <br/>
            <h2 className="text-2xl font-logo font-bold text-[var(--accent-blue)]/80 mt-3 italic">
              Thân gửi: {todo.folder === 'sent' ? (todo.recipient?.name || todo.recipient?.email) : (user?.name || 'Bạn hữu')}
            </h2>
          </div>

          {/* 3. Paginated Letter Body with Lined Paper */}
          <div className="relative flex-1 animate-fade-in-up" key={currentPage}>
            {/* Notepad Margin Line */}
            <div className="absolute left-4 top-0 bottom-0 w-[1px] bg-red-200/40 pointer-events-none" />
            
            <div className="prose prose-base max-w-none text-[var(--text-main)] font-letter leading-[1.5em] whitespace-pre-wrap text-xl px-4 pl-10 paper-lined min-h-[400px]">
              {renderContentWithLinks(getCurrentPageLines()) || (
                <span className="text-[var(--text-soft)] opacity-40 italic font-hand text-lg">"Lá thư dường như có phần còn trống..."</span>
              )}
            </div>
          </div>

          {/* 4. Signature (Bottom Right - Last Page Only) */}
          {currentPage === totalPages - 1 && (
            <div className="flex justify-between items-end px-12 py-6 mt-6">
              <button 
                onClick={() => onReply(senderEmail)}
                className="flex items-center gap-2 px-6 py-2 rounded-full border border-[var(--accent-blue)] text-[var(--accent-blue)] font-logo text-xl hover:bg-[var(--accent-blue)] hover:text-white transition-all active:scale-95 shadow-sm"
              >
                <Reply className="w-5 h-5" />
                Phản hồi
              </button>
              
              <div className="text-center font-hand">
                <p className="text-lg text-[var(--text-soft)] italic mb-1">Trân trọng,</p>
                <div className="text-3xl font-logo font-bold text-[var(--accent-blue)] rotate-[-1deg] transition-transform hover:rotate-0 tracking-wide">
                  {senderName}
                </div>
              </div>
            </div>
          )}

          {/* 5. Pagination Buttons (Bottom Center) */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-8 mt-8 pb-10">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className="flex items-center gap-2 px-6 py-2 rounded-full border border-[var(--border-subtle)] text-[var(--text-soft)] font-hand text-xl hover:bg-black/5 disabled:opacity-20 transition-all select-none"
              >
                <ChevronLeft className="w-6 h-6" />
                
              </button>
              
              <div className="w-1 h-1 rounded-full bg-[var(--border-medium)]" />
              
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage === totalPages - 1}
                className="flex items-center gap-2 px-6 py-2 rounded-full border border-[var(--accent-blue)] text-[var(--accent-blue)] font-hand text-xl hover:bg-[var(--accent-blue)]/5 disabled:opacity-20 transition-all select-none animate-bounce-subtle"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({ icon, title, onClick, danger }) => (
  <button 
    onClick={onClick}
    className={`p-2.5 hover:bg-black/5 rounded-full transition-colors text-[var(--text-soft)] active:scale-90 ${danger ? 'hover:text-red-500' : ''}`} 
    title={title}
  >
    {icon}
  </button>
);

export default MailDetail;
