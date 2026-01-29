import AsyncStorage from '@react-native-async-storage/async-storage';

// Get all registered users
export const getAllUsers = async () => {
  try {
    const usersJson = await AsyncStorage.getItem('traineme_users');
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
};

// Check if email already exists
export const emailExists = async (email) => {
  try {
    const users = await getAllUsers();
    return users.some(user => user.email.toLowerCase() === email.toLowerCase());
  } catch (error) {
    console.error('Error checking email:', error);
    return false;
  }
};

// Save new user
export const saveUser = async (userData) => {
  try {
    const users = await getAllUsers();
    users.push(userData);
    await AsyncStorage.setItem('traineme_users', JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('Error saving user:', error);
    return false;
  }
};

// Find user by email or user ID
export const findUser = async (emailOrUserId, password) => {
  try {
    const users = await getAllUsers();
    const user = users.find(
      u => (u.email.toLowerCase() === emailOrUserId.toLowerCase() || 
             u.userId === emailOrUserId) &&
           u.password === password
    );
    return user || null;
  } catch (error) {
    console.error('Error finding user:', error);
    return null;
  }
};

// Get user by email (to get user ID)
export const getUserByEmail = async (email) => {
  try {
    const users = await getAllUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
};

// Get user by user ID or email
export const getUserByIdOrEmail = async (emailOrUserId) => {
  try {
    const users = await getAllUsers();
    return users.find(
      u => u.email.toLowerCase() === emailOrUserId.toLowerCase() || 
           u.userId === emailOrUserId
    ) || null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};
