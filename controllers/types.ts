import type { NextFunction, Response } from 'express';
import type { Request} from 'express-serve-static-core';
import type { SessionData, Session } from 'express-session';
import type { IUser } from '../models/user';

interface IExpressRequestWithUserInstance extends Request {
  user: IUser;
  session: Session & Partial<SessionData>;
  body: any;
  query: any;
  file: any;
  params: any;
  protocol: any;
  get: any;
  csrfToken: any;
  flash: any;
}

type ExpressCB = (req: IExpressRequestWithUserInstance, res: Response, next: NextFunction) => void;

export { ExpressCB };
