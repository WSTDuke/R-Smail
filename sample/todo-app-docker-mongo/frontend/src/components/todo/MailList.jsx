import React from 'react';
import { RotateCcw, Plus, Inbox, MoreVertical, Trash2 } from 'lucide-react';
import MailItem from './MailItem';

const MailList = ({ todos, selectedIds, onToggle, onStarToggle, onDelete, onSnooze, onUnsnooze, activeFolder, onSelectToggle, onSelectAll, onBulkDelete, onViewTodo, refreshTodos }) => {
  const isAllSelected = todos.length > 0 && selectedIds.length === todos.length;
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < todos.length;

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden font-hand">
      {/* Mail List Toolbar */}
      <div className="flex items-center justify-between px-6 py-2 bg-transparent sticky top-0 z-20 h-14 border-b border-[var(--border-subtle)]/50">
        <div className="flex items-center gap-4">
          <div className="p-1.5 hover:bg-black/5 rounded-full transition-all cursor-pointer group flex items-center">
            <input 
              type="checkbox" 
              checked={isAllSelected}
              ref={input => {
                if (input) input.indeterminate = isSomeSelected;
              }}
              onChange={(e) => onSelectAll(e.target.checked)}
              className="w-5 h-5 rounded-full border-[var(--border-medium)] text-[var(--accent-blue)] focus:ring-0 cursor-pointer transition-all bg-transparent" 
            />
          </div>
          <div className="flex items-center gap-1.5 pl-2 border-l border-[var(--border-subtle)]">
            <ToolbarButton icon={<RotateCcw className="w-5 h-5" />} title="Làm mới bàn làm việc" onClick={() => refreshTodos(activeFolder)} />
            <ToolbarButton 
              icon={<Trash2 className={`w-5 h-5 ${selectedIds.length > 0 ? 'text-red-700' : ''}`} />} 
              title="Đưa vào thùng rác" 
              onClick={onBulkDelete}
              disabled={selectedIds.length === 0}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-lg font-bold text-[var(--text-soft)] mr-2 whitespace-nowrap">{todos.length} lá thư trong hòm</span>
          <ToolbarButton icon={<Plus className="w-5 h-5" />} title="Viết thư mới" />
          <ToolbarButton icon={<MoreVertical className="w-5 h-5" />} title="Thêm nữa" />
        </div>
      </div>

      {/* List Items */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {todos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[var(--text-soft)] p-8 select-none animate-fade-in">
            <div className="w-32 h-32 bg-[var(--accent-blue)]/5 rounded-full flex items-center justify-center mb-8 shadow-inner border border-[var(--border-subtle)]/50 rotate-3 transition-transform hover:rotate-0">
              <Inbox className="w-16 h-16 text-[var(--accent-blue)]/10" />
            </div>
            <h3 className="text-3xl font-bold font-logo text-[var(--text-main)] mb-4">Hòm thư vắng lặng...</h3>
            <p className="text-xl font-hand text-[var(--text-soft)] max-w-sm text-center leading-relaxed">
              "Không có lá thư nào ở đây cả, hãy dành chút thời gian uống trà bạn nhé."
            </p>
          </div>
        ) : (
          <table className="w-full border-collapse table-fixed">
            <tbody className="divide-y divide-black/[0.03]">
              {todos.map(todo => (
                <MailItem
                  key={todo._id}
                  todo={todo}
                  isSelected={selectedIds.includes(todo._id)}
                  onToggle={onToggle}
                  onStarToggle={onStarToggle}
                  onDelete={onDelete}
                  onSnooze={onSnooze}
                  onUnsnooze={onUnsnooze}
                  activeFolder={activeFolder}
                  onSelect={onSelectToggle}
                  onViewTodo={onViewTodo}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const ToolbarButton = ({ icon, title, onClick, disabled }) => (
  <button 
    className={`p-2.5 hover:bg-black/5 rounded-full transition-all text-[var(--text-soft)] active:scale-90 ${disabled ? 'opacity-20 cursor-not-allowed grayscale' : ''}`} 
    title={title}
    onClick={onClick}
    disabled={disabled}
  >
    {icon}
  </button>
);

export default MailList;


