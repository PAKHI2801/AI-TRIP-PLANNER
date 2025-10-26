import React, { useEffect, useState } from 'react';
import { Menu, Sun, ChevronDown, LogOut } from 'lucide-react';
import { FiUser } from 'react-icons/fi';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from 'config/db';
import { useNavigate } from 'react-router-dom';

function Header({ onToggleSidebar, onToggleTheme }) {
  const [username, setUsername] = useState('Admin');
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, 'user', user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUsername(userData.username || user.email);
          } else {
            const adminDocRef = doc(db, 'admin', user.uid);
            const adminDocSnap = await getDoc(adminDocRef);
            if (adminDocSnap.exists()) {
              const adminData = adminDocSnap.data();
              setUsername(adminData.username || adminData.email);
            } else {
              setUsername(user.email);
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUsername(user.email);
        }
      } else {
        setUsername('');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    navigate('/home');
  };

  return (
    <header
      className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b 
                 border-slate-300/50 dark:border-slate-700/50 px-6 py-4 
                 shadow-sm transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Sidebar Toggle */}
          <button
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 
                       hover:bg-slate-100 dark:hover:bg-slate-800 
                       transition-colors"
            onClick={onToggleSidebar}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Title */}
          <div className="hidden md:block">
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 bg-clip-text  text-transparent">
              Dashboard
            </h1>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Hey, <span className="font-semibold text-indigo-600">{username}</span> — ready for a productive day?
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 
                       hover:bg-slate-100 dark:hover:bg-slate-800 
                       transition-colors"
          >
            <Sun className="w-5 h-5" />
          </button>

          {/* User Info */}
          <div
            className="flex items-center space-x-3 pl-4 border-l border-slate-200 
                       dark:border-slate-700"
          >
            <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
              <FiUser className="w-4 h-4" />
            </div>

            <div className="hidden md:block">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {username}
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Administrator
              </p>
            </div>

            <ChevronDown className="w-4 h-4 text-slate-400" />

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="ml-3 flex items-center space-x-1 px-3 py-1.5 
                         rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 
                         text-white hover:from-pink-600 hover:to-purple-700 
                         transition-all duration-200 shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
