import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const isTrainer = (req, res, next) => {
  if (!req.user || String(req.user.role).toLowerCase() !== 'trainer') {
    return res.status(403).json({ error: 'Only trainers can access this route' });
  }
  next();
};

export const isUser = (req, res, next) => {
  if (!req.user || String(req.user.role).toLowerCase() !== 'user') {
    return res.status(403).json({ error: 'Only users can access this route' });
  }
  next();
};
