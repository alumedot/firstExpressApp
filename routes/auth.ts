import express from 'express';
import * as authController from '../controllers/auth';

export const router = express.Router();

router.get('/login', authController.getLogin);
