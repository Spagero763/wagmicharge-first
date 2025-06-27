// filepath: wagmicharge-backend/wagmicharge-backend/src/utils/index.js

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

const validatePhoneNumber = (phone) => {
    const re = /^\+?[1-9]\d{1,14}$/;
    return re.test(String(phone));
};

const validateWalletAddress = (address) => {
    // Basic Ethereum address validation
    return /^0x[a-fA-F0-9]{40}$/.test(address);
};

const handleError = (res, error) => {
    console.error(error);
    res.status(500).json({ message: 'An error occurred', error: error.message });
};

module.exports = {
    validateEmail,
    validatePhoneNumber,
    validateWalletAddress,
    handleError,
};