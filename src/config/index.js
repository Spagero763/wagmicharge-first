const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    PORT: process.env.PORT || 5000,
    DB_URI: process.env.DB_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/wagmicharge',
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
    PAYMENT_API_KEY: process.env.PAYMENT_API_KEY || 'your_payment_api_key',
    COINGECKO_API_URL: process.env.COINGECKO_API_URL || 'https://api.coingecko.com/api/v3/simple/price',
};