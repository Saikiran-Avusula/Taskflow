import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function NavBar() {
  const { role, logout } = useAuth();
  const navigate = useNavigate();
  const dashboardPath = role === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard';
  const tasksPath = role === 'ADMIN' ? '/admin/tasks' : '/user/tasks';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = role ? role[0] : 'T';
  const roleLabel = role ?? 'USER';

  return (
    <aside className="fixed top-0 left-0 w-[260px] h-screen flex flex-col px-5 py-6 bg-[#111318] border-r border-[#252830] z-60">
      {/* Top section */}
      <div className="flex flex-col items-start gap-2.5">
        <div className="flex items-center gap-2.5 text-[#ECEEF2] font-bold text-base" style={{ fontFamily: 'Syne, sans-serif' }}>
          <span className="w-8 h-8 rounded-sm bg-[#A8FF3E] text-[#080A0E] font-bold text-sm flex items-center justify-center">TF</span>
          <span>TaskFlow</span>
        </div>

        <div className="inline-flex gap-1.5 px-2 py-0.75 text-[#A8FF3E] text-xs tracking-widest border border-[#252830] rounded-full bg-[#1C1F28]">
          <span>{roleLabel}</span>
        </div>

        <div className="mt-2.5 text-[#6B7280] text-xs leading-relaxed">
          {roleLabel === 'ADMIN' ? 'Administrator' : 'Team member'}
        </div>
      </div>

      {/* Divider */}
      <div className="my-5 border-t border-[#252830]" />
      <div className="text-xs tracking-wider text-[#3D4148] uppercase mb-1.5">Navigation</div>

      {/* Nav items */}
      <nav className="flex flex-col gap-1.5">
        <NavLink 
          to={dashboardPath}
          className={({ isActive }) => `px-5 py-2.5 flex items-center gap-3 text-[#6B7280] text-sm rounded-none cursor-pointer transition-all duration-150 hover:bg-[#1C1F28] hover:text-[#ECEEF2] ${isActive ? 'bg-gradient-to-r from-[rgba(168,255,62,0.08)] to-transparent text-[#ECEEF2] border-l-[3px] border-l-[#A8FF3E] pl-[60px]' : ''}`}
        >
          Dashboard
        </NavLink>
        {role === 'ADMIN' && (
          <>
            <NavLink 
              to="/admin/projects"
              className={({ isActive }) => `px-5 py-2.5 flex items-center gap-3 text-[#6B7280] text-sm rounded-none cursor-pointer transition-all duration-150 hover:bg-[#1C1F28] hover:text-[#ECEEF2] ${isActive ? 'bg-gradient-to-r from-[rgba(168,255,62,0.08)] to-transparent text-[#ECEEF2] border-l-[3px] border-l-[#A8FF3E] pl-[60px]' : ''}`}
            >
              Projects
            </NavLink>
            <NavLink 
              to="/admin/tasks"
              className={({ isActive }) => `px-5 py-2.5 flex items-center gap-3 text-[#6B7280] text-sm rounded-none cursor-pointer transition-all duration-150 hover:bg-[#1C1F28] hover:text-[#ECEEF2] ${isActive ? 'bg-gradient-to-r from-[rgba(168,255,62,0.08)] to-transparent text-[#ECEEF2] border-l-[3px] border-l-[#A8FF3E] pl-[60px]' : ''}`}
            >
              Tasks
            </NavLink>
            <NavLink 
              to="/admin/users"
              className={({ isActive }) => `px-5 py-2.5 flex items-center gap-3 text-[#6B7280] text-sm rounded-none cursor-pointer transition-all duration-150 hover:bg-[#1C1F28] hover:text-[#ECEEF2] ${isActive ? 'bg-gradient-to-r from-[rgba(168,255,62,0.08)] to-transparent text-[#ECEEF2] border-l-[3px] border-l-[#A8FF3E] pl-[60px]' : ''}`}
            >
              Users
            </NavLink>
          </>
        )}
        {role === 'USER' && (
          <>
            <NavLink 
              to="/user/projects"
              className={({ isActive }) => `px-5 py-2.5 flex items-center gap-3 text-[#6B7280] text-sm rounded-none cursor-pointer transition-all duration-150 hover:bg-[#1C1F28] hover:text-[#ECEEF2] ${isActive ? 'bg-gradient-to-r from-[rgba(168,255,62,0.08)] to-transparent text-[#ECEEF2] border-l-[3px] border-l-[#A8FF3E] pl-[60px]' : ''}`}
            >
              Projects
            </NavLink>
            <NavLink 
              to={tasksPath}
              className={({ isActive }) => `px-5 py-2.5 flex items-center gap-3 text-[#6B7280] text-sm rounded-none cursor-pointer transition-all duration-150 hover:bg-[#1C1F28] hover:text-[#ECEEF2] ${isActive ? 'bg-gradient-to-r from-[rgba(168,255,62,0.08)] to-transparent text-[#ECEEF2] border-l-[3px] border-l-[#A8FF3E] pl-[60px]' : ''}`}
            >
              My Tasks
            </NavLink>
          </>
        )}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom section */}
      <div className="border-t border-[#252830] pt-4 pb-4 px-5 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-[#1C1F28] border border-[#252830] flex items-center justify-center text-[#A8FF3E] font-bold text-xs flex-shrink-0">
          {initials}
        </div>
        <div className="flex flex-col gap-0.5 overflow-hidden">
          <div className="text-[#ECEEF2] text-sm">
            {roleLabel === 'ADMIN' ? 'Admin' : 'User'}
          </div>
          <div className="text-[#3D4148] text-xs whitespace-nowrap overflow-hidden text-ellipsis">
            {roleLabel.toLowerCase()}@taskflow.local
          </div>
        </div>
        <button 
          className="ml-auto bg-transparent border-none text-[#3D4148] cursor-pointer transition-colors duration-150 hover:text-[#EF4444]" 
          onClick={handleLogout} 
          title="Logout"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
