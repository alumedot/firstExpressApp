import { NextFunction, Request, Response } from 'express';

type ExpressCB = (req: Request, res: Response, next: NextFunction) => void;

export { ExpressCB };
