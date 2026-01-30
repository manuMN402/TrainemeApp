import prisma from '../config/database.js';
import { hashPassword, comparePassword, generateToken } from '../utils/auth.js';

// Register user or trainer
export const register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone, role } = req.body;

    // Validate input (role must be provided by frontend)
    if (!email || !password || !firstName || !lastName || !role) {
      return res.status(400).json({ error: 'Missing required fields (role is required)' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user (store the role exactly as provided)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        role: role,
      },
    });

    const token = generateToken(user.id, user.role);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    });
  } catch (error) {
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
      where: { email },
      include: {
        trainerProfile: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id, user.role);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        trainerProfile: user.trainerProfile,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
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
      profileImage: user.profileImage,
      role: user.role,
      trainerProfile: user.trainerProfile,
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
export const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, profileImage } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        phone: phone || undefined,
        profileImage: profileImage || undefined,
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
        profileImage: user.profileImage,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get user by ID (public safe view)
export const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { trainerProfile: true },
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      profileImage: user.profileImage,
      role: user.role,
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
    if (req.user.id !== userId) return res.status(403).json({ error: 'Forbidden' });

    const { firstName, lastName, phone, profileImage, password } = req.body;

    const data = {
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      phone: phone || undefined,
      profileImage: profileImage || undefined,
    };

    if (password) {
      data.password = await hashPassword(password);
    }

    const user = await prisma.user.update({ where: { id: userId }, data });

    res.json({ message: 'User updated', user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } });
  } catch (error) {
    next(error);
  }
};

// Delete user by ID (owner only)
export const deleteUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (req.user.id !== userId) return res.status(403).json({ error: 'Forbidden' });

    await prisma.user.delete({ where: { id: userId } });

    res.json({ message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};

// Get all users (authenticated)
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, firstName: true, lastName: true, role: true, profileImage: true },
    });

    res.json(users);
  } catch (error) {
    next(error);
  }
};
