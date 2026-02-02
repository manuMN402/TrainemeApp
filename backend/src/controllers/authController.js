import prisma from '../config/database.js';
import { hashPassword, comparePassword, generateToken } from '../utils/auth.js';

// Register user
export const register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    console.log('[REGISTER] Request received with:', { email, firstName, lastName, phone });

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      console.error('[REGISTER] Missing required fields');
      return res.status(400).json({ error: 'Missing required fields: email, password, firstName, lastName' });
    }

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim();
    console.log('[REGISTER] Normalized email:', normalizedEmail);

    // Check if email already exists
    console.log('[REGISTER] Checking if email exists...');
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      console.error('[REGISTER] Email already registered:', normalizedEmail);
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    console.log('[REGISTER] Hashing password...');
    const hashedPassword = await hashPassword(password);

    // Create user
    console.log('[REGISTER] Creating user in database...');
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        firstName,
        lastName,
        phone: phone || '', // Allow empty phone
      },
    });

    console.log('[REGISTER] User created successfully:', user.id);

    // Generate token
    console.log('[REGISTER] Generating token...');
    const token = generateToken(user.id);

    console.log('[REGISTER] Sending success response');
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
      },
      token,
    });
  } catch (error) {
    console.error('[REGISTER] Error caught:', error);
    next(error);
  }
};

// Login user
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        trainerProfile: true,
      },
    });

    if (!user) {
      console.log(`[LOGIN] User not found for email: ${email}`);
      return res.status(401).json({ error: 'Invalid email/User ID or password. Please check and try again or register if you\'re new.' });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      console.log(`[LOGIN] Invalid password for user: ${email}`);
      return res.status(401).json({ error: 'Invalid email/User ID or password. Please check and try again or register if you\'re new.' });
    }

    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        trainerProfile: user.trainerProfile,
      },
      token,
    });
  } catch (error) {
    console.error('[LOGIN] Error:', error);
    next(error);
  }
};

// Get current user profile
export const getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        trainerProfile: {
          include: {
            availabilities: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      trainerProfile: user.trainerProfile,
    });
  } catch (error) {
    next(error);
  }
};

// Update current user profile
export const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phone } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        phone: phone || undefined,
      },
      include: {
        trainerProfile: true,
      },
    });

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get user by ID
export const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { trainerProfile: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      trainerProfile: user.trainerProfile,
    });
  } catch (error) {
    next(error);
  }
};

// Update user by ID (owner only)
export const updateUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (req.user.id !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { firstName, lastName, phone, password } = req.body;

    const data = {
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      phone: phone || undefined,
    };

    if (password) {
      data.password = await hashPassword(password);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data,
    });

    res.json({
      message: 'User updated',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete user by ID
export const deleteUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (req.user.id !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await prisma.user.delete({ where: { id: userId } });

    res.json({ message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};

// Get all users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    res.json(users);
  } catch (error) {
    next(error);
  }
};
