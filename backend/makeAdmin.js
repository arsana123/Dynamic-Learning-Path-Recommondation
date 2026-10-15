import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';

dotenv.config();

const makeAdmin = async () => {
  try {
    await connectDB();

    const email = process.argv[2];
    
    if (!email) {
      console.log('Please provide an email address');
      console.log('Usage: node makeAdmin.js user@example.com');
      process.exit(1);
    }

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { role: 'admin' },
      { new: true }
    );

    if (!user) {
      console.log(`User with email ${email} not found`);
      process.exit(1);
    }

    console.log(`Successfully made ${user.name} (${user.email}) an admin!`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

makeAdmin();