import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  CircleGauge, Database, FileText, Folder, Layers, 
  BarChart3, BookOpen, ChartPie, Bot, LogOut,
  type LucideIcon 
} from 'lucide-react';

export interface MenuItem {
  name: string;
  icon: LucideIcon;
  path: string;
}

const Sidebar: React.FC = () => {
  const menuItems: MenuItem[] = [
    { name: 'Dashboard', icon: CircleGauge, path: '/dashboard' },
    { name: 'Analytics', icon: BarChart3, path: '/analytics' },
    { name: 'Projects', icon: Folder, path: '/projects' },
     { name: 'Reports', icon: FileText, path: '/reports' },
  ];

  const documentItems: MenuItem[] = [
    { name: 'Data Library', icon: Database, path: '/library' },
   
    { name: 'Word Assistant', icon: BookOpen, path: '/word-assistant' },
    { name: 'AI Assistant', icon: Bot, path: '/ai' }, 
  ];

  return (
    
    <div className="w-64 min-h-screen bg-[#000000] border-r border-gray-900 flex flex-col p-4 text-gray-400 sticky top-0">
      
      {/* Brand Logo */}
      {/* <FileSearchCorner /> */}

      <div className="flex items-center gap-3 px-2 mb-10 mt-2">
        <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center">
          <div className="w-3 h-3 bg-[#0f0f0f] rotate-45"></div>
        </div>
        <span className="text-white font-bold text-lg tracking-tight">LegalLens</span>
      </div>


      <div className="px-2 mb-4 flex justify-between items-center">
        <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">Documents</span>
        <ChartPie size={12} className="text-gray-700" />
      </div>
      {/* Navigation */}
      <nav className="space-y-1 mb-10">
        {menuItems.map((item) => <SidebarLink key={item.name} item={item} />)}
      </nav>

      <div className="px-2 mb-4 flex justify-between items-center">
        <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">Documents</span>
        <ChartPie size={12} className="text-gray-700" />
      </div>
      
      <nav className="space-y-1 flex-1">
        {documentItems.map((item) => <SidebarLink key={item.name} item={item} />)}
      </nav>

      {/* Profile Section */}
      <div className="pt-4 mt-4 border-t border-gray-800 flex items-center gap-3 px-3 py-3">
        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-300 border border-zinc-700">AA</div>
        <div className="flex-1 overflow-hidden">
          <p className="text-xs font-bold text-white truncate">Aymane</p>
          <p className="text-[10px] text-gray-500 truncate">Aymaneaitmansour@gmail.com</p>
        </div>
        <button className="text-gray-500 hover:text-rose-500 transition-colors"><LogOut size={14} /></button>
      </div>
    </div>
  );
};

const SidebarLink: React.FC<{ item: MenuItem }> = ({ item }) => (
  <NavLink
    to={item.path}
    className={({ isActive }) => `
      flex items-center gap-3 px-3 py-2 rounded-md transition-all group
      ${isActive ? 'bg-[#1a1a1a] text-white shadow-sm' : 'hover:bg-[#1a1a1a] hover:text-gray-200'}
    `}
  >
    {({ isActive }) => (
      <>
        <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'} />
        <span className="text-sm font-medium">{item.name}</span>
      </>
    )}
  </NavLink>
);

export default Sidebar;