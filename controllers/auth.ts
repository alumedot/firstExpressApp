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

    res.render('auth/login', {
      pageTitle: 'Login',
      path: '/login',
      isLoggedIn: false,
      csrfToken: req.csrfToken(),
      errorMessage: message
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
  res
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        isLoggedIn: false,
        csrfToken: req.csrfToken(),
        errorMessage: errors.array()[0].msg
      });
    }

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/login');
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

    req.flash('error', 'Invalid email or password');
    res.redirect('/login');
  } catch (e) {
    console.log(e);
  }
};

export const postSignup: ExpressCB = async (
  req,
  res
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
    console.log(e);
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

export const postReset: ExpressCB = async (req, res) => {
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
      console.log(e);
    }
  })
}

export const getNewPassword: ExpressCB = async (req, res) => {
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

    res.render('auth/new-password', {
      pageTitle: 'New Password',
      path: '/new-password',
      errorMessage: message,
      userId: user._id.toString(),
      passwordToken: token
    });
  } catch (e) {
    console.log(e);
  }
}

export const postNewPassword: ExpressCB = async (req, res) => {
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
    console.log(e);
  }
}
