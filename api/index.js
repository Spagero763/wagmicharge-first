const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('../src/routes/auth');
const paymentRoutes = require('../src/routes/payment');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);

// Only connect once (Vercel cold start)
let isConnected = false;
async function connectDB() {
    if (isConnected) return;
    await mongoose.connect(process.env.DB_URI || process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    isConnected = true;
}

// Vercel handler
module.exports = async (req, res) => {
    await connectDB();
    app(req, res);
};
