import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const GmailLayout = ({ children, user, onLogout, onCompose, activeFolder, setActiveFolder, inboxCount }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-[var(--bg-main)] overflow-hidden font-body text-[var(--text-main)]">
      <Header 
        user={user} 
        onLogout={onLogout} 
        onMenuClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar 
          onCompose={onCompose} 
          activeFolder={activeFolder}
          setActiveFolder={setActiveFolder}
          inboxCount={inboxCount}
          isCollapsed={isSidebarCollapsed}
        />
        
        {/* Main Content Area - Aged Paper Card */}
        <main className={`flex-1 flex flex-col transition-all duration-300 ease-in-out relative bg-[var(--bg-content)] mt-1 mb-6 mr-6 rounded-[var(--radius-xl)] shadow-md border border-[var(--border-subtle)] overflow-hidden`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default GmailLayout;
