// PlannedTrips.jsx

import React, { useState } from 'react';
import { Sparkles, Edit3, MapPin, Compass, CheckCircle, PlusCircle, X, Calendar, Users, User, Heart, ThumbsUp, ThumbsDown, DollarSign, Wind, Utensils, Landmark, Mail } from 'lucide-react';
import clsx from 'clsx';

// CORRECTED PATH: Navigate up three directories to reach 'src/', then into 'controllers/'
import { generateItinerary } from 'controllers/PlanTrip'; // Adjusted import path to match your project structure

const PlannedTrips = () => {
    // --- State Management ---
    const [destination, setDestination] = useState('');
    const [feelingInput, setFeelingInput] = useState('');
    const [vibe, setVibe] = useState(null);
    const [mustHaves, setMustHaves] = useState([]);
    const [dealBreakers, setDealBreakers] = useState([]);
    const [travelerType, setTravelerType] = useState('couple');
    const [budget, setBudget] = useState(4500);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [userEmail, setUserEmail] = useState(''); // State for user email
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedItinerary, setGeneratedItinerary] = useState(null);
    const [error, setError] = useState('');
    const [isTripSaved, setIsTripSaved] = useState(false);
    
    // --- Validation ---
    const canGenerate = destination.trim() !== '' && feelingInput.trim() !== '' && vibe && startDate && endDate && userEmail.trim() !== '';

    const handleGenerate = async () => {
        if (!canGenerate) {
            setError("Please fill out the Destination, Feeling, Vibe, Dates, and your Email to continue.");
            console.error("Attempted to generate with incomplete form.");
            return;
        }

        setIsGenerating(true);
        setError('');
        setGeneratedItinerary(null);
        setIsTripSaved(false);

        const tripInputs = {
            destination,
            feelingInput,
            vibe,
            mustHaves,
            dealBreakers,
            travelerType,
            budget,
            startDate,
            endDate,
            userEmail
        };

        const result = await generateItinerary(tripInputs);

        if (result.error) {
            setError(result.error);
        } else {
            setGeneratedItinerary(result.parsedJson);
            // Scroll to the itinerary after generation for better UX
            setTimeout(() => {
                document.getElementById('itinerary-result')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
            setIsTripSaved(!!result.firestoreId);
        }
        
        setIsGenerating(false);
    };

    return (
        <div
            className="min-h-screen w-full bg-cover bg-center font-sans p-4 sm:p-8"
            style={{backgroundImage: "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470')"}}
        >
            <div className="absolute inset-0 bg-black/40"></div> {/* Increased overlay for better text contrast */}

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600;700&display=swap');
                /* Custom styles for the range input thumb */
                .range-thumb::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 24px; height: 24px; background: #0d9488; border-radius: 50%; cursor: pointer; border: 4px solid #fff; box-shadow: 0 0 10px rgba(0,0,0,0.3); }
                .range-thumb::-moz-range-thumb { width: 24px; height: 24px; background: #0d9488; border-radius: 50%; cursor: pointer; border: 4px solid #fff; box-shadow: 0 0 10px rgba(0,0,0,0.3); }
                /* Fixing date input colors for better visibility on a light background */
                input[type="date"] {
                    color: #1e293b; /* slate-800 */
                }
                /* Use a custom background for date inputs to ensure consistency */
                input[type="date"]::-webkit-calendar-picker-indicator {
                    filter: invert(0.5); /* Makes the icon darker for contrast */
                }
            `}</style>

            <header className="text-center mb-8 sm:mb-10 relative z-10">
                <h1 className="font-['Playfair_Display'] text-4xl sm:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg"> {/* Adjusted font size for mobile */}
                    Ŧ𝕣เρ รＥ𝐕єŘє𝓘𝐆ℕ ♙
                </h1>
                <h4 className="font-['Playfair_Display'] text-3xl sm:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg mt-2"> {/* Adjusted font size for mobile */}
                    Design Your Dream Trip
                </h4>
                <p className="text-sm sm:text-lg text-white/90 mt-2 drop-shadow-md max-w-lg mx-auto"><u> {/* Ensured text is white and centered */}
                    Complete this brief and allow our AI concierge to craft your perfect itinerary.
                </u></p>
            </header>

            <div className="max-w-6xl mx-auto bg-white/70 backdrop-blur-md border border-white rounded-3xl shadow-2xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8 relative z-10"> {/* Adjusted opacity/blur/padding for better contrast and mobile spacing */}

                {/* --- Left Column --- */}
                <div className="space-y-8"> {/* Reduced spacing on mobile */}
                    <Section title="The Destination" icon={<MapPin/>}>
                        <p className="text-slate-700 mb-3">Where is your heart set on?</p>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                placeholder="e.g., Kashmir, Tamil Nadu, India"
                                className="w-full p-3 sm:p-4 pl-12 bg-white/70 border-2 border-white/90 rounded-xl text-base text-slate-900 placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-teal-500/50 focus:border-teal-500"
                            />
                        </div>
                    </Section>

                    <Section title="The Feeling" icon={<Edit3/>}>
                        <textarea
                            value={feelingInput}
                            onChange={(e) => setFeelingInput(e.target.value)}
                            placeholder="Describe the mood you're after. e.g., 'A romantic and relaxing getaway...'"
                            className="w-full h-24 bg-white/70 border-2 border-white/90 rounded-xl p-4 text-base text-slate-900 placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-teal-500/50 focus:border-teal-500"
                        />
                    </Section>

                    <Section title="The Vibe" icon={<Compass/>}>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3"> {/* Ensured 4 columns on small screens and up */}
                            <ChoiceCard label="Relaxing" icon={<Heart/>} selected={vibe === 'relaxing'} onClick={() => setVibe('relaxing')} />
                            <ChoiceCard label="Adventure" icon={<Wind/>} selected={vibe === 'adventurous'} onClick={() => setVibe('adventurous')} />
                            <ChoiceCard label="Foodie" icon={<Utensils/>} selected={vibe === 'foodie'} onClick={() => setVibe('foodie')} />
                            <ChoiceCard label="Culture" icon={<Landmark/>} selected={vibe === 'cultural'} onClick={() => setVibe('cultural')} />
                        </div>
                    </Section>
                </div>

                {/* --- Right Column --- */}
                <div className="space-y-8"> {/* Reduced spacing on mobile */}
                        <Section title="The Logistics" icon={<Calendar/>}>
                            <div className="space-y-6">
                                <div>
                                    <label className="font-bold text-slate-800 mb-2 block">Travelers</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3"> {/* Ensured 4 columns on small screens and up */}
                                        <TravelerButton label="Solo" icon={<User/>} active={travelerType === 'solo'} onClick={() => setTravelerType('solo')}/>
                                        <TravelerButton label="Couple" icon={<Heart/>} active={travelerType === 'couple'} onClick={() => setTravelerType('couple')}/>
                                        <TravelerButton label="Family" icon={<Users/>} active={travelerType === 'family'} onClick={() => setTravelerType('family')}/>
                                        <TravelerButton label="Group" icon={<Users/>} active={travelerType === 'group'} onClick={() => setTravelerType('group')}/>
                                    </div>
                                </div>
                                 <div>
                                    <label className="font-bold text-slate-800 mb-2 block">Dates</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"> {/* Stacked on tiny mobile, side-by-side on sm+ */}
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="p-3 bg-white/70 border-2 border-white/90 rounded-lg text-slate-800 focus:outline-none focus:ring-4 focus:ring-teal-500/50 focus:border-teal-500"
                                        />
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="p-3 bg-white/70 border-2 border-white/90 rounded-lg text-slate-800 focus:outline-none focus:ring-4 focus:ring-teal-500/50 focus:border-teal-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="font-bold text-slate-800 mb-2 block">Budget (per person)</label>
                                    <div className="text-center font-bold text-3xl sm:text-4xl text-slate-900 my-2">${budget.toLocaleString()}</div> {/* Adjusted font size for mobile */}
                                    <input type="range" min="500" max="20000" step="100" value={budget} onChange={e => setBudget(e.target.value)} className="w-full h-2 bg-white/70 rounded-lg appearance-none cursor-pointer range-thumb"/>
                                </div>
                                
                                {/* User Email Input - now mandatory */}
                                <div>
                                    <label className="font-bold text-slate-800 mb-2 block">Your Email <span className="text-red-600">*</span></label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            type="email"
                                            value={userEmail}
                                            onChange={(e) => setUserEmail(e.target.value)}
                                            placeholder="your.email@gmail.com (mandatory)"
                                            className="w-full p-3 sm:p-4 pl-12 bg-white/70 border-2 border-white/90 rounded-xl text-base text-slate-900 placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-teal-500/50 focus:border-teal-500"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </Section>

                        <Section title="The Priorities" icon={<CheckCircle/>}>
                            <PriorityList title="Must-Haves" icon={<ThumbsUp className="text-emerald-700"/>} items={mustHaves} setItems={setMustHaves} placeholder="e.g., Hotel with a pool" />
                            <div className="mt-6">
                                <PriorityList title="Deal-Breakers" icon={<ThumbsDown className="text-red-700"/>} items={dealBreakers} setItems={setDealBreakers} placeholder="e.g., No long bus rides" />
                            </div>
                        </Section>
                </div>

                {/* --- Submit Button --- */}
                <div className="lg:col-span-2 text-center mt-4 sm:mt-6">
                    <button
                        onClick={handleGenerate}
                        disabled={!canGenerate || isGenerating}
                        className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold py-3 sm:py-4 px-8 sm:px-16 rounded-xl text-lg sm:text-xl shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:from-slate-400 disabled:to-slate-500 disabled:shadow-none disabled:scale-100 disabled:cursor-not-allowed"
                    > {/* Made button full-width on mobile */}
                        {isGenerating ? 'Crafting Bespoke Itinerary...' : 'Craft My Itinerary'}
                    </button>
                    {/* --- VALIDATION/ERROR MESSAGE --- */}
                    {error && (
                        <p className="text-red-800 font-bold bg-white/70 border-red-500 border rounded-lg p-3 mt-4 max-w-lg mx-auto shadow-inner text-sm"> {/* Improved contrast and styling */}
                            {error}
                        </p>
                    )}
                    {isTripSaved && (
                        <p className="text-emerald-800 font-bold bg-white/70 border-emerald-500 border rounded-lg p-3 mt-4 max-w-lg mx-auto shadow-inner text-sm">
                            Trip successfully saved to database!
                        </p>
                    )}
                </div>

                {/* --- Display Generated Itinerary (Day-by-Day Plan) --- */}
                {generatedItinerary && generatedItinerary.tripPlan?.itinerary && (
                    <div id="itinerary-result" className="lg:col-span-2 mt-8 sm:mt-10 p-4 sm:p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/90"> {/* Added ID for smooth scrolling */}
                        <h2 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-bold text-slate-900 mb-6 flex items-center gap-3">
                            <Sparkles className="text-yellow-600"/> Your Crafted Itinerary
                        </h2>
                        {generatedItinerary.tripPlan.overview && (
                            <p className="text-base sm:text-lg text-slate-700 mb-6">{generatedItinerary.tripPlan.overview}</p>
                        )}
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Day-by-Day Plan:</h3>
                        <div className="mt-4 space-y-6">
                            {generatedItinerary.tripPlan.itinerary.map((dayPlan, index) => (
                                <div key={index} className="bg-white/70 p-4 rounded-lg shadow-md border-l-4 border-teal-500">
                                    <h4 className="font-bold text-lg sm:text-xl text-teal-800">{dayPlan.day}: {dayPlan.theme} ({dayPlan.date})</h4>
                                    <p className="mt-2 text-sm sm:text-base"><strong>Accommodation:</strong> {dayPlan.accommodation}</p>
                                    <p className="text-sm sm:text-base"><strong>Activities:</strong></p>
                                    <ul className="list-disc list-inside ml-4 space-y-1 text-sm sm:text-base">
                                        {dayPlan.activities.map((activity, i) => <li key={i}>{activity}</li>)}
                                    </ul>
                                    <p className="mt-2 text-sm sm:text-base"><strong>Dining:</strong></p>
                                    <ul className="list-disc list-inside ml-4 space-y-1 text-sm sm:text-base">
                                        {dayPlan.diningSuggestions.map((meal, i) => <li key={i}>{meal}</li>)}
                                    </ul>
                                    {dayPlan.notes && <p className="text-xs italic mt-2 text-slate-600">Notes: {dayPlan.notes}</p>}
                                </div>
                            ))}
                        </div>
                        {/* Summary Sections */}
                        {[
                            { title: "Packing Suggestions:", key: "packingSuggestions" },
                            { title: "Additional Tips:", key: "tips" }
                        ].map((section) => (
                            generatedItinerary.tripPlan[section.key]?.length > 0 && (
                                <div className="mt-6" key={section.key}>
                                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900">{section.title}</h3>
                                    <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-sm sm:text-base">
                                        {generatedItinerary.tripPlan[section.key].map((item, i) => <li key={i}>{item}</li>)}
                                    </ul>
                                </div>
                            )
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Child Components (Improved for responsiveness and contrast) ---

const Section = ({ title, icon, children }) => ( 
    <div className="space-y-3"> {/* Added vertical space to component */}
        <h2 className="text-xl sm:text-2xl font-['Playfair_Display'] font-bold text-slate-900 flex items-center gap-3"> {/* Adjusted font size */}
            <div className="bg-white/50 p-2 rounded-md">{icon}</div> {/* Increased opacity */}
            <span>{title}</span> 
        </h2> 
        {children} 
    </div> 
);

const ChoiceCard = ({ label, icon, selected, onClick }) => ( 
    <button 
        onClick={onClick} 
        className={clsx(
            "flex flex-col items-center justify-center gap-2 p-3 sm:p-4 rounded-xl border-2 transition-all transform hover:-translate-y-0.5 text-sm sm:text-base font-medium", // Improved padding/text size
            selected ? 'bg-teal-500/30 border-teal-600 text-teal-900 shadow-md' : 'bg-white/50 border-white/70 text-slate-800 hover:border-teal-500' // Increased opacity/contrast
        )}> 
        <div className={clsx(selected ? "text-teal-800" : "text-slate-600")}>{icon}</div> 
        <span className="font-semibold text-center">{label}</span> 
    </button> 
);

const TravelerButton = ({ label, icon, active, onClick }) => ( 
    <button 
        onClick={onClick} 
        className={clsx(
            "flex items-center justify-center gap-2 p-2 sm:p-3 rounded-lg border-2 font-semibold transition-all text-sm sm:text-base", // Improved padding/text size
            active ? 'bg-teal-500/30 border-teal-600 text-slate-900 shadow-sm' : 'bg-white/50 border-white/70 text-slate-800 hover:border-teal-500'
        )}> 
        <div className={clsx(active ? "text-teal-800" : "text-slate-600")}>{icon}</div> 
        {label} 
    </button> 
);

const PriorityList = ({ title, icon, items, setItems, placeholder }) => { 
    const [input, setInput] = useState(''); 
    const handleAdd = () => { 
        if (input.trim()) { 
            setItems([...items, input.trim()]); 
            setInput(''); 
        } 
    }; 
    return ( 
        <div> 
            <label className="font-bold text-slate-800 mb-2 flex items-center gap-2">{icon} {title}</label> 
            <div className="flex gap-2"> 
                <input 
                    value={input} 
                    onChange={e => setInput(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && handleAdd()} 
                    type="text" 
                    placeholder={placeholder} 
                    className="flex-grow p-3 bg-white/70 border-2 border-white/90 rounded-lg text-base text-slate-900 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-500" // Improved padding/text size
                /> 
                <button 
                    onClick={handleAdd} 
                    className="bg-teal-600 text-white p-3 rounded-lg hover:bg-teal-700 transition"
                >
                    <PlusCircle size={20}/>
                </button> 
            </div> 
            <div className="flex flex-wrap gap-2 mt-3"> 
                {items.map((item, i) => ( 
                    <span key={i} className="flex items-center gap-2 font-medium px-3 py-1 rounded-full text-xs bg-white/70 text-slate-900 border border-white/50 shadow-sm"> 
                        {item} 
                        <button 
                            onClick={() => setItems(items.filter((_, index) => index !== i))}
                            className="text-red-600 hover:text-red-800"
                        >
                            <X size={14}/>
                        </button> 
                    </span> 
                ))} 
            </div> 
        </div> 
    ); 
};

export default PlannedTrips;