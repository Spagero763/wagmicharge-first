const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['airtime', 'utility'], required: true },
    network: { type: String }, // For airtime
    utilityProvider: { type: String }, // For utilities
    status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
    transactionId: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);
