// src/components/ui/User/UserDashboard.jsx
import React, { useState } from 'react'; // Import useState for sidebar toggle
import { FaUserCircle, FaPlaneDeparture, FaPlus, FaTachometerAlt, FaStar, FaEdit, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa'; // Added FaBars, FaTimes
import ProfileSection from './ProfileSection';
import PlannedTrips from './PlannedTrips';
import NewTripPlanButton from './NewTripPlanButton';
import ProfileForm from './ProfileForm';
import TripDetails from './TripDetails';
import Review from './Review';
import { useUserDashboardLogic } from 'controllers/userdashboard';

const BACKGROUND_IMAGE_URL = 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?q=80&w=1974&auto=format&fit=crop';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
  </div>
);

const DashboardMessage = ({ title, subtitle, buttons }) => (
  <div className="bg-white/95 p-6 sm:p-8 md:p-12 rounded-3xl shadow-2xl max-w-sm sm:max-w-md md:max-w-2xl w-full text-center border border-gray-100 backdrop-blur-sm transform transition-transform duration-300 hover:scale-[1.01]">
    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight leading-tight"> {/* Adjusted font sizes */}
      {title}
    </h2>
    <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 font-light max-w-prose mx-auto"> {/* Adjusted font sizes */}
      {subtitle}
    </p>
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"> {/* Stacks vertically on mobile */}
      {buttons.map((button, index) => (
        <button
          key={index}
          onClick={button.onClick}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 font-semibold py-3 px-6 sm:py-4 sm:px-8 rounded-full text-base sm:text-lg shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl
            ${button.primary ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
        >
          {button.icon} {button.label}
        </button>
      ))}
    </div>
  </div>
);

const UserDashboard = () => {
  const {
    activeTab, setActiveTab,
    user, userData, isProfileComplete, loading,
    userTrips, isEditingProfile, selectedTrip,
    handleEditProfile, handleSaveProfile, handleDeleteTrip,
    handleTripDetailsView, handleCancelEdit
  } = useUserDashboardLogic();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile sidebar

  const renderMainContent = () => {
    if (loading) return <LoadingSpinner />;

    if (activeTab === 'dashboard') {
      if (user && !isProfileComplete) {
        return (
          <DashboardMessage
            title={`Welcome, ${userData?.username || user?.email.split('@')[0] || 'Traveler'}!`}
            subtitle="Your adventure awaits. Begin by completing your profile or get straight to planning your first extraordinary journey."
            buttons={[
              { label: 'Plan Your First Trip', onClick: () => { setActiveTab('newTrip'); setIsSidebarOpen(false); }, icon: <FaPlaneDeparture className="text-xl" />, primary: true },
              { label: 'Complete Your Profile', onClick: () => { setActiveTab('profile'); setIsSidebarOpen(false); }, icon: <FaEdit className="text-xl" />, primary: false },
            ]}
          />
        );
      } else if (user && isProfileComplete) {
        return (
          <DashboardMessage
            title={`Welcome back, ${userData?.username || userData?.displayName || user?.email.split('@')[0] || 'Traveler'}!`}
            subtitle="Ready for your next great adventure? Your personalized dashboard is waiting for you."
            buttons={[
              { label: 'View My Profile', onClick: () => { setActiveTab('profile'); setIsSidebarOpen(false); }, icon: <FaUserCircle className="text-xl" />, primary: true },
            ]}
          />
        );
      }
    }

    switch (activeTab) {
      case 'profile':
        return isEditingProfile
          ? <ProfileForm userData={userData} onSave={handleSaveProfile} onCancel={handleCancelEdit} />
          : <ProfileSection user={user} userData={userData} onEditProfile={handleEditProfile} />;
      case 'plannedTrips':
        return (
          <PlannedTrips
            trips={userTrips}
            onDeleteTrip={handleDeleteTrip}
            onTripDetailsView={handleTripDetailsView}
          />
        );
      case 'newTrip':
        return <NewTripPlanButton />;
      case 'tripDetails':
        return (
          <TripDetails
            trip={selectedTrip}
            onClose={() => setActiveTab('plannedTrips')}
          />
        );
      case 'review':
        return <Review />;
      default:
        return (
          <div className="bg-white/80 p-8 rounded-2xl shadow-xl backdrop-blur-md max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-gray-900">Your Dashboard</h2>
            <p className="mt-4 text-gray-700">Explore your planned trips or create a new one!</p>
          </div>
        );
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaTachometerAlt },
    { id: 'profile', label: 'My Profile', icon: FaUserCircle },
    { id: 'plannedTrips', label: 'All Planned Trips', icon: FaPlaneDeparture },
    { id: 'newTrip', label: 'Get New Trip Plans', icon: FaPlus },
    { id: 'review', label: 'Review', icon: FaStar },
  ];

  const handleLogout = () => {
    console.log('Logging out...');
    localStorage.removeItem("adminId"); // Clear user ID on logout
    window.location.href = '/'; // Redirect to home/login page
  };

  return (
    <div className="flex h-screen font-sans text-gray-800 w-full relative overflow-hidden">
      <div className="absolute inset-0 bg-opacity-60 z-0"
            style={{
        backgroundImage: `url('${BACKGROUND_IMAGE_URL}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}></div>

      {/* Mobile Menu Button */}
      <button
        className="lg:hidden absolute top-4 left-4 z-50 p-3 bg-gray-800 text-white rounded-lg shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
      </button>

      {/* Sidebar Navigation */}
      <nav
        className={`fixed inset-y-0 left-0 w-64 h-full bg-gray-900 text-white flex-shrink-0  z-40 p-6 overflow-y-auto shadow-2xl transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`} // Responsive sidebar visibility
      >
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-extrabold text-white leading-tight">
            Ŧ𝕣เρ รＥ𝐕єŘє𝓘𝐆ℕ ♙
          </h1>
          {/* Close button for mobile sidebar */}
          <button
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>
        <p className="text-sm text-gray-400 mt-2 text-center">Your Ultimate Travel Planner</p>

        <ul className="space-y-3 mt-8"> {/* Added mt-8 for spacing after title */}
          {navItems.map(({ id, label, icon: Icon }) => (
            <li key={id}>
              <button
                onClick={() => { setActiveTab(id); setIsSidebarOpen(false); }} // Close sidebar on item click
                className={`w-full flex items-center gap-4 py-3 px-4 rounded-lg text-lg transition-colors duration-200
                  ${activeTab === id ? 'bg-purple-600 font-semibold shadow-lg' : 'hover:bg-gray-700'}`}
              >
                <Icon className="text-xl" />
                {label}
              </button>
            </li>
          ))}
          <li className="mt-auto pt-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 py-3 px-4 rounded-lg text-lg transition-colors duration-200 text-gray-300 hover:bg-purple-600 hover:text-white"
            >
              <FaSignOutAlt className="text-xl" />
              Logout
            </button>
          </li>
        </ul>
      </nav>

      {/* Main Content Area */}
      <main
        className={`flex-1 relative z-10 h-screen overflow-y-auto p-4 sm:p-6 lg:p-8 ${ // Adjusted padding
          ['dashboard', 'profile', 'newTrip'].includes(activeTab) ? 'flex items-center justify-center' : ''
        }`}
        onClick={() => isSidebarOpen && setIsSidebarOpen(false)} // Close sidebar if clicking outside on mobile
      >
        {renderMainContent()}
      </main>

      {/* Overlay when mobile sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-transparent bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default UserDashboard;