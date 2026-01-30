import prisma from '../config/database.js';

// Create trainer profile
export const createTrainerProfile = async (req, res, next) => {
  try {
    const { bio, specialty, experience, certification, certifications, experienceText, hourlyRate, profileImage, bannerImage, isVerified, isOnline } = req.body;

    // Check if trainer profile already exists
    const existingProfile = await prisma.trainerProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (existingProfile) {
      return res.status(400).json({ error: 'Trainer profile already exists' });
    }

    const trainerProfile = await prisma.trainerProfile.create({
      data: {
        userId: req.user.id,
        bio,
        specialty,
        experience: experience ? parseInt(experience) : undefined,
        certification,
        certifications,
        experienceText,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : undefined,
        isVerified: typeof isVerified === 'undefined' ? undefined : Boolean(isVerified),
        isOnline: typeof isOnline === 'undefined' ? undefined : Boolean(isOnline),
        profileImage,
        bannerImage,
      },
    });

    res.status(201).json({
      message: 'Trainer profile created successfully',
      trainerProfile,
    });
  } catch (error) {
    next(error);
  }
};

// Get trainer profile
export const getTrainerProfile = async (req, res, next) => {
  try {
    const { trainerId } = req.params;

    const trainerProfile = await prisma.trainerProfile.findUnique({
      where: { id: trainerId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        availabilities: true,
      },
    });

    if (!trainerProfile) {
      return res.status(404).json({ error: 'Trainer not found' });
    }

    res.json(trainerProfile);
  } catch (error) {
    next(error);
  }
};

// Update trainer profile
export const updateTrainerProfile = async (req, res, next) => {
  try {
    const { bio, specialty, experience, certification, certifications, experienceText, hourlyRate, profileImage, bannerImage, isVerified, isOnline } = req.body;

    const trainerProfile = await prisma.trainerProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!trainerProfile) {
      return res.status(404).json({ error: 'Trainer profile not found' });
    }

    const updated = await prisma.trainerProfile.update({
      where: { id: trainerProfile.id },
      data: {
        bio: bio || undefined,
        specialty: specialty || undefined,
        experience: experience ? parseInt(experience) : undefined,
        certification: certification || undefined,
        certifications: certifications || undefined,
        experienceText: experienceText || undefined,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : undefined,
        isVerified: typeof isVerified === 'undefined' ? undefined : Boolean(isVerified),
        isOnline: typeof isOnline === 'undefined' ? undefined : Boolean(isOnline),
        profileImage: profileImage || undefined,
        bannerImage: bannerImage || undefined,
      },
    });

    res.json({
      message: 'Trainer profile updated successfully',
      trainerProfile: updated,
    });
  } catch (error) {
    next(error);
  }
};

// Delete trainer profile (owner)
export const deleteTrainerProfile = async (req, res, next) => {
  try {
    const trainerProfile = await prisma.trainerProfile.findUnique({ where: { userId: req.user.id } });
    if (!trainerProfile) return res.status(404).json({ error: 'Trainer profile not found' });

    await prisma.trainerProfile.delete({ where: { id: trainerProfile.id } });

    res.json({ message: 'Trainer profile deleted' });
  } catch (error) {
    next(error);
  }
};

// Get all trainers (with search and filter)
export const getAllTrainers = async (req, res, next) => {
  try {
    const { specialty, minPrice, maxPrice, rating, page = 1, limit = 10 } = req.query;

    const where = {};

    if (specialty) {
      where.specialty = { contains: specialty, mode: 'insensitive' };
    }

    if (minPrice || maxPrice) {
      where.hourlyRate = {};
      if (minPrice) where.hourlyRate.gte = parseFloat(minPrice);
      if (maxPrice) where.hourlyRate.lte = parseFloat(maxPrice);
    }

    if (rating) {
      where.rating = { gte: parseFloat(rating) };
    }

    const trainers = await prisma.trainerProfile.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            profileImage: true,
          },
        },
      },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
      orderBy: { rating: 'desc' },
    });

    const total = await prisma.trainerProfile.count({ where });

    res.json({
      trainers,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};
