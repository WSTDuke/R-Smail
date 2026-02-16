import React from 'react';
import { RotateCcw, Plus, Inbox, MoreVertical, Archive, Trash2, MailOpen, Clock } from 'lucide-react';
import MailItem from './MailItem';

const MailList = ({ todos, onToggle, onDelete }) => {
  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Mail List Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white sticky top-0 z-20 h-12">
        <div className="flex items-center gap-1">
          <div className="p-2 hover:bg-gray-100 rounded-md transition-colors cursor-pointer group pr-4">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-0 cursor-pointer" />
          </div>
          <div className="flex items-center gap-0.5 border-l border-gray-200 pl-2">
            <ToolbarButton icon={<RotateCcw className="w-4 h-4" />} title="Làm mới" />
            <ToolbarButton icon={<Archive className="w-4 h-4" />} title="Lưu trữ" />
            <ToolbarButton icon={<Trash2 className="w-4 h-4" />} title="Xóa" />
            <ToolbarButton icon={<MailOpen className="w-4 h-4" />} title="Đánh dấu là đã đọc" />
            <ToolbarButton icon={<Clock className="w-4 h-4" />} title="Tạm ẩn" />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-gray-500 font-medium mr-2">1-{todos.length} của {todos.length}</span>
          <ToolbarButton icon={<Plus className="w-4 h-4" />} title="Thêm công việc" />
          <ToolbarButton icon={<MoreVertical className="w-4 h-4" />} title="Khác" />
        </div>
      </div>

      {/* List Items */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {todos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 select-none">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Inbox className="w-12 h-12 text-gray-200" />
            </div>
            <p className="text-lg font-medium text-gray-500">Hộp thư đến trống</p>
            <p className="text-sm text-gray-400 mt-1">Tận hưởng khoảnh khắc thư giãn của bạn.</p>
          </div>
        ) : (
          <table className="w-full border-collapse table-fixed">
            <tbody className="divide-y divide-gray-50">
              {todos.map(todo => (
                <MailItem
                  key={todo._id}
                  todo={todo}
                  onToggle={onToggle}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const ToolbarButton = ({ icon, title }) => (
  <button className="p-2 hover:bg-gray-100 rounded-md transition-colors text-gray-600 active:bg-gray-200" title={title}>
    {icon}
  </button>
);

export default MailList;


