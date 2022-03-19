import type { ExpressCB } from './types';

export const getLogin: ExpressCB = async (req, res) => {
  try {
    res.render('auth/login', {
      pageTitle: 'Login',
      path: '/login',
    });
  } catch (e) {
    console.log(e);
  }
};

export const postLogin: ExpressCB = async (req, res) => {
  res.cookie('loggedIn', true, { maxAge: 100000 });
  res.redirect('/');
};
