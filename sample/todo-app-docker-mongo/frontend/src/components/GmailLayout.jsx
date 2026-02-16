import React from 'react';

const GmailLayout = ({ children, user, onLogout, onCompose, activeFolder, setActiveFolder }) => {
  return (
    <div className="flex flex-col h-screen bg-white font-sans text-gray-800">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <img src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_r5.png" alt="Gmail" className="h-8" />
          </div>
        </div>

        <div className="flex-1 max-w-3xl px-8">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border-transparent bg-gray-100 rounded-lg focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
              placeholder="Tìm kiếm thư"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 mr-4">
            <span className="text-sm font-medium">{user?.name}</span>
          </div>
          <button onClick={onLogout} title="Đăng xuất" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 flex flex-col pt-4 pr-4 border-r border-transparent">
          <div className="px-4 mb-4">
            <button
              onClick={onCompose}
              className="flex items-center gap-3 px-6 py-4 bg-white hover:shadow-md border border-gray-100 rounded-2xl transition-all font-medium text-gray-700 hover:bg-gray-50 group"
            >
              <svg className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Soạn thư</span>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto">
            <SidebarItem
              label="Hộp thư đến"
              icon="📥"
              count={children.props?.todos?.length || 0}
              active={activeFolder === 'inbox'}
              onClick={() => setActiveFolder('inbox')}
            />
            <SidebarItem
              label="Đã gắn dấu sao"
              icon="⭐"
              active={activeFolder === 'starred'}
              onClick={() => setActiveFolder('starred')}
            />
            <SidebarItem
              label="Đã gửi"
              icon="📤"
              active={activeFolder === 'sent'}
              onClick={() => setActiveFolder('sent')}
            />
            <SidebarItem
              label="Thư nháp"
              icon="📄"
              active={activeFolder === 'drafts'}
              onClick={() => setActiveFolder('drafts')}
            />
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col bg-white overflow-hidden m-2 rounded-xl shadow-sm border border-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
};

const SidebarItem = ({ label, icon, count, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-between w-full px-6 py-1 text-sm rounded-r-full transition-colors ${
      active ? 'bg-blue-100 text-blue-700 font-bold' : 'hover:bg-gray-100 text-gray-600'
    }`}
  >
    <div className="flex items-center gap-4">
      <span className="text-lg w-5">{icon}</span>
      <span>{label}</span>
    </div>
    {count > 0 && <span className="text-xs">{count}</span>}
  </button>
);

export default GmailLayout;
