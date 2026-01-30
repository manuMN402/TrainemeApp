import express from 'express';
import prisma from '../config/prisma.js';
import { hashPassword } from '../utils/auth.js';

const router = express.Router();

/**
 * REGISTER USER
 * POST /api/auth/register
 */
router.post('/register', async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password, role = 'USER' } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
        role, // USER or TRAINER
      },
    });

    // Remove password from response
    const { password: _, ...safeUser } = user;

    res.status(201).json({
      message: 'User registered successfully',
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
