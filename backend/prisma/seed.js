import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/auth.js';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🌱 Seeding database...');

    // Clear existing data (order matters)
    await prisma.message.deleteMany();
    await prisma.review.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.availability.deleteMany();
    await prisma.trainerProfile.deleteMany();
    await prisma.user.deleteMany();

    const commonPassword = await hashPassword('password123');

    // USERS
    const user1 = await prisma.user.create({
      data: {
        email: 'user1@example.com',
        password: commonPassword,
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        role: 'USER',
      },
    });

    const user2 = await prisma.user.create({
      data: {
        email: 'user2@example.com',
        password: commonPassword,
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+0987654321',
        role: 'USER',
      },
    });

    // TRAINERS (USERS)
    const trainer1User = await prisma.user.create({
      data: {
        email: 'trainer1@example.com',
        password: commonPassword,
        firstName: 'Mike',
        lastName: 'Johnson',
        phone: '+1111111111',
        role: 'TRAINER',
      },
    });

    const trainer2User = await prisma.user.create({
      data: {
        email: 'trainer2@example.com',
        password: commonPassword,
        firstName: 'Sarah',
        lastName: 'Williams',
        phone: '+2222222222',
        role: 'TRAINER',
      },
    });

    // TRAINER PROFILES
    const trainer1 = await prisma.trainerProfile.create({
      data: {
        userId: trainer1User.id,
        bio: 'Certified fitness trainer with 5 years of experience',
        specialty: 'Fitness',
        experience: 5,
        experienceText: '5 years',
        certifications: 'NASM-CPT',
        hourlyRate: 50,
        rating: 4.5,
        reviewCount: 10,
        isVerified: false,
        isOnline: false,
      },
    });

    const trainer2 = await prisma.trainerProfile.create({
      data: {
        userId: trainer2User.id,
        bio: 'Yoga and pilates instructor specializing in flexibility',
        specialty: 'Yoga',
        experience: 7,
        experienceText: '7 years',
        certifications: 'RYT-200',
        hourlyRate: 40,
        rating: 4.8,
        reviewCount: 15,
        isVerified: false,
        isOnline: false,
      },
    });

    // AVAILABILITY
    await prisma.availability.createMany({
      data: [
        {
          trainerId: trainer1.id,
          day: 'MONDAY',
          startTime: '09:00',
          endTime: '17:00',
        },
        {
          trainerId: trainer1.id,
          day: 'WEDNESDAY',
          startTime: '10:00',
          endTime: '18:00',
        },
        {
          trainerId: trainer2.id,
          day: 'TUESDAY',
          startTime: '08:00',
          endTime: '16:00',
        },
        {
          trainerId: trainer2.id,
          day: 'THURSDAY',
          startTime: '09:00',
          endTime: '17:00',
        },
      ],
    });

    // BOOKINGS
    const booking1 = await prisma.booking.create({
      data: {
        userId: user1.id,
        trainerId: trainer1.id,
        sessionDate: new Date('2026-02-05'),
        startTime: '10:00',
        endTime: '11:00',
        price: 50,
        status: 'CONFIRMED',
      },
    });

    await prisma.booking.create({
      data: {
        userId: user2.id,
        trainerId: trainer2.id,
        sessionDate: new Date('2026-02-10'),
        startTime: '14:00',
        endTime: '15:00',
        price: 40,
        status: 'PENDING',
      },
    });

    // REVIEW
    await prisma.review.create({
      data: {
        bookingId: booking1.id,
        trainerId: trainer1.id,
        rating: 5,
        comment: 'Great trainer! Very professional and knowledgeable.',
      },
    });

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
