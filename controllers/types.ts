import type { NextFunction, Request, Response } from 'express';
import type { IUser } from '../models/user';

interface IExpressRequestWithUserInstance extends Request {
  user: IUser;
}

type ExpressCB = (req: IExpressRequestWithUserInstance, res: Response, next: NextFunction) => void;

export { ExpressCB };
