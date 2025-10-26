import { icons, Zap } from "lucide-react";
import React from "react";
import {
  FiHome,
  FiUsers,
  FiUser,
  FiStar,
  FiBarChart2,
  FiSettings,
  FiPlus,
} from "react-icons/fi";
import { FaMapMarkedAlt, FaUserCircle } from "react-icons/fa";

const menuItems = [
  {
    id: "dashboard",
    icon: <FiHome />,
    label: "Dashboard",
    active: true,
  },
  {
    id: "user",
    icon: <FiUsers />,
    label: "User Details",
    active: true,
  },
  {
    id: "trip",
    icon: <FaMapMarkedAlt />,
    label: "Planned Trips",
    active: true,
  },
  {
    id: "review",
    icon: <FiStar />,
    label: "Reviews",
    active: true,
  },
];

function Sidebar({ collapsed, onToggle, currentPage, onPageChange }) {
  return (
    <div
      className={`${
        collapsed ? "w-20" : "w-72"
      } transition-all duration-300 ease-in-out 
      dark:bg-blue-900/20 backdrop-blur-xl border-r border-slate-200/50
      dark:border-slate-700/50 flex flex-col relative z-10
      h-screen fixed sm:static top-0 left-0 sm:h-auto sm:relative
      overflow-y-auto sm:overflow-visible`}
    >
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600
          rounded-xl flex items-center justify-center shadow-lg"
          >
            <Zap className="w-6 h-6 text-white" />
          </div>

          {!collapsed && (
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-black">
                Welcome, Admin
              </h1>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Admin Panel
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Menu */}
      <nav className="flex-1 p-3 sm:p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.id}>
            <button
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl 
                transition-all duration-200 ${
                  currentPage === item.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                    : "text-black hover:bg-slate-100 dark:hover:bg-slate-800/50"
                }`}
            >
              <div className="flex items-center space-x-3">
                {item.icon}
                {!collapsed && (
                  <span className="font-medium ml-2">{item.label}</span>
                )}
              </div>
            </button>
          </div>
        ))}
      </nav>

      
    </div>
  );
}

export default Sidebar;
