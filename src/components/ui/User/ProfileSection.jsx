// src/components/ui/User/ProfileSection.jsx
import React from 'react';
import { FaUserCircle, FaEnvelope, FaMapMarkerAlt, FaGlobe, FaStar, FaEdit } from 'react-icons/fa';

const ProfileSection = ({ user, userData, onEditProfile }) => {
  const displayName = userData?.username || user?.displayName || 'Traveler';
  const email = user?.email || userData?.email || 'Not Provided';
  const role = userData?.role || 'user';
  const city = userData?.city || 'Unknown';
  const country = userData?.country || 'Unknown';

  const userInitial = displayName ? displayName.charAt(0).toUpperCase() : '?';

  return (
    <div className="bg-amber-50 p-6 sm:p-8 rounded-xl shadow-2xl max-w-lg md:max-w-2xl w-full mx-auto border border-amber-50 transition-all duration-300 transform hover:scale-[1.01]"> {/* Adjusted max-width and padding */}
      <div className="flex flex-col items-center justify-center mb-6 sm:mb-8"> {/* Adjusted margin */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 mb-3 sm:mb-4"> {/* Adjusted size for smaller screens */}
          <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-indigo-800 text-black flex items-center justify-center text-4xl sm:text-5xl font-bold border-4 border-white shadow-lg"> {/* Adjusted text size */}
            {userInitial}
          </div>
          <div className="absolute bottom-0 right-0 p-1.5 bg-yellow-400 rounded-full text-white shadow-md">
            <FaStar className="text-sm" />
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight text-center">{displayName}</h2> {/* Adjusted text size and added text-center */}
        <p className="text-base sm:text-lg text-gray-500 mt-1 capitalize text-center">{role}</p> {/* Adjusted text size and added text-center */}
      </div>

      <div className="bg-amber-50 p-4 sm:p-6 rounded-lg border border-gray-200 shadow-inner mb-4 sm:mb-6"> {/* Adjusted padding and margin */}
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 border-b pb-2 text-left">User Details</h3> {/* Adjusted text size and margin */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 sm:gap-y-4 gap-x-4 sm:gap-x-8 text-gray-700"> {/* Adjusted gaps */}
          <div className="flex items-center gap-3">
            <FaEnvelope className="text-lg sm:text-xl text-purple-600" /> {/* Adjusted icon size */}
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-semibold text-gray-500">Email Address</span> {/* Adjusted text size */}
              <span className="text-sm sm:text-base font-medium truncate">{email}</span> {/* Adjusted text size */}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaMapMarkerAlt className="text-lg sm:text-xl text-purple-600" /> {/* Adjusted icon size */}
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-semibold text-gray-500">City</span> {/* Adjusted text size */}
              <span className="text-sm sm:text-base font-medium">{city}</span> {/* Adjusted text size */}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaGlobe className="text-lg sm:text-xl text-purple-600" /> {/* Adjusted icon size */}
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-semibold text-gray-500">Country</span> {/* Adjusted text size */}
              <span className="text-sm sm:text-base font-medium">{country}</span> {/* Adjusted text size */}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-5 sm:mt-6"> {/* Adjusted margin */}
        <button
          onClick={onEditProfile}
          className="flex items-center gap-2 bg-purple-600 text-white font-semibold py-2.5 px-5 sm:py-3 sm:px-6 rounded-full text-base sm:text-lg shadow-lg hover:bg-purple-700 transition-colors duration-300 transform hover:-translate-y-1" 
        >
          <FaEdit className="text-base sm:text-lg" /> Edit Profile {/* Adjusted icon size */}
        </button>
      </div>
    </div>
  );
};

export default ProfileSection;