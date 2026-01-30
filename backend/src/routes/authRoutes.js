import express from 'express';
import { register, login, getProfile, updateProfile, getUserById, updateUserById } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * REGISTER USER
 * POST http://localhost:3000/api/auth/register
 */
<<<<<<< HEAD
router.post('/register', register);
=======
router.post('/register', async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;
>>>>>>> 3727e22318f3cd4cfc3a228a0e65099b1e1c4c23

/**
 * LOGIN USER
 * POST /api/auth/login
 */
router.post('/login', login);

/**
 * GET CURRENT USER PROFILE
 * GET /api/auth/profile (requires authentication)
 */
router.get('/profile', authMiddleware, getProfile);

/**
 * UPDATE USER PROFILE
 * PUT /api/auth/profile (requires authentication)
 */
router.put('/profile', authMiddleware, updateProfile);

/**
 * GET USER BY ID
 * GET /api/auth/users/:userId
 */
router.get('/users/:userId', getUserById);

<<<<<<< HEAD
/**
 * UPDATE USER BY ID
 * PUT /api/auth/users/:userId (requires authentication)
 */
router.put('/users/:userId', authMiddleware, updateUserById);
=======
    // Create user (NO ROLE)
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
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
>>>>>>> 3727e22318f3cd4cfc3a228a0e65099b1e1c4c23

export default router;
