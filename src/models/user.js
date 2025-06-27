const mongoose = require('mongoose');
const crypto = require('crypto');

const ENCRYPTION_KEY = process.env.MNEMONIC_ENCRYPTION_KEY || 'default_secret_key_32bytes!'; // Must be 32 bytes
const IV_LENGTH = 16;

function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text) {
    const parts = text.split(':');
    const iv = Buffer.from(parts.shift(), 'hex');
    const encryptedText = parts.join(':');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    walletAddress: {
        type: String,
        required: true,
        unique: true
    },
    passkeyId: {
        type: String,
        required: true
    },
    mnemonic: {
        type: String,
        required: true // Should be encrypted before saving
    },
    recoveryInfo: {
        type: Object,
        default: {}
    }
}, { timestamps: true });

// Encrypt mnemonic before saving
userSchema.pre('save', function (next) {
    if (this.isModified('mnemonic')) {
        this.mnemonic = encrypt(this.mnemonic);
    }
    next();
});

// Add a method to decrypt mnemonic
userSchema.methods.getDecryptedMnemonic = function () {
    return decrypt(this.mnemonic);
};

const User = mongoose.model('User', userSchema);

module.exports = User;