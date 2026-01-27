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
app.use(cors());
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

//Basic Test Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

