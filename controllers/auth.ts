import { User } from '../models/user';
import type { ExpressCB } from './types';

export const getLogin: ExpressCB = async (req, res) => {
  try {
    res.render('auth/login', {
      pageTitle: 'Login',
      path: '/login',
      isLoggedIn: false
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

export const postLogin: ExpressCB = async (req, res) => {
  User.findById('622cf70ff9500387cdc8b38b')
    .then((user) => {
      (req.session as any).isLoggedIn = true;
      (req.session as any).user = user;
      req.session.save((err) => {
        err && console.log(err);
        res.redirect('/');
      });
    })
    .catch((error) => console.log(error))
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
    const newUser = new User({ email, password, cart: { items: [] } });
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
