const mongoose = require('mongoose');

// create login schema
const user = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        index: true,  // Index for login lookups
        lowercase: true,  // Normalize email/username
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
        index: true,  // Index for email lookups
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    role: { 
        type: String, 
        default: 'user',
        index: true,  // Index for role-based filtering
    },
    // Refresh token for token rotation
    refreshToken: {
        type: String,
        default: null,
        select: false,
        index: true,  // Index for efficient token lookups
    },
    // Track refresh token expiry for rotation
    refreshTokenExpiry: {
        type: Date,
        default: null,
    },
    // Password history to prevent reuse
    passwordHistory: [{
        password: String,
        createdAt: { type: Date, default: Date.now },
    }],
    // Account security settings
    lastPasswordChange: {
        type: Date,
        default: Date.now,
    },
    // Session management
    lastLoginAt: {
        type: Date,
        default: null,
    },
    lastActiveAt: {
        type: Date,
        default: null,
    },
    // Failed login attempts for lockout
    failedLoginAttempts: {
        type: Number,
        default: 0,
    },
    lockedUntil: {
        type: Date,
        default: null,
    },
    emailsent: { type: Number, default: 0 },
    textsent: { type: Number, default: 0 },
    outboundcall: { type: Number, default: 0 },
    phoneNumber: { type: String },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    roles: [{
        type: mongoose.Schema.ObjectId,
        ref: 'RoleAccess',
    }],
    deleted: {
        type: Boolean,
        default: false,
        index: true,  // Index for soft-delete filtering
    },
    // Explicit date fields for backward compatibility
    // (timestamps: true also creates createdAt/updatedAt)
    createdDate: {
        type: Date,
        default: Date.now,
    },
    updatedDate: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,  // Auto-manage createdAt/updatedAt
});

// Compound indexes for common queries
user.index({ role: 1, deleted: 1 });  // Active users by role
user.index({ username: 1, deleted: 1 });  // Unique active username
user.index({ email: 1, deleted: 1 });  // Unique active email

function applySaveNormalization(doc) {
  // Sync old field names with new timestamp fields
  if (doc.isNew && !doc.createdDate) {
    doc.createdDate = new Date();
  }
  doc.updatedDate = new Date();
}

user.statics.applySaveNormalization = function applyUserSaveNormalization(doc) {
  applySaveNormalization(doc);
  return doc;
};

// Middleware to sync createdDate/updatedDate with createdAt/updatedAt
user.pre('save', function() {
  this.constructor.applySaveNormalization(this);
});

module.exports = mongoose.model('User', user, 'User');
