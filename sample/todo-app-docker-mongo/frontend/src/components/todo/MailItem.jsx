import React from 'react';
import { Trash2, RotateCcw, CheckCircle2, Star, Archive, MailOpen, Clock } from 'lucide-react';

const MailItem = ({ todo, onToggle, onDelete }) => {
  const date = new Date(todo.createdAt || Date.now());
  const formattedDate = date.toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'short'
  });

  return (
    <tr
      className={`group border-b border-transparent hover:border-gray-200 cursor-pointer transition-all duration-75 mail-item-row relative ${
        todo.completed ? 'bg-[#f2f6fc] opacity-80' : 'bg-white'
      }`}
    >
      <td className="w-[52px] py-1 px-4 whitespace-nowrap relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-1 hover:bg-gray-100 rounded-md transition-colors">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={(e) => {
                e.stopPropagation();
                onToggle(todo._id);
              }}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-0 cursor-pointer"
            />
          </div>
          <button className="text-gray-300 hover:text-yellow-400 p-1 rounded-md transition-colors">
            <Star className={`w-[20px] h-[20px] ${todo.starred ? 'text-yellow-400 fill-yellow-400' : ''}`} />
          </button>
        </div>
      </td>
      
      <td className={`px-2 py-1 flex-1 min-w-0 transition-all ${todo.completed ? 'text-gray-500 font-normal' : 'text-gray-900 font-semibold'}`}>
        <div className="flex items-center gap-4 h-9">
          <span className="w-[120px] lg:w-[180px] truncate flex-shrink-0 text-[14px]">
            {todo.completed ? 'Đã hoàn thành' : 'Hệ thống To Do'}
          </span>
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="text-[14px] truncate">
              {todo.title}
            </span>
            <span className="text-[14px] text-gray-500 font-normal truncate">
              - {todo.description || 'Không có mô tả chi tiết cho công việc này'}
            </span>
          </div>
        </div>
      </td>

      <td className="w-[180px] px-4 py-1 text-right relative overflow-hidden h-9">
        <div className="flex items-center justify-end h-full">
          {/* Default Date View */}
          <span className="group-hover:hidden text-[12px] font-medium text-gray-600">
            {formattedDate}
          </span>
          
          {/* Hover Actions */}
          <div className="hidden group-hover:flex items-center gap-1 bg-white/90 backdrop-blur-sm pl-2">
            <ActionButton icon={<Archive className="w-4 h-4" />} title="Lưu trữ" />
            <ActionButton 
              icon={<Trash2 className="w-4 h-4" />} 
              title="Xóa" 
              onClick={(e) => { e.stopPropagation(); onDelete(todo._id); }}
              danger
            />
            <ActionButton icon={<MailOpen className="w-4 h-4" />} title="Đánh dấu là chưa đọc" />
            <ActionButton 
              icon={todo.completed ? <RotateCcw className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />} 
              title={todo.completed ? "Làm mới" : "Hoàn thành"} 
              onClick={(e) => { e.stopPropagation(); onToggle(todo._id); }}
              active={!todo.completed}
            />
            <ActionButton icon={<Clock className="w-4 h-4" />} title="Tạm ẩn" />
          </div>
        </div>
      </td>
    </tr>
  );
};

const ActionButton = ({ icon, title, onClick, danger, active }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-full transition-all active:scale-90 ${
      danger 
        ? 'hover:bg-red-50 hover:text-red-500 text-gray-500' 
        : active 
          ? 'hover:bg-blue-50 hover:text-blue-600 text-blue-500' 
          : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
    }`}
    title={title}
  >
    {icon}
  </button>
);

export default MailItem;

