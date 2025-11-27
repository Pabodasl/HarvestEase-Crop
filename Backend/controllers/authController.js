const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, 'your_jwt_secret', { expiresIn: '1d' });
};

//get user by id
 exports.getById = async (req, res) => {
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

// Register User
exports.register = async (req, res) => {
  const name = (req.body.name || '').trim();
  const email = (req.body.email || '').trim().toLowerCase();
  const password = (req.body.password || '').trim();
  const role = ((req.body.role || 'farmer').trim().toLowerCase());
  try {
    const existing = await User.findOne({ email: { $regex: `^${email}$`, $options: 'i' } });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const user = await User.create({ name, email, password, role });
    const token = generateToken(user._id, user.role);
    res.status(201).json({ user, token });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// Login User
exports.login = async (req, res) => {
  const rawEmail = (req.body.email || '').trim();
  const rawPassword = (req.body.password || '').trim();
  const email = rawEmail.toLowerCase();
  const password = rawPassword;
  try {
    // Find user by email, case-insensitive
    const user = await User.findOne({ email: { $regex: `^${email}$`, $options: 'i' } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let isMatch = false;
    try {
      if (typeof user.matchPassword === 'function') {
        isMatch = await user.matchPassword(password);
      } else if (typeof user.correctPassword === 'function') {
        isMatch = await user.correctPassword(password, user.password);
      } else {
        isMatch = false;
      }
    } catch (e) {
      isMatch = false;
    }

    // Fallback: if stored password looks unhashed, migrate on the fly
    const looksHashed = typeof user.password === 'string' && user.password.startsWith('$2');
    if (!isMatch && !looksHashed && user.password === password) {
      user.password = password; // triggers pre-save hook to hash
      await user.save();
      isMatch = true;
    }

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = generateToken(user._id, user.role);
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
