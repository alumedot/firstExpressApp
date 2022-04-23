import express from 'express';
import { check, body } from 'express-validator';
import * as authController from '../controllers/auth';

export const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email'),
    body(
      'password',
      'Please enter a password with only numbers and letters, at least 6 characters'
    )
      .isLength({ min: 6 })
      .isAlphanumeric()
  ],
  authController.postSignup
);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);
