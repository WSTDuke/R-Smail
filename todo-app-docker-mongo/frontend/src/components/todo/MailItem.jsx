import React from 'react';
import { Trash2, RotateCcw, Star, Clock } from 'lucide-react';

const MailItem = ({ todo, isSelected, onToggle, onStarToggle, onDelete, onSnooze, onUnsnooze, activeFolder, onSelect, onViewTodo }) => {
  const date = new Date(todo.createdAt || Date.now());
  const formattedDate = date.toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'short'
  });

  return (
    <tr
      onClick={() => onViewTodo(todo)}
      className={`group border-b border-[var(--border-subtle)]/50 hover:bg-white hover:shadow-lg cursor-pointer transition-all duration-300 mail-item-row relative z-10 font-hand ${
        isSelected ? 'bg-[var(--accent-blue)]/5' : 'bg-transparent'
      } ${todo.completed ? 'opacity-50' : ''}`}
    >
      <td className="w-[90px] py-2 pl-6 pr-1 whitespace-nowrap relative border-y border-[var(--border-subtle)]/30">
        <div className="flex items-center gap-3">
          <div 
            className="p-1 hover:bg-black/5 rounded-full transition-all cursor-pointer group flex items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => {
                e.stopPropagation();
                onSelect(todo._id);
              }}
              className="w-5 h-5 rounded-full border-[var(--border-medium)] text-[var(--accent-blue)] focus:ring-0 cursor-pointer shadow-sm transition-all bg-transparent"
            />
          </div>
          <button 
            className={`p-1 rounded-full transition-all hover:bg-black/5 active:scale-90 ${todo.starred ? 'text-yellow-600' : 'text-gray-300 hover:text-gray-400'}`}
            onClick={(e) => { e.stopPropagation(); onStarToggle(todo._id); }}
          >
            <Star className={`w-5 h-5 ${todo.starred ? 'fill-yellow-600' : ''}`} />
          </button>
        </div>
      </td>
      
      <td className={`border-y border-[var(--border-subtle)]/30 px-2 py-2 flex-1 min-w-0 transition-all ${todo.completed ? 'text-[var(--text-soft)] italic' : 'text-[var(--text-main)] font-bold'}`}>
        <div className="flex items-center gap-6 h-12">
          <span className="w-[180px] lg:w-[220px] truncate flex-shrink-0 text-lg tracking-wide">
            {todo.folder === 'sent' 
              ? `Gửi tới: ${todo.recipient?.name || todo.recipient?.email || 'Người nhận'}` 
              : `${todo.sender?.name || (todo.completed ? 'Đã xong' : `R-Smail To Do`)}`}
          </span>
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <span className={`text-lg tracking-tight ${!todo.completed ? 'text-[var(--accent-blue)]' : 'text-[var(--text-soft)]'}`}>
              {todo.title}
            </span>
            <span className="text-base text-[var(--text-soft)] truncate font-normal flex-shrink-1 italic opacity-60">
              {todo.description ? `~ ${todo.description.length > 50 ? todo.description.substring(0, 50) + '...' : todo.description}` : ''}
            </span>
          </div>
        </div>
      </td>

      <td className="w-[160px] px-6 py-2 text-right relative overflow-hidden h-12 border-y border-[var(--border-subtle)]/30">
        <div className="flex items-center justify-end h-full">
          {/* Default Date View */}
          <span className="group-hover:hidden text-base text-[var(--text-soft)] italic">
            {formattedDate}
          </span>
          
          {/* Hover Actions */}
          <div className="hidden group-hover:flex items-center gap-2 bg-[var(--bg-content)]/95 backdrop-blur-md pl-4 rounded-l-full">
            <ActionButton 
              icon={<Trash2 className="w-5 h-5" />} 
              title="Vứt bỏ" 
              onClick={(e) => { e.stopPropagation(); onDelete(todo._id); }}
              danger
            />
            {activeFolder === 'snoozed' ? (
              <ActionButton 
                icon={<RotateCcw className="w-5 h-5" />} 
                title="Trả lại" 
                onClick={(e) => { e.stopPropagation(); onUnsnooze(todo._id); }}
              />
            ) : (
              <ActionButton 
                icon={<Clock className="w-5 h-5" />} 
                title="Gửi sau" 
                onClick={(e) => { e.stopPropagation(); onSnooze(todo._id); }}
              />
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};

const ActionButton = ({ icon, title, onClick, danger, active }) => (
  <button
    onClick={onClick}
    className={`p-2.5 rounded-full transition-all active:scale-95 ${
      danger 
        ? 'hover:bg-red-50 hover:text-red-500 text-[var(--text-soft)]' 
        : active 
          ? 'hover:bg-black/5 text-[var(--accent-blue)]' 
          : 'hover:bg-black/5 text-[var(--text-soft)] hover:text-[var(--text-main)]'
    }`}
    title={title}
  >
    {icon}
  </button>
);

export default MailItem;

