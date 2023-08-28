const express = require('express');
const { fetchChats, accessChat, createGroupChat, renameGroupChat, removeFromGroup, addToGroup } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.route('/').post(protect, accessChat);
router.route('/').get(protect, fetchChats);
router.route('/group').post(protect, createGroupChat);
router.route('/rename').put(protect, renameGroupChat);
router.route('/addgroup').put(protect, addToGroup);
router.route('/removefromgroup').put(protect, removeFromGroup);

module.exports = router;

