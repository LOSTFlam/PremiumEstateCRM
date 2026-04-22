// Script to reset user password
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('./model/schema/user');

const resetPassword = async (email, newPassword) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DB_URL, {
      dbName: process.env.DB
    });
    
    // Console statement removed
    
    // Find user
    const user = await User.findOne({ 
      $or: [
        { email: email },
        { username: email }
      ]
    });
    
    if (!user) {
      // Console statement removed
      await mongoose.disconnect();
      return;
    }
    
    // Console statement removed
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    await User.updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword } }
    );
    
    // Console statement removed
    // Console statement removed
    
    await mongoose.disconnect();
    // Console statement removed
  } catch (error) {
    // Console statement removed
    process.exit(1);
  }
};

// Usage: node resetPassword.js user@gmail.com newpassword123
const email = process.argv[2];
const newPassword = process.argv[3];

if (!email || !newPassword) {
  // Console statement removed
  // Console statement removed
  process.exit(1);
}

resetPassword(email, newPassword);
