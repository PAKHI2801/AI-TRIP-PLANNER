import React from 'react';

const TripDetails = ({ trip, onClose }) => {
  if (!trip) return null;

  const form = trip.formInputs || {};

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50 p-4"> {/* Added p-4 for global padding */}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl md:max-w-3xl p-5 sm:p-6 md:p-8 overflow-y-auto max-h-[95vh] relative"> {/* Adjusted max-width, padding, and max-height */}
        {/* Header */}
        <div className="flex justify-between items-center mb-4 sm:mb-6 pb-2 border-b border-gray-200"> {/* Added border-b */}
          <h2 className="text-xl sm:text-2xl font-bold text-blue-800">Trip Details</h2> {/* Adjusted font size */}
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700 font-semibold text-sm sm:text-base transition-colors"
            aria-label="Close trip details"
          >
            ✖ Close
          </button>
        </div>

        {/* Form Inputs */}
        <div className="space-y-1.5 sm:space-y-2 text-gray-700"> {/* Adjusted spacing */}
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">📝 Trip Info</h3> {/* Adjusted font size and margin */}
          <p><span className="font-semibold">Destination:</span> {form.destination || trip.destination || 'Not provided'}</p>
          <p><span className="font-semibold">Start Date:</span> {form.startDate || 'Not provided'}</p>
          <p><span className="font-semibold">End Date:</span> {form.endDate || 'Not provided'}</p>
          <p><span className="font-semibold">Travelers:</span> {form.travelerType || trip.travelers || 'Not specified'}</p>
          <p><span className="font-semibold">Budget:</span> ₹{form.budget || trip.budgetPerPersonUSD || 'Not specified'}</p>
          {form.feelingInput && (
            <p><span className="font-semibold">Feeling:</span> {form.feelingInput}</p>
          )}
        </div>

        {/* Overview */}
        {trip.overview && (
          <div className="mt-4 sm:mt-6"> {/* Adjusted margin */}
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">🌟 Overview</h3> {/* Adjusted font size and margin */}
            <p className="text-gray-600 text-sm sm:text-base">{trip.overview}</p> {/* Adjusted font size */}
          </div>
        )}

        {/* Vibe */}
        {trip.vibe && (
          <p className="mt-2 sm:mt-4 text-sm sm:text-base"><span className="font-semibold">Trip Vibe:</span> {trip.vibe}</p> 
        )}

        {/* Must-Haves */}
        {Array.isArray(trip.mustHavesIncluded) && trip.mustHavesIncluded.length > 0 && (
          <div className="mt-4 sm:mt-6"> {/* Adjusted margin */}
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">✅ Must-Haves Included</h3> 
            <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base"> 
              {trip.mustHavesIncluded.map((item, idx) => <li key={idx}>{item}</li>)}
            </ul>
          </div>
        )}

        {/* Deal Breakers Avoided */}
        {Array.isArray(trip.dealBreakersAvoided) && trip.dealBreakersAvoided.length > 0 && (
          <div className="mt-4 sm:mt-6"> {/* Adjusted margin */}
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">🚫 Deal Breakers Avoided</h3> {/* Adjusted font size and margin */}
            <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base"> {/* Adjusted font size */}
              {trip.dealBreakersAvoided.map((item, idx) => <li key={idx}>{item}</li>)}
            </ul>
          </div>
        )}

        {/* Packing Suggestions */}
        {Array.isArray(trip.packingSuggestions) && trip.packingSuggestions.length > 0 && (
          <div className="mt-4 sm:mt-6"> {/* Adjusted margin */}
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">🎒 Packing Suggestions</h3> {/* Adjusted font size and margin */}
            <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base"> {/* Adjusted font size */}
              {trip.packingSuggestions.map((item, idx) => <li key={idx}>{item}</li>)}
            </ul>
          </div>
        )}

        {/* Tips */}
        {Array.isArray(trip.tips) && trip.tips.length > 0 && (
          <div className="mt-4 sm:mt-6"> {/* Adjusted margin */}
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">💡 Travel Tips</h3> {/* Adjusted font size and margin */}
            <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base"> {/* Adjusted font size */}
              {trip.tips.map((tip, idx) => <li key={idx}>{tip}</li>)}
            </ul>
          </div>
        )}

        {/* Itinerary */}
        {Array.isArray(trip.itinerary) && trip.itinerary.length > 0 && (
          <div className="mt-6 sm:mt-8 pt-4 border-t border-gray-200"> {/* Adjusted margin and added border-t */}
            <h3 className="text-lg sm:text-xl font-bold text-blue-700 mb-3 sm:mb-4">🗺 Trip Itinerary</h3> {/* Adjusted font size and margin */}
            {trip.itinerary.map((dayPlan, index) => (
              <div key={index} className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200"> {/* Adjusted margin and padding */}
                <h4 className="text-base sm:text-lg font-semibold text-blue-600 mb-1.5 sm:mb-2"> {/* Adjusted font size and margin */}
                  {dayPlan.day} – {dayPlan.date}
                </h4>

                {Array.isArray(dayPlan.activities) && (
                  <div className="mb-1.5 sm:mb-2"> {/* Adjusted margin */}
                    <p className="font-medium text-gray-700 text-sm sm:text-base">Activities:</p> {/* Adjusted font size */}
                    <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base"> {/* Adjusted font size */}
                      {dayPlan.activities.map((act, i) => <li key={i}>{act}</li>)}
                    </ul>
                  </div>
                )}

                {Array.isArray(dayPlan.diningSuggestions) && (
                  <div className="mb-1.5 sm:mb-2"> {/* Adjusted margin */}
                    <p className="font-medium text-gray-700 text-sm sm:text-base">Dining Suggestions:</p> {/* Adjusted font size */}
                    <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base"> {/* Adjusted font size */}
                      {dayPlan.diningSuggestions.map((place, i) => <li key={i}>{place}</li>)}
                    </ul>
                  </div>
                )}

                {dayPlan.notes && (
                  <p className="text-xs sm:text-sm text-gray-500 italic mt-1.5 sm:mt-2">Note: {dayPlan.notes}</p> 
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripDetails;