import type { ExpressCB } from '../controllers/types';

export const isAuth: ExpressCB = (req, res, next) => {
  if (!(req.session as any).isLoggedIn) {
    return res.redirect('/login');
  }

  next();
}
