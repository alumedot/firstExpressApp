import crypto from 'crypto';
import { hash, compare } from 'bcryptjs';
import nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';
import { validationResult } from 'express-validator';
import { User } from '../models/user';
import type { ExpressCB } from './types';

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: process.env.SENDGRID_API_KEY
  }
}));

export const getLogin: ExpressCB = async (req, res) => {
  try {
    let message: string | string[] = req.flash('error');
    if (message.length) {
      message = message[0];
    } else {
      message = null;
    }

    return res.render('auth/login', {
      pageTitle: 'Login',
      path: '/login',
      isLoggedIn: false,
      csrfToken: req.csrfToken(),
      errorMessage: message,
      prevInput: {},
      validationErrors: []
    });
  } catch (e) {
    console.log(e);
  }
};

export const getSignup: ExpressCB = async (req, res) => {
  let message: string | string[] = req.flash('error');
  if (message.length) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('auth/signup', {
    pageTitle: 'Signup',
    path: '/signup',
    isLoggedIn: false,
    errorMessage: message,
    prevInput: {},
    validationErrors: []
  });
};

export const postLogin: ExpressCB = async (
  req,
  res,
  next
) => {
  try {
    const errors = validationResult(req);
    const { body: { email, password } } = req;

    if (!errors.isEmpty()) {
      return res.status(422).render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        isLoggedIn: false,
        csrfToken: req.csrfToken(),
        errorMessage: errors.array()[0].msg,
        prevInput: { email, password },
        validationErrors: errors.array()
      });
    }

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(422).render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        isLoggedIn: false,
        csrfToken: req.csrfToken(),
        errorMessage: 'Invalid email or password',
        prevInput: { email, password },
        validationErrors: []
      });
    }

    const isCorrectPassword = await compare(req.body.password, user.password);

    if (isCorrectPassword) {
      (req.session as any).isLoggedIn = true;
      (req.session as any).user = user;
      return req.session.save((err) => {
        err && console.log(err);
        res.redirect('/');
      });
    }

    return res.status(422).render('auth/login', {
      pageTitle: 'Login',
      path: '/login',
      isLoggedIn: false,
      csrfToken: req.csrfToken(),
      errorMessage: 'Invalid email or password',
      prevInput: { email, password },
      validationErrors: []
    });
  } catch (e) {
    const error = new Error(e);
    (error as Error & { httpStatusCode: number }).httpStatusCode = 500;
    return next(error);
  }
};

export const postSignup: ExpressCB = async (
  req,
  res,
  next
) => {
  const { body: { email, password, confirmPassword } } = req;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      pageTitle: 'Signup',
      path: '/signup',
      isLoggedIn: false,
      errorMessage: errors.array()[0].msg,
      prevInput: { email, password, confirmPassword },
      validationErrors: errors.array()
    });
  }

  try {
    const hashedPassword = await hash(password, 12);
    const newUser = new User({
      email,
      password: hashedPassword,
      cart: { items: [] }
    });
    await newUser.save();
    transporter.sendMail({
      to: email,
      from: 'alumedot@icloud.com',
      subject: 'Signup success',
      html: '<h1>You successfully signed up!</h1>'
    }).catch(e => console.log(e));
    res.redirect('/login');
  } catch (e) {
    const error = new Error(e);
    (error as Error & { httpStatusCode: number }).httpStatusCode = 500;
    return next(error);
  }
}

export const postLogout: ExpressCB = async (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/');
  });
};

export const getReset: ExpressCB = (req, res) => {
  let message: string | string[] = req.flash('error');
  if (message.length) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('auth/reset', {
    pageTitle: 'Reset Password',
    path: '/reset',
    errorMessage: message
  });
}

export const postReset: ExpressCB = async (req, res, next) => {
  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');

    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        req.flash('error', 'No account with that email found');
        return res.redirect('/reset');
      }
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      await user.save();
      transporter.sendMail({
        to: req.body.email,
        from: 'alumedot@icloud.com',
        subject: 'Password reset',
        html: `
          <p>You requested a password reset</p>
          <p>Click this <a href="http://localhost:3030/reset/${token}">link</a> to set a new password</p>
        `
      }).catch(e => console.log(e));
      res.redirect('/');
    } catch (e) {
      const error = new Error(e);
      (error as Error & { httpStatusCode: number }).httpStatusCode = 500;
      return next(error);
    }
  })
}

export const getNewPassword: ExpressCB = async (req, res, next) => {
  const token = req.params.token;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() }
    })

    let message: string | string[] = req.flash('error');
    if (message.length) {
      message = message[0];
    } else {
      message = null;
    }

    return res.render('auth/new-password', {
      pageTitle: 'New Password',
      path: '/new-password',
      errorMessage: message,
      userId: user._id.toString(),
      passwordToken: token
    });
  } catch (e) {
    const error = new Error(e);
    (error as Error & { httpStatusCode: number }).httpStatusCode = 500;
    return next(error);
  }
}

export const postNewPassword: ExpressCB = async (req, res, next) => {
  const { password, userId, passwordToken } = req.body;

  try {
    const user = await User.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId
    })

    user.password = await hash(password, 12);
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.redirect('/login');
  } catch (e) {
    const error = new Error(e);
    (error as Error & { httpStatusCode: number }).httpStatusCode = 500;
    return next(error);
  }
}
