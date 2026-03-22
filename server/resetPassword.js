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
    
    console.log("✅ Connected to MongoDB");
    
    // Find user
    const user = await User.findOne({ 
      $or: [
        { email: email },
        { username: email }
      ]
    });
    
    if (!user) {
      console.log(`❌ User not found: ${email}`);
      await mongoose.disconnect();
      return;
    }
    
    console.log(`✅ User found: ${user.username} (${user.email})`);
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    await User.updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword } }
    );
    
    console.log(`✅ Password updated successfully for ${user.username}`);
    console.log(`   New password: ${newPassword}`);
    
    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

// Usage: node resetPassword.js user@gmail.com newpassword123
const email = process.argv[2];
const newPassword = process.argv[3];

if (!email || !newPassword) {
  console.log("Usage: node resetPassword.js <email> <newPassword>");
  console.log("Example: node resetPassword.js user@gmail.com user123");
  process.exit(1);
}

resetPassword(email, newPassword);
