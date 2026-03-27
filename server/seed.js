require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    const adminEmail = 'vipulyadav503@gmail.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin user already exists.');
    } else {
      const admin = new User({
        email: adminEmail,
        password: 'Yogender@2003', // From the migration file
        role: 'admin'
      });
      await admin.save();
      console.log('Admin user created successfully!');
    }
    
    mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding admin!!! FULL ERROR:', err);
    if (err.errors) {
      console.error('Validation Errors:', JSON.stringify(err.errors, null, 2));
    }
    process.exit(1);
  }
};

seedAdmin();
