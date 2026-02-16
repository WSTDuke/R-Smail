import React, { useState } from 'react';
import { Minus, X, Paperclip, Trash2, Maximize2, Image, Link, Smile, MoreVertical } from 'lucide-react';

const ComposeModal = ({ isOpen, onClose, onAddTodo }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTodo(title, description);
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed bottom-0 right-0 md:right-16 z-50 w-full max-w-[512px] bg-white shadow-2xl rounded-t-xl border border-gray-200 flex flex-col transition-all duration-300 transform animate-slide-up overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#f2f6fc] text-[#001d35] h-10 border-b border-gray-200">
        <span className="text-[14px] font-semibold">Thư mới</span>
        <div className="flex items-center gap-1">
          <button onClick={onClose} className="p-1.5 hover:bg-[#dfe3e9] rounded text-gray-600 transition-colors">
            <Minus className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-[#dfe3e9] rounded text-gray-600 transition-colors">
            <Maximize2 className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="p-1.5 hover:bg-[#dfe3e9] rounded text-gray-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col">
        {/* Recipients & Subject */}
        <div className="px-4 border-b border-gray-100 flex items-center h-10">
          <span className="text-sm text-gray-500 w-16">Đến</span>
          <input
            type="text"
            className="flex-1 text-sm outline-none text-gray-800 bg-transparent font-medium"
            disabled
            value="Hệ thống Công việc (To Do)"
          />
        </div>
        <div className="px-4 border-b border-gray-100 flex items-center h-10">
          <input
            type="text"
            placeholder="Tiêu đề"
            className="w-full text-sm outline-none focus:ring-0 font-medium bg-transparent"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
        </div>

        {/* Body Content */}
        <div className="px-4 py-4 min-h-[280px]">
          <textarea
            placeholder="Nội dung công việc..."
            className="w-full h-full text-[14px] outline-none resize-none focus:ring-0 min-h-[260px] leading-relaxed"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-100 h-14">
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="bg-[#0b57d0] hover:bg-[#0842a0] text-white px-7 py-2.5 rounded-full text-sm font-semibold shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              Gửi
            </button>
            <div className="flex items-center gap-1 border-l border-gray-200 ml-1 pl-2">
              <IconButton icon={<Paperclip className="w-4 h-4" />} title="Đính kèm tệp" />
              <IconButton icon={<Link className="w-4 h-4" />} title="Chèn liên kết" />
              <IconButton icon={<Smile className="w-4 h-4" />} title="Chèn biểu tượng cảm xúc" />
              <IconButton icon={<Image className="w-4 h-4" />} title="Chèn ảnh" />
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <IconButton icon={<MoreVertical className="w-4 h-4" />} title="Tùy chọn khác" />
            <IconButton 
              icon={<Trash2 className="w-4 h-4" />} 
              title="Loại bỏ thư nháp" 
              onClick={() => { if(window.confirm('Hủy thư này?')) { setTitle(''); setDescription(''); onClose(); } }}
            />
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
    className="p-2 hover:bg-gray-100 rounded text-gray-600 transition-colors" 
    title={title}
  >
    {icon}
  </button>
);

export default ComposeModal;


