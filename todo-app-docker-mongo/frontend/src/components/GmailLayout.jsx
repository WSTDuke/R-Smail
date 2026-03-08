import React from 'react';

const GmailLayout = ({ children, user, onLogout, onCompose, activeFolder, setActiveFolder }) => {
  return (
    <div className="flex flex-col h-screen bg-[var(--bg-main)] font-body text-[var(--text-main)] overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-3 bg-[var(--bg-main)] z-30">
        <div className="flex items-center gap-6">
          <button className="p-2.5 hover:bg-black/5 rounded-full transition-colors text-[var(--text-soft)]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold tracking-tight text-[var(--accent-blue)] font-script select-none">R-Smail</span>
          </div>
        </div>

        <div className="flex-1 max-w-2xl px-12">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-[var(--text-soft)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-6 py-3 bg-black/5 border-transparent rounded-[2rem] focus:bg-white focus:shadow-md focus:ring-0 transition-all text-lg placeholder-[var(--text-soft)]"
              placeholder="Tìm thư cũ..."
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-[var(--accent-blue)] text-white text-lg font-script font-bold shadow-sm">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <button onClick={onLogout} title="Rời khỏi" className="p-2.5 hover:bg-black/5 rounded-full transition-colors text-[var(--text-soft)] hover:text-red-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <aside className="w-72 flex flex-col pt-6 pr-4 z-20">
          <div className="px-6 mb-8">
            <button
              onClick={onCompose}
              className="flex items-center justify-center gap-3 w-full py-4 bg-[var(--accent-blue)] text-white hover:bg-[var(--accent-blue)]/90 shadow-lg hover:shadow-xl rounded-[2rem] transition-all font-script text-2xl group"
            >
              <svg className="w-6 h-6 transition-transform duration-500 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Viết thư</span>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto pl-4 space-y-1">
            <SidebarItem
              label="Bưu tá đến"
              icon="🏮"
              count={children.props?.todos?.length || 0}
              active={activeFolder === 'inbox'}
              onClick={() => setActiveFolder('inbox')}
            />
            <SidebarItem
              label="Thư quan trọng"
              icon="🎗️"
              active={activeFolder === 'starred'}
              onClick={() => setActiveFolder('starred')}
            />
            <SidebarItem
              label="Thư đã đi"
              icon="🕊️"
              active={activeFolder === 'sent'}
              onClick={() => setActiveFolder('sent')}
            />
            <SidebarItem
              label="Bản nháp"
              icon="📜"
              active={activeFolder === 'drafts'}
              onClick={() => setActiveFolder('drafts')}
            />
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col bg-[var(--bg-content)] overflow-hidden my-4 mr-6 rounded-[3rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-[var(--border-subtle)] relative">
          {children}
        </main>
      </div>
    </div>
  );
};

const SidebarItem = ({ label, icon, count, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-between w-full px-5 py-3 rounded-full transition-all duration-300 group relative overflow-hidden ${
      active ? 'bg-black/5 text-[var(--accent-blue)]' : 'hover:bg-black/5 text-[var(--text-soft)] hover:text-[var(--text-main)]'
    }`}
  >
    <div className="flex items-center gap-4 relative z-10">
      <span className={`text-2xl transition-transform duration-500 ${active ? 'scale-110 rotate-12' : 'group-hover:scale-110 group-hover:-rotate-12'}`}>
        {icon}
      </span>
      <span className={`text-xl font-script tracking-wide ${active ? 'font-bold underline decoration-wavy decoration-[var(--accent-blue)]/30 underline-offset-4' : ''}`}>
        {label}
      </span>
    </div>
    {count > 0 && (
      <span className={`font-body text-sm px-2.5 py-0.5 rounded-full relative z-10 ${
        active ? 'bg-[var(--accent-blue)] text-white shadow-sm' : 'bg-black/5 text-[var(--text-soft)]'
      }`}>
        {count}
      </span>
    )}
  </button>
);

export default GmailLayout;
