import { Menu, Search, LogOut, Settings, HelpCircle } from 'lucide-react';

const Header = ({ user, onLogout, onMenuClick }) => {
  return (
    <header className="flex items-center justify-between px-6 py-1 bg-[var(--bg-main)] h-[60px] sticky top-0 z-30 font-body">
      <div className="flex items-center gap-2 min-w-[200px]">
        <button 
          onClick={onMenuClick}
          className="p-2 hover:bg-black/5 rounded-full transition-all active:scale-90 text-[var(--text-soft)]"
          title="Bản tin"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 px-1 cursor-pointer select-none">
          <span className="text-2xl font-bold tracking-tight text-[var(--accent-blue)] font-logo">R-Smail</span>
        </div>
      </div>

      <div className="flex-1 max-w-[600px] px-4">
        <div className="relative group h-[40px]">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-[var(--text-soft)] group-focus-within:text-[var(--accent-blue)]" />
          </div>
          <input
            type="text"
            className="block w-full h-full pl-11 pr-5 py-1.5 border-2 border-transparent bg-black/5 rounded-[1.5rem] focus:bg-[var(--bg-content)] focus:border-[var(--border-subtle)] focus:shadow-sm focus:ring-0 transition-all text-base text-[var(--text-main)] placeholder-[var(--text-soft)]"
            placeholder="Tìm những lá thư cũ..."
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5 min-w-[250px] justify-end">
        <div className="flex items-center gap-0.5">
          <IconButton icon={<HelpCircle className="w-5 h-5" />} title="Hỏi han" />
          <IconButton icon={<Settings className="w-5 h-5" />} title="Sửa sang" />
        </div>
        
        <div className="flex items-center ml-3 border-l border-[var(--border-subtle)] pl-4">
          <div className="hidden lg:flex flex-col items-end mr-3">
            <span className="text-lg font-bold text-[var(--text-main)] font-logo leading-tight">{user?.name}</span>
            <span className="text-xs italic text-[var(--text-soft)] truncate max-w-[120px]">{user?.email}</span>
          </div>
          <button 
            onClick={onLogout} 
            className="w-9 h-9 flex items-center justify-center bg-[var(--accent-blue)] hover:bg-[var(--accent-blue)]/90 text-white rounded-full shadow-md shadow-[var(--accent-blue)]/20 transition-all active:scale-95 group"
            title="Rời khỏi"
          >
            <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
};

const IconButton = ({ icon, title }) => (
  <button className="p-2.5 hover:bg-black/5 rounded-full transition-all text-[var(--text-soft)] active:scale-90" title={title}>
    {icon}
  </button>
);

export default Header;


