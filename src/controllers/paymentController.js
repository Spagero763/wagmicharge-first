const Payment = require('../models/payment');
const User = require('../models/user');
const axios = require('axios');
const { validatePhoneNumber, handleError } = require('../utils'); // Import handleError

// Function to handle airtime purchase
exports.purchaseAirtime = async (req, res) => {
    const { amount, network, phone } = req.body;
    const userId = req.user.id;

    // Input validation
    if (!amount || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: 'Invalid amount' });
    }
    if (!network || typeof network !== 'string') {
        return res.status(400).json({ message: 'Invalid network' });
    }
    if (phone && !validatePhoneNumber(phone)) {
        return res.status(400).json({ message: 'Invalid phone number' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Call external API to process payment (replace with actual API endpoint)
        const response = await axios.post('https://api.example.com/purchase', {
            amount,
            network,
            walletAddress: user.walletAddress,
            phone,
        });

        if (response.data.success) {
            const payment = new Payment({
                userId,
                amount,
                type: 'airtime',
                network,
                transactionId: response.data.transactionId,
                status: 'completed'
            });
            await payment.save();

            return res.status(200).json({ message: 'Airtime purchased successfully', transactionId: response.data.transactionId });
        } else {
            // Save failed payment
            await new Payment({
                userId,
                amount,
                type: 'airtime',
                network,
                status: 'failed'
            }).save();
            return res.status(500).json({ message: 'Payment processing failed', error: response.data.error });
        }
    } catch (error) {
        await new Payment({
            userId,
            amount,
            type: 'airtime',
            network,
            status: 'failed'
        }).save();
        return handleError(res, error);
    }
};

// Function to handle utility payments
exports.utilityPayment = async (req, res) => {
    const { amount, utilityProvider, accountNumber } = req.body;
    const userId = req.user.id;

    // Input validation
    if (!amount || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: 'Invalid amount' });
    }
    if (!utilityProvider || typeof utilityProvider !== 'string') {
        return res.status(400).json({ message: 'Invalid utility provider' });
    }
    if (!accountNumber || typeof accountNumber !== 'string') {
        return res.status(400).json({ message: 'Invalid account number' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Call external API to process utility payment (replace with actual API endpoint)
        const response = await axios.post('https://api.example.com/utility', {
            amount,
            utilityProvider,
            walletAddress: user.walletAddress,
            accountNumber,
        });

        if (response.data.success) {
            const payment = new Payment({
                userId,
                amount,
                type: 'utility',
                utilityProvider,
                transactionId: response.data.transactionId,
                status: 'completed'
            });
            await payment.save();

            return res.status(200).json({ message: 'Utility payment successful', transactionId: response.data.transactionId });
        } else {
            await new Payment({
                userId,
                amount,
                type: 'utility',
                utilityProvider,
                status: 'failed'
            }).save();
            return res.status(500).json({ message: 'Utility payment failed', error: response.data.error });
        }
    } catch (error) {
        await new Payment({
            userId,
            amount,
            type: 'utility',
            utilityProvider,
            status: 'failed'
        }).save();
        return handleError(res, error);
    }
};