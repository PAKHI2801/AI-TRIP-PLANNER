import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { FiBarChart2, FiEye, FiUsers } from 'react-icons/fi';
import { collection, getDocs } from 'firebase/firestore';
import { db } from 'config/db'; // Firebase config

function StatGrid() {
  const [stats, setStats] = useState([
    {
      title: "Total Users",
      value: "0",
      change: "+0%",
      trend: "up",
      icon: <FiUsers className="w-5 h-5" />,
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/20",
      textColor: "text-emerald-600 dark:text-emerald-400",
      cardBgColor: "bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900 dark:to-slate-900",
      borderColor: "border-emerald-300 dark:border-emerald-800",
      barWidth: "0%",
    },
    {
      title: "Active Users",
      value: "0",
      change: "+0%",
      trend: "up",
      icon: <FiUsers className="w-5 h-5" />,
     color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400",
      cardBgColor: "bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900 dark:to-slate-900",
      borderColor: "border-blue-300 dark:border-blue-800",
      barWidth: "0%",
    },
    {
      title: "Total Trips",
      value: "0",
      change: "+0%",
      trend: "up",
      icon: <FiBarChart2 className="w-5 h-5" />,
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      textColor: "text-purple-600 dark:text-purple-400",
      cardBgColor: "bg-gradient-to-br from-purple-100 to-pink-50 dark:from-purple-900 dark:to-slate-900",
      borderColor: "border-purple-300 dark:border-purple-800",
      barWidth: "0%",
    },
    {
      title: "Page Views",
      value: "0",
      change: "-0%",
      trend: "down",
      icon: <FiEye className="w-5 h-5" />,
       color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
      textColor: "text-orange-600 dark:text-orange-400",
      cardBgColor: "bg-gradient-to-br from-orange-100 to-red-50 dark:from-orange-900 dark:to-slate-900",
      borderColor: "border-orange-300 dark:border-orange-800",
      barWidth: "0%",
    },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'user'));
        const totalUsers = usersSnapshot.size;

        const tripsSnapshot = await getDocs(collection(db, 'trips'));
        const totalTrips = tripsSnapshot.size;

        const activeUsers = usersSnapshot.docs.filter(doc => doc.data().isActive).length;

        setStats(prev =>
          prev.map(stat => {
            if (stat.title === "Total Users") {
              return { ...stat, value: totalUsers.toString(), barWidth: "75%" };
            }
            if (stat.title === "Active Users") {
              return { ...stat, value: activeUsers.toString(), barWidth: "70%" };
            }
            if (stat.title === "Total Trips") {
              return { ...stat, value: totalTrips.toString(), barWidth: "80%" };
            }
            return stat;
          })
        );
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {stats.map(
        (
          {
            title,
            value,
            change,
            trend,
            icon,
            color,
            bgColor,
            textColor,
            barWidth,
            cardBgColor,
            borderColor,
          },
          index
        ) => (
          <div
            key={index}
            className={`rounded-2xl p-6 border ${borderColor} ${cardBgColor}
              hover:shadow-lg hover:shadow-slate-300/30 dark:hover:shadow-slate-900/40
              transition-all duration-500 transform hover:-translate-y-1`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  {title}
                </p>
                <p className="text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
                  {value}
                </p>
                <div className="flex items-center space-x-2">
                  <ArrowRight
                    className={`w-4 h-4 ${
                      trend === 'up' ? 'text-green-500' : 'text-red-500'
                    }`}
                  />
                  <span className={`${textColor} font-semibold`}>{change}</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    vs Last
                  </span>
                </div>
              </div>
              <div
                className={`p-3 rounded-xl ${bgColor} text-xl 
                group-hover:scale-110 transition-all duration-300`}
              >
                {icon}
              </div>
            </div>
            {/* Progress Bar */}
            <div className="mt-5 h-2 bg-slate-200/60 dark:bg-slate-800/70 rounded-full overflow-hidden">
              <div
                className={`bg-gradient-to-r ${color} h-full rounded-full animate-[grow_2s_ease-in-out]`}
                style={{ width: barWidth }}
              ></div>
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default StatGrid;
