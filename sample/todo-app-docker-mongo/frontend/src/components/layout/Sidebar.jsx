import React from 'react';
import { Inbox, Star, Send, FileText, Plus, Clock, AlertCircle, Trash2, PenLine } from 'lucide-react';

const Sidebar = ({ onCompose, activeFolder, setActiveFolder, inboxCount, isCollapsed }) => {
  return (
    <aside className={`flex flex-col pt-2 transition-all duration-300 ease-in-out border-r border-transparent ${
      isCollapsed ? 'w-[72px]' : 'w-[256px]'
    }`}>
      <div className="mb-4 flex h-[64px] items-center px-0">
        <button
          onClick={onCompose}
          className={`group flex items-center bg-white hover:shadow-lg border border-gray-100 transition-all duration-300 font-medium text-gray-700 hover:bg-gray-50 active:scale-95 shadow-sm overflow-hidden ml-2 ${
            isCollapsed 
              ? 'w-14 h-14 rounded-full justify-center' 
              : 'h-14 rounded-2xl w-auto min-w-[140px] pr-6 shadow-md'
          }`}
          title={isCollapsed ? "Soạn thư" : ""}
        >
          <div className="flex-shrink-0 w-[56px] h-14 flex items-center justify-center">
            <PenLine className={`w-6 h-6 text-red-500`} />
          </div>
          {!isCollapsed && <span className="text-[14px] font-bold">Soạn thư</span>}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto pr-2">
        <SidebarItem
          label="Hộp thư đến"
          icon={<Inbox className="w-[20px] h-[20px]" />}
          count={inboxCount}
          active={activeFolder === 'inbox'}
          onClick={() => setActiveFolder('inbox')}
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          label="Có gắn dấu sao"
          icon={<Star className="w-[20px] h-[20px]" />}
          active={activeFolder === 'starred'}
          onClick={() => setActiveFolder('starred')}
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          label="Tạm ẩn"
          icon={<Clock className="w-[20px] h-[20px]" />}
          active={activeFolder === 'snoozed'}
          onClick={() => setActiveFolder('snoozed')}
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          label="Quan trọng"
          icon={<AlertCircle className="w-[20px] h-[20px]" />}
          active={activeFolder === 'important'}
          onClick={() => setActiveFolder('important')}
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          label="Đã gửi"
          icon={<Send className="w-[20px] h-[20px]" />}
          active={activeFolder === 'sent'}
          onClick={() => setActiveFolder('sent')}
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          label="Thư nháp"
          icon={<FileText className="w-[20px] h-[20px]" />}
          active={activeFolder === 'drafts'}
          onClick={() => setActiveFolder('drafts')}
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          label="Thùng rác"
          icon={<Trash2 className="w-[20px] h-[20px]" />}
          active={activeFolder === 'trash'}
          onClick={() => setActiveFolder('trash')}
          isCollapsed={isCollapsed}
        />
      </nav>
    </aside>
  );
};

const SidebarItem = ({ label, icon, count, active, onClick, isCollapsed }) => (
  <button
    onClick={onClick}
    title={isCollapsed ? label : ""}
    className={`flex items-center transition-all duration-200 text-sm h-8 mb-0.5 rounded-r-full relative group overflow-hidden ${
      isCollapsed 
        ? 'w-[56px] h-12 ml-2 justify-start' 
        : 'w-full pr-3'
    } ${
      active 
        ? 'bg-[#c2e7ff] text-[#001d35] font-bold' 
        : 'hover:bg-[#e1e3e1] text-gray-700'
    }`}
  >
    <div className="flex items-center w-full">
      <div className={`flex-shrink-0 w-[56px] h-12 flex items-center justify-center ${active ? 'text-[#001d35]' : 'text-gray-600'}`}>
        {icon}
      </div>
      {!isCollapsed && <span className="truncate whitespace-nowrap ml-1">{label}</span>}
      {!isCollapsed && count > 0 && (
        <span className={`text-[12px] ml-auto pr-2 ${active ? 'text-[#001d35]' : 'text-gray-600'}`}>
          {count}
        </span>
      )}
    </div>
  </button>
);

export default Sidebar;


