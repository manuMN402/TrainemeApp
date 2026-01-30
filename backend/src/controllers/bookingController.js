import prisma from '../config/database.js';

// Create booking
export const createBooking = async (req, res, next) => {
  try {
    const { trainerId, sessionDate, startTime, endTime, notes } = req.body;

    // Verify trainer exists
    const trainer = await prisma.trainerProfile.findUnique({
      where: { id: trainerId },
    });

    if (!trainer) {
      return res.status(404).json({ error: 'Trainer not found' });
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: req.user.id,
        trainerId,
        sessionDate: new Date(sessionDate),
        startTime,
        endTime,
        price: trainer.hourlyRate,
        notes,
        status: 'Pending',
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        trainer: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json({
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// Get user bookings
export const getUserBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const where = { userId: req.user.id };

    if (status) {
      where.status = status;
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        trainer: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        review: true,
      },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
      orderBy: { sessionDate: 'desc' },
    });

    const total = await prisma.booking.count({ where });

    res.json({
      bookings,
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

// Get trainer bookings
export const getTrainerBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const trainerProfile = await prisma.trainerProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!trainerProfile) {
      return res.status(404).json({ error: 'Trainer profile not found' });
    }

    const where = { trainerId: trainerProfile.id };

    if (status) {
      where.status = status;
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
      orderBy: { sessionDate: 'desc' },
    });

    const total = await prisma.booking.count({ where });

    res.json({
      bookings,
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

// Update booking status (for trainers)
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        trainer: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.trainer.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    res.json({
      message: 'Booking status updated successfully',
      booking: updated,
    });
  } catch (error) {
    next(error);
  }
};

// Cancel booking
export const cancelBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.userId !== req.user.id && booking.trainerId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'Cancelled' },
    });

    res.json({
      message: 'Booking cancelled successfully',
      booking: updated,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createBooking,
  getUserBookings,
  getTrainerBookings,
  updateBookingStatus,
  cancelBooking,
};
