const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load ENV Vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware 
// 1. CORS first
app.use(cors());

// Webhook Routes
app.use('/api/webhook', express.raw({ type: 'application/json' }), require('./routes/webhookRoutes'));

// 3. Normal JSON parser for everything else
app.use(express.json()); //Allows the server to accept JSON data in the body


// Routes



// Auth Routes
app.use('/api/auth', require('./routes/authRoutes'));
// User Routes
app.use('/api/users', require('./routes/userRoutes'));
// Venue Routes
app.use('/api/venues', require('./routes/venueRoutes'));
// Event Routes
app.use('/api/events', require('./routes/eventRoutes'));
// Show Routes
app.use('/api/shows', require('./routes/showRoutes'));
// Booking Routes
app.use('/api/bookings', require('./routes/bookingRoutes'));
// Search Routes
app.use('/api/search', require('./routes/searchRoutes'));




//Cron Jobs 
require('./utils/cronJobs');

//Basic Test Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.log("--- SYSTEM ERROR DETECTED ---");
    console.error(err); // This will print the full object to terminal
    
    res.status(err.status || 500).json({
        message: err.message || "Unknown Error",
        // This stops the [object Object] in Postman
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
}); 
