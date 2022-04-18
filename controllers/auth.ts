import { hash, compare } from 'bcryptjs';
import nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';
import { User } from '../models/user';
import type { ExpressCB } from './types';

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: 'test', // here should be a real api key
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
    errorMessage: message
  });
};

export const postLogin: ExpressCB = async (
  req,
  res
) => {
  try {
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
  const { body: { email, password } } = req;

  try {
    const user = await User.findOne({ email });
    if (user) {
      req.flash('error', 'Email already exists');
      return res.redirect('/signup');
    }
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
