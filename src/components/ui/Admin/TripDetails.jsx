// src/TripDetails.js
import React, { useState, useEffect } from "react";
import { MdTravelExplore } from "react-icons/md";
import {
  FaAngleDown,
  FaAngleUp,
  FaUserFriends,
  FaRupeeSign,
} from "react-icons/fa";
import { fetchTrips } from "controllers/FetchTrips";

export default function TripDetails() {
  const [tripData, setTripData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTrip, setExpandedTrip] = useState(null);

  useEffect(() => {
    const getTrips = async () => {
      setLoading(true);
      setError(null);
      try {
        const trips = await fetchTrips();
        setTripData(trips);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getTrips();
  }, []);

  const toggleDetails = (id) => {
    setExpandedTrip(expandedTrip === id ? null : id);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 animate-pulse">
        <p className="text-lg sm:text-2xl text-indigo-600 dark:text-indigo-400 font-bold text-center px-4">
          Loading your adventures...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen bg-red-50 dark:bg-red-900 px-4">
        <p className="text-lg sm:text-xl text-red-600 font-medium text-center">
          Error: {error}
        </p>
      </div>
    );

  if (tripData.length === 0)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 px-4">
        <p className="text-lg sm:text-2xl text-gray-700 dark:text-gray-300 text-center">
          No planned trips found. Start a new journey!
        </p>
      </div>
    );

  return (
    <div
      className="bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 min-h-screen py-10 sm:py-14 px-4 sm:px-8"
      style={{
        backgroundImage:
          "url('https://cdn.vectorstock.com/i/500p/35/13/digital-grid-technology-dashboard-vector-53463513.jpg')",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 sm:gap-6 mb-10 sm:mb-14">
          <MdTravelExplore className="text-white w-10 sm:w-12 h-10 sm:h-12 animate-bounce" />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white text-center sm:text-left leading-tight">
            Your Planned Trips
          </h1>
        </div>

        {/* Trip Cards */}
        <div className="space-y-8">
          {tripData.map((trip) => {
            const email =
              trip.userEmail || trip.formInputs?.userEmail || "N/A";
            const destination = trip.destination || "N/A";
            const feeling = trip.formInputs?.feelingInput || "N/A";
            const vibe = trip.vibe || "N/A";
            const travelers = trip.formInputs?.travelerType || "N/A";
            const startDate = trip.startDate || trip.dates?.startDate || "N/A";
            const endDate = trip.endDate || trip.dates?.endDate || "N/A";
            const budget = trip.formInputs?.budget || trip.budget || "N/A";

            const mustHaves = Array.isArray(trip?.formInputs?.mustHaves)
              ? trip.formInputs.mustHaves.join(", ")
              : typeof trip.formInputs?.mustHaves === "string" &&
                trip.formInputs.mustHaves.trim()
              ? trip.formInputs.mustHaves
              : "None listed";

            const dealBreakers = Array.isArray(trip?.formInputs?.dealBreakers)
              ? trip.formInputs.dealBreakers.join(", ")
              : typeof trip.formInputs?.dealBreakers === "string" &&
                trip.formInputs.dealBreakers.trim()
              ? trip.formInputs.dealBreakers
              : "None listed";

            const budgetPerPersonUSD = trip.budgetPerPersonUSD
              ? `$${trip.budgetPerPersonUSD}`
              : "N/A";

            return (
              <div
                key={trip.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-transparent hover:border-indigo-500 overflow-hidden"
              >
                {/* Trip Summary */}
                <div className="px-5 sm:px-8 py-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Trip to{" "}
                    <span className="text-indigo-600 dark:text-indigo-400">
                      {destination}
                    </span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 text-gray-700 dark:text-gray-300">
                    <div className="flex items-start gap-2">
                      <span className="text-purple-500 text-lg">📧</span>
                      <p className="break-all">
                        <strong>User Email:</strong>{" "}
                        <span className="font-medium text-gray-900 dark:text-white">
                          {email}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-indigo-500 text-lg">📍</span>
                      <p>
                        <strong>Destination:</strong>{" "}
                        <span className="font-medium text-gray-900 dark:text-white">
                          {destination}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-pink-500 text-lg">📅</span>
                      <p>
                        <strong>Dates:</strong>{" "}
                        <span className="font-medium text-gray-900 dark:text-white">
                          {startDate} to {endDate}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <FaUserFriends className="w-5 h-5 text-purple-500" />
                      <p>
                        <strong>Travelers:</strong>{" "}
                        <span className="font-medium">{travelers}</span>
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-orange-500 text-lg">🧘</span>
                      <p>
                        <strong>Feeling:</strong>{" "}
                        <span className="font-medium">{feeling}</span>
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-teal-500 text-lg">🌈</span>
                      <p>
                        <strong>Vibe:</strong>{" "}
                        <span className="font-medium">{vibe}</span>
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <FaRupeeSign className="w-5 h-5 text-green-500" />
                      <p>
                        <strong>Budget:</strong>{" "}
                        <span className="font-medium">{budget}</span>
                      </p>
                    </div>
                    <div className="flex items-start gap-2 col-span-full sm:col-span-1">
                      <span className="text-blue-500 text-lg">✅</span>
                      <p>
                        <strong>Must Haves:</strong>{" "}
                        <span className="font-medium">{mustHaves}</span>
                      </p>
                    </div>
                    <div className="flex items-start gap-2 col-span-full sm:col-span-1">
                      <span className="text-red-500 text-lg">❌</span>
                      <p>
                        <strong>Deal Breakers:</strong>{" "}
                        <span className="font-medium">{dealBreakers}</span>
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-yellow-500 text-lg">💵</span>
                      <p>
                        <strong>Budget Per Person (USD):</strong>{" "}
                        <span className="font-medium">
                          {budgetPerPersonUSD}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <div className="mt-8 text-center sm:text-left">
                    <button
                      onClick={() => toggleDetails(trip.id)}
                      className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 rounded-full shadow text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 transition duration-300"
                    >
                      {expandedTrip === trip.id ? (
                        <>
                          Hide Details <FaAngleUp className="ml-2" />
                        </>
                      ) : (
                        <>
                          View Details <FaAngleDown className="ml-2" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Trip Details */}
                {expandedTrip === trip.id && (
                  <div className="bg-gray-50 dark:bg-gray-700 px-5 sm:px-8 py-6 border-t border-gray-200 dark:border-gray-600 animate-fade-in-down overflow-x-auto">
                    <h4 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">
                      Detailed Itinerary
                    </h4>

                    <div className="space-y-6">
                      {trip.itinerary?.map((day, idx) => (
                        <div
                          key={idx}
                          className="border-l-4 border-indigo-500 dark:border-indigo-400 pl-4 py-2"
                        >
                          <h5 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                            {day.day} (
                            {new Date(day.date).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                            )
                          </h5>

                          <p className="text-gray-700 dark:text-gray-300">
                            <strong>Accommodation:</strong>{" "}
                            {day.accommodation || "Not specified"}
                          </p>

                          {day.activities?.length > 0 && (
                            <>
                              <p className="mt-3 font-semibold text-gray-700 dark:text-gray-300">
                                Activities:
                              </p>
                              <ul className="list-disc ml-6 space-y-1">
                                {day.activities.map((act, i) => (
                                  <li key={i}>{act}</li>
                                ))}
                              </ul>
                            </>
                          )}

                          {day.diningSuggestions?.length > 0 && (
                            <>
                              <p className="mt-3 font-semibold text-gray-700 dark:text-gray-300">
                                Dining Suggestions:
                              </p>
                              <ul className="list-disc ml-6 space-y-1">
                                {day.diningSuggestions.map((dine, i) => (
                                  <li key={i}>{dine}</li>
                                ))}
                              </ul>
                            </>
                          )}

                          {day.notes && (
                            <p className="mt-3 italic text-gray-600 dark:text-gray-400">
                              📝 {day.notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
