import React from 'react';
import { ASSETS } from '../../constants/assets';
import { Menu, Search, LogOut, Settings, HelpCircle, Bell } from 'lucide-react';

const Header = ({ user, onLogout, onMenuClick }) => {
  return (
    <header className="flex items-center justify-between px-4 py-1.5 bg-white border-b border-gray-100 h-[64px] sticky top-0 z-30">
      <div className="flex items-center gap-2 min-w-[232px]">
        <button 
          onClick={onMenuClick}
          className="p-2.5 hover:bg-gray-100 rounded-full transition-all active:scale-90 text-gray-600"
          title="Menu chính"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 px-1 cursor-pointer select-none">
          <img src={ASSETS.GMAIL_LOGO} alt="Gmail" className="h-7" />
        </div>
      </div>

      <div className="flex-1 max-w-[720px] px-4">
        <div className="relative group h-[48px]">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-500 group-focus-within:text-gray-900" />
          </div>
          <input
            type="text"
            className="block w-full h-full pl-12 pr-4 py-2 border-transparent bg-[#f1f3f4] rounded-lg focus:bg-white focus:shadow-md focus:ring-0 transition-all text-[16px] text-gray-800"
            placeholder="Tìm kiếm trong thư"
          />
        </div>
      </div>

      <div className="flex items-center gap-1 min-w-[280px] justify-end">
        <div className="flex items-center gap-0.5">
          <IconButton icon={<HelpCircle className="w-5 h-5" />} title="Hỗ trợ" />
          <IconButton icon={<Settings className="w-5 h-5" />} title="Cài đặt" />
          <IconButton icon={<Bell className="w-5 h-5" />} title="Thông báo" />
        </div>
        
        <div className="flex items-center ml-2 border-l border-gray-200 pl-3">
          <div className="hidden lg:flex flex-col items-end mr-3">
            <span className="text-sm font-semibold text-gray-900">{user?.name}</span>
            <span className="text-[11px] text-gray-500 truncate max-w-[120px]">{user?.email}</span>
          </div>
          <button 
            onClick={onLogout} 
            className="w-9 h-9 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-sm transition-all active:scale-95 group"
            title="Đăng xuất"
          >
            <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
};

const IconButton = ({ icon, title }) => (
  <button className="p-2.5 hover:bg-gray-100 rounded-full transition-colors text-gray-600" title={title}>
    {icon}
  </button>
);

export default Header;


