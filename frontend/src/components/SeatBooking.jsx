import React, { useState } from 'react';
import { MOCK_EVENTS } from '../data/mockdata';

const SeatSelection = () => {
    // Let's use Spider-Man (f2) for our test
    const event = MOCK_EVENTS.featured.find(e => e._id === 'f2');
    
    // Temporary layout constants (Simulating Venue.js data)
    const rows = 8;
    const seatsPerRow = 12;
    
    // Mocking booked seats (Simulating Show.js data)
    const [bookedSeats, setBookedSeats] = useState(['A5', 'A6', 'C1', 'C2', 'E10']);
    const [selectedSeats, setSelectedSeats] = useState([]);

    const handleSeatClick = (seatId) => {
        if (bookedSeats.includes(seatId)) return;
        
        setSelectedSeats(prev => 
            prev.includes(seatId) 
                ? prev.filter(s => s !== seatId) 
                : [...prev, seatId]
        );
    };

    return (
        <div className="p-8 bg-gray-900 min-h-screen text-white">
            <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
            <p className="text-gray-400 mb-8">{event.venue.name} • {event.venue.city}</p>

            {/* Screen indicator */}
            <div className="w-full h-2 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] mb-12 rounded-full"></div>
            <p className="text-center text-xs text-gray-500 uppercase tracking-widest mb-8">Screen This Way</p>

            <div className="flex flex-col items-center gap-4">
                {Array.from({ length: rows }).map((_, r) => {
                    const rowLetter = String.fromCharCode(65 + r);
                    return (
                        <div key={rowLetter} className="flex gap-3 items-center">
                            <span className="w-6 text-gray-500 font-mono">{rowLetter}</span>
                            {Array.from({ length: seatsPerRow }).map((_, s) => {
                                const seatId = `${rowLetter}${s + 1}`;
                                const isBooked = bookedSeats.includes(seatId);
                                const isSelected = selectedSeats.includes(seatId);

                                return (
                                    <button
                                        key={seatId}
                                        onClick={() => handleSeatClick(seatId)}
                                        className={`w-8 h-8 rounded-t-lg text-[10px] transition-all
                                            ${isBooked ? 'bg-gray-700 cursor-not-allowed opacity-50' : 
                                              isSelected ? 'bg-green-500 scale-110 shadow-lg' : 
                                              'bg-gray-500 hover:bg-gray-400'}`}
                                    >
                                        {s + 1}
                                    </button>
                                );
                            })}
                        </div>
                    );
                })}
            </div>

            {/* Booking Summary */}
            <div className="mt-12 p-6 border-t border-gray-800 flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-400">Selected Seats</p>
                    <p className="text-lg font-bold">{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-400">Total Price</p>
                    <p className="text-2xl font-bold text-green-500">LKR {selectedSeats.length * event.basePrice}</p>
                    <button 
                        className="mt-4 px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold disabled:opacity-50"
                        disabled={selectedSeats.length === 0}
                    >
                        Checkout Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SeatSelection;