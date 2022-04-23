import express from 'express';
import { check, body } from 'express-validator';
import * as authController from '../controllers/auth';
import { User } from '../models/user';

export const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .custom(async (value) => {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject('Email already exists');
        }
      }),
    body(
      'password',
      'Please enter a password with only numbers and letters, at least 6 characters'
    )
      .isLength({ min: 6 })
      .isAlphanumeric(),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords have to match');
      }
      return true;
    })
  ],
  authController.postSignup
);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);
