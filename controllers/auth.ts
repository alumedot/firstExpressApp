import { hash, compare } from 'bcryptjs';
import { User } from '../models/user';
import type { ExpressCB } from './types';

export const getLogin: ExpressCB = async (req, res) => {
  try {
    res.render('auth/login', {
      pageTitle: 'Login',
      path: '/login',
      isLoggedIn: false,
      csrfToken: req.csrfToken()
    });
  } catch (e) {
    console.log(e);
  }
};

export const getSignup: ExpressCB = async (req, res) => {
  res.render('auth/signup', {
    pageTitle: 'Signup',
    path: '/signup',
    isLoggedIn: false
  });
};

export const postLogin: ExpressCB = async (
  {
    session,
    body: { email, password }
  },
  res
) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.redirect('/login');
    }

    const isCorrectPassword = await compare(password, user.password);

    if (isCorrectPassword) {
      (session as any).isLoggedIn = true;
      (session as any).user = user;
      return session.save((err) => {
        err && console.log(err);
        res.redirect('/');
      });
    }

    res.redirect('/login');
  } catch (e) {
    console.log(e);
  }
};

export const postSignup: ExpressCB = async (
  {
    body: { email, password, confirmPassword }
  },
  res
) => {
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.redirect('/signup');
    }
    const hashedPassword = await hash(password, 12);
    console.log('hashedPassword', hashedPassword);
    const newUser = new User({
      email,
      password: hashedPassword,
      cart: { items: [] }
    });
    await newUser.save();
    res.redirect('/login');
  } catch (e) {
    console.log(e);
  }
}

export const postLogout: ExpressCB = async (req, res) => {
  req.session.destroy((err) => {
    console.log('error', err);
    res.redirect('/');
  });
};
