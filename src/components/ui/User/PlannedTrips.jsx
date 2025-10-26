import React from 'react';
import { MapPin, Calendar, Compass, Trash2 } from 'lucide-react';

const PlannedTrips = ({ trips, onTripDetailsView, onDeleteTrip }) => {
  if (!trips || trips.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10 sm:mt-16 p-4"> {/* Added p-4 for padding */}
        <Compass className="mx-auto mb-4 text-blue-500" size={48} />
        <p className="text-lg sm:text-xl">No trips planned yet. Start your journey today!</p> {/* Adjusted font size */}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 p-4 sm:p-6 pt-8"> {/* Adjusted grid columns and padding */}
      {trips.map(trip => {
        const form = trip.formInputs || {};
        const destination = form.destination || trip.destination || 'Unknown destination';
        const startDate = form.startDate || trip.startDate || 'Start date not set';
        const endDate = form.endDate || trip.endDate || 'End date not set';

        return (
          <div key={trip.id} className="bg-white shadow-md rounded-lg p-5 sm:p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200"> {/* Adjusted padding and added hover effect */}
            {/* Destination */}
            <h2 className="text-xl sm:text-2xl font-bold text-blue-700 mb-1">
              {destination}
            </h2>

            {/* Location */}
            <p className="flex items-center text-sm sm:text-base text-gray-600 mb-1">
              <MapPin className="w-4 h-4 mr-2 text-blue-500" /> {destination}
            </p>

            {/* Dates */}
            <p className="flex items-center text-sm sm:text-base text-gray-500 mb-2 sm:mb-3"> {/* Adjusted font size and margin */}
              <Calendar className="w-4 h-4 mr-2 text-blue-400" /> {startDate} - {endDate}
            </p>

            {/* Overview (optional) */}
            {trip.overview && (
              <p className="text-gray-700 text-sm sm:text-base mb-3 sm:mb-4 line-clamp-2"> {/* Adjusted font size, margin, and added line-clamp */}
                {trip.overview}
              </p>
            )}

            {/* View + Delete Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4"> {/* Changed to flex-col on mobile, flex-row on sm and up */}
              <button
                onClick={() => onTripDetailsView(trip)}
                className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors text-sm font-semibold" 
              >
                View Details
              </button>
              {onDeleteTrip && (
                <button
                  onClick={() => {
                    if (window.confirm(`Delete trip to ${destination}? This action cannot be undone.`)) {
                      onDeleteTrip(trip.id);
                    }
                  }}
                  className="w-full sm:w-auto bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors flex items-center justify-center gap-2 text-sm font-semibold" 
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PlannedTrips;