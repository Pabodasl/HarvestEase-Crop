const User = require('../models/User');  // Correct the path
const jwt = require('jsonwebtoken');

// Function to generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

//get user by id
const getById = async (req, res) => {
  try {
    const userId = req.params.id; // Get the user ID from the request parameters
    const user = await User.findById(userId); // Find the user by ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user); // Send the user data as a response
  } catch (error) {
    res.status(500).json({ message: 'unable to fetch user. error: ', error: err.message });
  }
}

// Register user
const registerUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create and save a new user
    const newUser = new User({ email, password, role });
    await newUser.save();

    // Generate JWT token
    const token = generateToken(newUser._id, newUser.role);
    res.status(201).json({ token }); // Send back the token
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user._id, user.role);
    res.json({ token }); // Send back the token
  } catch (err) {
    res.status(500).json({ message: 'Error logging in user', error: err.message });
  }
};

module.exports = { registerUser, loginUser, getById };
