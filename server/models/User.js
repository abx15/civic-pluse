const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: { // For authorities mostly, citizens might use OTP which we can handle later
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['citizen', 'authority', 'admin'],
        default: 'citizen'
    },
    department: {
        type: String, // e.g., 'police', 'fire', 'medical', 'municipal'
        default: null
    },
    phone: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Methods to match password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Pre-save to hash password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
