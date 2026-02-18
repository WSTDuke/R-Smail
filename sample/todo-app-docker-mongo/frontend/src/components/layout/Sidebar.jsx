import { Inbox, Star, Send, Clock, AlertCircle, Trash2, PenLine } from 'lucide-react';

const Sidebar = ({ onCompose, activeFolder, setActiveFolder, inboxCount, isCollapsed }) => {
  return (
    <aside className={`flex flex-col pt-3 transition-all duration-300 ease-in-out border-r border-transparent z-20 ${
      isCollapsed ? 'w-[72px]' : 'w-[240px]'
    }`}>
      <div className="mb-6 flex h-[56px] items-center px-3">
        <button
          onClick={onCompose}
          className={`group flex items-center bg-[var(--bg-content)] hover:shadow-lg border border-[var(--border-subtle)] transition-all duration-300 font-hand text-[var(--accent-blue)] hover:bg-white active:scale-95 shadow-sm overflow-hidden ${
            isCollapsed 
              ? 'w-12 h-12 rounded-full justify-center' 
              : 'h-12 rounded-[1.5rem] w-full min-w-[180px] pr-6 pl-1'
          }`}
          title={isCollapsed ? "Viết thư tay" : ""}
        >
          <div className="flex-shrink-0 w-[48px] h-12 flex items-center justify-center">
            <PenLine className={`w-5 h-5 text-[var(--accent-blue)] transition-transform group-hover:rotate-12`} />
          </div>
          {!isCollapsed && <span className="text-xl font-bold tracking-wide">Viết thư tay</span>}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto pr-3 font-hand">
        <SidebarItem
          label="Trong hòm"
          icon={<Inbox className="w-5 h-5" />}
          count={inboxCount}
          active={activeFolder === 'inbox'}
          onClick={() => setActiveFolder('inbox')}
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          label="Gìn giữ"
          icon={<Star className="w-5 h-5" />}
          active={activeFolder === 'starred'}
          onClick={() => setActiveFolder('starred')}
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          label="Tạm ẩn"
          icon={<Clock className="w-5 h-5" />}
          active={activeFolder === 'snoozed'}
          onClick={() => setActiveFolder('snoozed')}
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          label="Lời nhắn quan trọng"
          icon={<AlertCircle className="w-5 h-5" />}
          active={activeFolder === 'important'}
          onClick={() => setActiveFolder('important')}
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          label="Thư đi"
          icon={<Send className="w-5 h-5" />}
          active={activeFolder === 'sent'}
          onClick={() => setActiveFolder('sent')}
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          label="Thùng rác"
          icon={<Trash2 className="w-5 h-5" />}
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
    className={`flex items-center transition-all duration-300 h-10 mb-1 rounded-r-[var(--radius-lg)] relative group overflow-hidden ${
      isCollapsed 
        ? 'w-[56px] ml-2 justify-center' 
        : 'w-full pr-3'
    } ${
      active 
        ? 'bg-[var(--accent-blue-soft)] text-[var(--accent-blue)] font-bold shadow-sm' 
        : 'hover:bg-black/5 text-[var(--text-soft)] hover:text-[var(--text-main)]'
    }`}
  >
    <div className="flex items-center w-full">
      <div className={`flex-shrink-0 w-[56px] h-10 flex items-center justify-center transition-colors ${active ? 'text-[var(--accent-blue)]' : 'group-hover:text-[var(--text-main)]'}`}>
        {icon}
      </div>
      {!isCollapsed && <span className="text-lg truncate whitespace-nowrap ml-1 tracking-wide">{label}</span>}
      {!isCollapsed && count > 0 && (
        <span className={`text-base ml-auto px-2 py-0.5 rounded-full bg-black/5 ${active ? 'text-[var(--accent-blue)]' : 'text-[var(--text-soft)]'}`}>
          {count}
        </span>
      )}
    </div>
  </button>
);

export default Sidebar;
