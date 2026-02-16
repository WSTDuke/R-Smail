import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const GmailLayout = ({ children, user, onLogout, onCompose, activeFolder, setActiveFolder, inboxCount }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-[#f6f8fc] overflow-hidden">
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
        
        {/* Main Content Area - Premium Rounded Card */}
        <main className={`flex-1 flex flex-col transition-all duration-300 ease-in-out relative bg-white mt-1 mb-4 mr-4 rounded-[24px] shadow-sm border border-gray-100 overflow-hidden`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default GmailLayout;
