export default function errorHandler(err, req, res, next) {
  console.error('[ERROR]', err.message);
  console.error('[ERROR Stack]', err.stack);

  // Prisma unique constraint error
  if (err.code === 'P2002') {
    const target = err.meta?.target?.[0];
    console.error('[Prisma Error] Unique constraint violation on field:', target);
    return res.status(400).json({
      error: `${target || 'Field'} already exists`,
    });
  }

  // Prisma record not found
  if (err.code === 'P2025') {
    console.error('[Prisma Error] Record not found');
    return res.status(404).json({
      error: 'Record not found',
    });
  }

  // Prisma connection error
  if (err.code === 'P1000' || err.code === 'P1001') {
    console.error('[Prisma Error] Database connection failed');
    return res.status(503).json({
      error: 'Database connection failed. Please try again later.',
    });
  }

  // Default error
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
} 
