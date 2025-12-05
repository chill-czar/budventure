const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/response');
const { generateToken } = require('../utils/jwt');

const register = async (req, res) => {
  const { name, email, password } = req.body;

  console.log('Registration attempt:', { name, email, password: '[HIDDEN]' });

  const userExists = await User.findOne({ email });
  console.log('User exists check result:', !!userExists);
  if (userExists) {
    console.log('User already exists, returning 400');
    return sendError(res, 400, 'User already exists');
  }

  try {
    console.log('Creating user...');
    const user = await User.create({
      name,
      email,
      password
    });
    console.log('User creation result:', !!user);

    if (user) {
      const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      };

      console.log('Generating token...');
      const token = generateToken({ id: user._id });
      console.log('Token generated successfully');

      sendSuccess(res, 201, 'User registered successfully', {
        user: userData,
        token
      });
    } else {
      console.log('User creation returned falsy');
      sendError(res, 400, 'Invalid user data');
    }
  } catch (error) {
    console.error('User creation error:', error.message);
    console.error('Error stack:', error.stack);
    sendError(res, 400, 'Invalid user data');
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return sendError(res, 401, 'Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return sendError(res, 401, 'Invalid credentials');
  }

  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };

  const token = generateToken({ id: user._id });

  sendSuccess(res, 200, 'Login successful', {
    user: userData,
    token
  });
};

const getMe = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    sendSuccess(res, 200, 'User data retrieved successfully', { user: userData });
  } else {
    sendError(res, 404, 'User not found');
  }
};

module.exports = {
  register,
  login,
  getMe
};
