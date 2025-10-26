import React from 'react';
import StatGrid from './StatGrid';
import Profile from './Profile';

function AdminPage() {
  return (
    <div className="space-y-8 px-4 md:px-8 py-6 bg-transparent min-h-screen">
      
      {/* --- Admin Stats Overview --- */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
          Dashboard Overview
        </h2>
        <StatGrid />
      </section>

      {/* --- Admin Profile Section --- */}
      <section>
       
        <Profile />
      </section>

    </div>
  );
}

export default AdminPage;
