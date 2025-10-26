import React, { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, addDoc, query, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from 'config/db'; // <-- This is where your Firebase Firestore instance is connected
import { MapPin, Sparkles, Send, Star, ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx'; // For conditional classes

const Review = () => {
    // Component State
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Review Input States: { tripId: { text: '', rating: 0, reviewerName: '' } }
    const [newReviewInputs, setNewReviewInputs] = useState({});
    const [submittingReview, setSubmittingReview] = useState({});

    // Expanded Reviews State: { tripId: true/false }
    const [expandedReviews, setExpandedReviews] = useState({});

    // Utility function to format Firestore Timestamps and regular Date strings
    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }).format(date);
    };

    // Utility function to truncate text to a specified word limit
    const truncateText = (text, wordLimit) => {
        if (!text) return '';
        const words = text.split(' ');
        if (words.length > wordLimit) {
            return words.slice(0, wordLimit).join(' ') + '...';
        }
        return text;
    };

    // Memoized function to fetch trips and their reviews
    const fetchTrips = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            setSuccessMessage(null);

            const tripsCollectionRef = collection(db, "trips");
            // Use a less aggressive query for performance if the collection is large, 
            // though 'orderBy' is necessary here for display order.
            const q = query(tripsCollectionRef, orderBy("createdAt", "desc")); 
            const querySnapshot = await getDocs(q);

            const fetchedTrips = [];
            for (const docSnapshot of querySnapshot.docs) {
                const tripData = { id: docSnapshot.id, ...docSnapshot.data() };

                // Fetch reviews for the current trip
                const reviewsCollectionRef = collection(db, "trips", docSnapshot.id, "reviews");
                const reviewsQuery = query(reviewsCollectionRef, orderBy("createdAt", "asc"));
                const reviewsSnapshot = await getDocs(reviewsQuery);
                tripData.reviews = reviewsSnapshot.docs.map(reviewDoc => ({
                    id: reviewDoc.id,
                    ...reviewDoc.data()
                }));

                fetchedTrips.push(tripData);

                // Initialize input states for new reviews
                setNewReviewInputs(prev => ({
                    ...prev,
                    [docSnapshot.id]: prev[docSnapshot.id] || { text: '', rating: 0, reviewerName: '' }
                }));
            }
            setTrips(fetchedTrips);
        } catch (err) {
            console.error("Error fetching trips and reviews:", err);
            setError("Failed to load trips and reviews. Please try again later. Details: " + err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Effect hook to call fetchTrips on component mount
    useEffect(() => {
        fetchTrips();
    }, [fetchTrips]);

    // Handler for updating review input fields
    const handleReviewInputChange = (tripId, field, value) => {
        setNewReviewInputs(prev => ({
            ...prev,
            [tripId]: {
                ...prev[tripId],
                [field]: value
            }
        }));
    };

    // Handler for submitting a new review to Firestore
    const handleReviewSubmit = async (tripId) => {
        const reviewData = newReviewInputs[tripId];

        setError(null);
        setSuccessMessage(null);

        // Validation
        if (!reviewData || reviewData.text.trim() === '') {
            setError("Please write a review before submitting!");
            return;
        }
        if (reviewData.rating === 0) {
            setError("Please select a star rating!");
            return;
        }

        setSubmittingReview(prev => ({ ...prev, [tripId]: true }));

        try {
            const reviewsCollectionRef = collection(db, "trips", tripId, "reviews");
            await addDoc(reviewsCollectionRef, {
                comment: reviewData.text.trim(),
                rating: reviewData.rating,
                reviewer: reviewData.reviewerName.trim() || 'Anonymous',
                createdAt: serverTimestamp(),
            });

            // Re-fetch all trips to update the UI with the new review
            await fetchTrips();

            // Clear review input fields
            setNewReviewInputs(prev => ({
                ...prev,
                [tripId]: { text: '', rating: 0, reviewerName: '' }
            }));

            setSuccessMessage(`Review submitted successfully for ${trips.find(t => t.id === tripId)?.destination}!`);
            setTimeout(() => setSuccessMessage(null), 3000);

        } catch (err) {
            console.error("Error submitting review:", err);
            setError(`Failed to submit review for trip ${tripId}. (Error: ${err.message})`);
        } finally {
            setSubmittingReview(prev => ({ ...prev, [tripId]: false }));
        }
    };

    // Handler for toggling existing reviews expansion
    const toggleReviews = (tripId) => {
        setExpandedReviews(prev => ({
            ...prev,
            [tripId]: !prev[tripId]
        }));
    };

    // Helper function to render star icons (IMPROVED: uses a consistent light color for better contrast)
    const renderStars = (rating, isInteractive = false, onRatingClick = null) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Star
                    key={i}
                    size={isInteractive ? 18 : 12}
                    className={clsx(
                        "transition-transform duration-150",
                        // Active: Bright Yellow | Inactive: Light Gray/White for better contrast on dark/translucent background
                        i <= rating ? "fill-yellow-400 text-yellow-400" : "fill-white/30 text-white/30", 
                        isInteractive ? "cursor-pointer hover:scale-110" : ""
                    )}
                    onClick={isInteractive ? () => onRatingClick(i) : null}
                />
            );
        }
        return <div className="flex gap-0.5">{stars}</div>;
    };


    return (
        <div
            className="min-h-screen w-full bg-cover bg-center font-sans p-4 sm:p-8"
            style={{backgroundImage: "url('https://images.unsplash.com/photo-1526772662000-3f88f10405ff')"}}
        >
            <div className="absolute inset-0 bg-black/40"></div> {/* Increased opacity for better text contrast */}

            {/* Custom Scrollbar and Animation Styles (moved to the bottom for separation) */}
            <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600;700&display=swap');
            .custom-scrollbar::-webkit-scrollbar {
                width: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.1); /* Slightly more visible track */
                border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #0d9488; /* Teal color */
                border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: #0f766e;
            }
            /* Custom animation for sparkling effect */
            @keyframes spin-slow {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            .animate-spin-slow {
              animation: spin-slow 8s linear infinite;
            }
            `}</style>

            <header className="text-center mb-10 relative z-10">
                <h1 className="font-['Playfair_Display'] text-4xl sm:text-6xl font-extrabold text-white drop-shadow-xl">
                    Ŧ𝕣เρ รＥ𝐕єŘє𝓘𝐆ℕ ♙
                </h1>
                <h4 className="font-['Playfair_Display'] text-2xl sm:text-4xl font-bold text-white drop-shadow-lg mt-2">
                    Guest Impressions
                </h4>
                <p className="text-sm sm:text-lg text-white/90 mt-2 max-w-2xl mx-auto drop-shadow-md">
                    <u>Concise overviews of AI-curated journeys, alongside valuable guest feedback.</u>
                </p>
            </header>

            <div className="max-w-xl lg:max-w-5xl mx-auto bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl p-6 relative z-10"> {/* Adjusted max-width, increased blur/border for definition */}
                
                {/* Global Messages */}
                {error && (
                    <p className="text-center text-sm font-bold py-2 px-3 rounded-lg mb-4 bg-red-600 text-white shadow-md">
                        {error}
                    </p>
                )}
                {successMessage && (
                    <p className="text-center text-sm font-bold py-2 px-3 rounded-lg mb-4 bg-emerald-600 text-white shadow-md">
                        {successMessage}
                    </p>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="text-center text-xl text-white animate-pulse flex items-center justify-center gap-3 py-12">
                        <Sparkles className="animate-spin-slow" size={32} />
                        Loading bespoke journeys...
                    </div>
                )}

                {/* No Data State */}
                {!loading && !error && trips.length === 0 && (
                    <div className="text-center text-lg text-white p-6 bg-white/5 rounded-lg shadow-inner">
                        <p className="mb-3">It appears no luxurious trips have been curated yet.</p>
                        <p>Begin your dream journey by crafting one on the main page!</p>
                    </div>
                )}

                {/* Trips List */}
                <div className="space-y-6"> 
                    {trips.map((trip) => (
                        <div key={trip.id} className="bg-white/15 p-4 rounded-lg shadow-xl border border-white/20 transform hover:scale-[1.005] transition-transform duration-200 ease-out">
                            
                            {/* Trip Header */}
                            <h3 className="font-['Playfair_Display'] text-xl sm:text-2xl font-bold text-white mb-2 flex items-center gap-2">
                                <MapPin size={22} className="text-teal-400"/> {trip.destination}
                            </h3>
                            <p className="text-white/80 text-sm leading-relaxed mb-4">
                                {truncateText(trip.overview, 30)} {/* Reduced word limit for better card fit */}
                            </p>

                            {/* Add Review Form */}
                            <div className="mt-4 flex flex-col gap-3 p-4 bg-black/20 rounded-lg border border-white/20 shadow-inner"> 
                                <h5 className="font-bold text-sm text-white/90">Share Your Experience:</h5>
                                
                                {/* Rating Stars */}
                                <div className="flex justify-start text-white">
                                    {renderStars(newReviewInputs[trip.id]?.rating || 0, true, (rating) =>
                                        handleReviewInputChange(trip.id, 'rating', rating)
                                    )}
                                </div>
                                
                                {/* Input Fields */}
                                <input
                                    type="text"
                                    className="w-full p-2 bg-white/10 border border-white/30 rounded-md text-white placeholder:text-white/70 focus:outline-none focus:ring-1 focus:ring-teal-400 text-sm"
                                    placeholder="Your Name (Optional)"
                                    value={newReviewInputs[trip.id]?.reviewerName || ''}
                                    onChange={(e) => handleReviewInputChange(trip.id, 'reviewerName', e.target.value)}
                                    disabled={submittingReview[trip.id]}
                                />
                                <textarea
                                    className="w-full p-2 bg-white/10 border border-white/30 rounded-md text-white placeholder:text-white/70 focus:outline-none focus:ring-1 focus:ring-teal-400 text-sm"
                                    rows="3" // Increased rows for better mobile experience
                                    placeholder="Your detailed feedback..."
                                    value={newReviewInputs[trip.id]?.text || ''}
                                    onChange={(e) => handleReviewInputChange(trip.id, 'text', e.target.value)}
                                    disabled={submittingReview[trip.id]}
                                ></textarea>
                                
                                {/* Submit Button */}
                                <button
                                    onClick={() => handleReviewSubmit(trip.id)}
                                    className={clsx(
                                        "flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-white text-base transition-all duration-200 ease-in-out", // Larger button for better tap target
                                        submittingReview[trip.id]
                                            ? "bg-gray-500 cursor-not-allowed"
                                            : "bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                                    )}
                                    disabled={submittingReview[trip.id]}
                                >
                                    {submittingReview[trip.id] ? (
                                        <>Submitting...</>
                                    ) : (
                                        <><Send size={18} /> Submit Review</>
                                    )}
                                </button>
                            </div>

                            {/* View Reviews Toggle & List */}
                            {trip.reviews && trip.reviews.length > 0 && (
                                <div className="mt-4 border-t border-white/20 pt-4">
                                    <button
                                        onClick={() => toggleReviews(trip.id)}
                                        className="text-teal-300 hover:text-teal-100 font-medium flex items-center gap-1 transition-colors duration-150 text-sm" // Slightly larger text
                                    >
                                        {expandedReviews[trip.id] ? (
                                            <>Hide Reviews ({trip.reviews.length}) <ChevronUp size={16}/></>
                                        ) : (
                                            <>View Reviews ({trip.reviews.length}) <ChevronDown size={16}/></>
                                        )}
                                    </button>

                                    {expandedReviews[trip.id] && (
                                        <div 
                                            // Responsive Max Height: Smaller on small screens, slightly larger on medium/large screens
                                            className="space-y-3 mt-4 max-h-48 md:max-h-60 overflow-y-auto pr-2 custom-scrollbar transition-all duration-300 ease-in-out"
                                        >
                                            {trip.reviews.map((review) => (
                                                <div key={review.id} className="bg-white/10 p-3 rounded-lg shadow-inner border border-white/15">
                                                    <div className="flex items-center justify-between mb-1">
                                                        {renderStars(review.rating)}
                                                        <span className="text-xs text-gray-400">
                                                            {review.createdAt ? formatDate(review.createdAt) : 'N/A'}
                                                        </span>
                                                    </div>
                                                    <p className="text-white text-sm leading-snug mb-1">{review.comment}</p>
                                                    <p className="text-xs text-gray-400 font-semibold">- {review.reviewer}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Review;