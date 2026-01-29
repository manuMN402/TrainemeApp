/**
 * Generate a unique user ID
 * Format: TRAINEME-XXXXXXXX (8 random alphanumeric characters)
 */
export const generateUniqueUserId = () => {
  const prefix = "TRAINEME";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomPart = "";

  for (let i = 0; i < 8; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `${prefix}-${randomPart}`;
};

/**
 * Generate a simple numeric user ID
 * Format: 6-digit number
 */
export const generateNumericUserId = () => {
  return String(Math.floor(100000 + Math.random() * 900000));
};

/**
 * Generate UUID v4 format user ID
 */
export const generateUUIDUserId = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
