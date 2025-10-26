import React from 'react';
import { useNavigate } from 'react-router-dom';

const NewTripPlanButton = () => {
  const navigate = useNavigate();

  const handleStartNewTrip = () => {
    navigate('/plan');
  };

  return (
    <div className="backdrop-blur-xl bg-white/20 p-6 sm:p-8 md:p-10 rounded-xl shadow-2xl border border-white/30 max-w-sm sm:max-w-xl md:max-w-3xl mx-auto my-8 flex flex-col items-center justify-center text-center"> {/* Adjusted padding and max-width */}
      <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-5 sm:mb-6 pb-3 sm:pb-4 border-b-4 border-indigo-500 tracking-tight leading-tight"> {/* Adjusted font size, margin, and padding */}
        Plan Your Next Adventure!
      </h2>
      <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 max-w-prose"> {/* Adjusted font size and margin */}
        Ready for a new journey? Click the button below to start creating your personalized trip plan with our AI assistance.
      </p>
      <button
        onClick={handleStartNewTrip}
        className="px-8 py-3 sm:px-10 sm:py-4 bg-amber-950 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-lg sm:text-xl" 
      >
        Start a New Trip Plan
      </button>
    </div>
  );
};

export default NewTripPlanButton;