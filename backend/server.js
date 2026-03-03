const express = require('express');
const cors = require('cors')
require('dotenv').config();
const dbConnect = require('./config/dbConnect');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const jobRoutes = require('./routes/jobRoutes');
const eventRoutes = require('./routes/eventRoutes');
const profileRoutes = require('./routes/profileRoutes');
const alumniRoutes = require('./routes/alumniRoutes');

const errorHandler = require('./middleware/errorMiddleware');
const path = require("path");


// Connect to the database
dbConnect();

const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  }))
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/alumni', alumniRoutes);

//Error middleware
app.use(errorHandler);

//start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});