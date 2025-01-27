const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String },
  savedAddresses: [{
    fullName: String,
    streetAddress: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    phoneNumber: String
  }],
  savedPaymentMethods: [{
    type: { type: String, enum: ['credit', 'debit', 'paypal'] },
    lastFourDigits: String,
    cardHolderName: String
  }],
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  profileImage: String,
  createdAt: { type: Date, default: Date.now }
}, {
  methods: {
    matchPassword: async function(enteredPassword) {
      return await bcrypt.compare(enteredPassword, this.password);
    }
  }
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', UserSchema);