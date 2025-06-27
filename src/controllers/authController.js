const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { validateEmail, validateWalletAddress, handleError } = require('../utils');

// Signup function (passkey + mnemonic)
exports.signup = async (req, res) => {
    const { email, walletAddress, passkeyId, mnemonic, recoveryInfo } = req.body;

    // Input validation
    if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Invalid email address' });
    }
    if (!validateWalletAddress(walletAddress)) {
        return res.status(400).json({ message: 'Invalid wallet address' });
    }
    if (!passkeyId || typeof passkeyId !== 'string') {
        return res.status(400).json({ message: 'Invalid passkeyId' });
    }
    if (!mnemonic || typeof mnemonic !== 'string') {
        return res.status(400).json({ message: 'Invalid mnemonic' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const newUser = new User({
            email,
            walletAddress,
            passkeyId,
            mnemonic, // Should be encrypted before saving in production
            recoveryInfo
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        return handleError(res, error);
    }
};

// Login function (passkey-based)
exports.login = async (req, res) => {
    const { email, passkeyId } = req.body;

    // Input validation
    if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Invalid email address' });
    }
    if (!passkeyId || typeof passkeyId !== 'string') {
        return res.status(400).json({ message: 'Invalid passkeyId' });
    }

    try {
        // Find user by email and passkeyId
        const user = await User.findOne({ email, passkeyId });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        return handleError(res, error);
    }
};

// Get user profile (protected)
exports.getProfile = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Exclude sensitive fields
        const { mnemonic, ...safeUser } = user.toObject();
        res.status(200).json({ user: safeUser });
    } catch (error) {
        return handleError(res, error);
    }
};