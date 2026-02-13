import express from 'express';
import { signup, login, logout, protectRoute, checkAuth } from '../controllers/auth.js';

const router = express.Router();


router.post('/signup', signup);
router.post('/login', login);


router.post('/logout', protectRoute, logout);
router.get('/me', protectRoute, checkAuth);

export default router;
