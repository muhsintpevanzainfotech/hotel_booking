const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const apiRoutes = require('./routes/api');

const app = express();

// Middleware
const allowedOrigins = [
  'https://dashboard.lakebreezeresorts.com',
  'https://www.lakebreezeresorts.com',
  'https://lakebreezeresorts.com',
  'http://localhost:5173',
  'http://localhost:6001',
  'http://localhost:6002',
  'http://localhost:6003',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'hotel-booking-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
}));

// Routes
app.use('/api', apiRoutes);

app.get('/api/live', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Hotel Booking API</title>
        <style>
          body{
            margin:0;
            display:flex;
            justify-content:center;
            align-items:center;
            height:100vh;
            background:#0f172a;
            color:white;
            font-family:Arial,sans-serif;
          }

          .card{
            text-align:center;
            padding:40px;
            border-radius:20px;
            background:#1e293b;
            box-shadow:0 0 20px rgba(0,0,0,0.4);
          }

          h1{
            color:#38bdf8;
            margin-bottom:10px;
          }

          p{
            color:#cbd5e1;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Welcome to Hotel Booking API</h1>
          <p>API Server is Running Successfully 🚀</p>
        </div>
      </body>
    </html>
  `);
});



// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel-booking';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 6003;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
