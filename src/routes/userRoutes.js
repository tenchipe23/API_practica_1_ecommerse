const express = require('express');
const { 
  registerUser, 
  authUser, 
  getUserProfile, 
  updateUserProfile, 
  changePassword, 
  deleteAccount 
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/register').post(registerUser);
router.post('/login', authUser);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.post('/change-password', protect, changePassword);
router.delete('/account', protect, deleteAccount);

module.exports = router;