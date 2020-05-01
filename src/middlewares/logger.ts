import { NextFunction, Request, Response } from 'express';
import { logger } from './../utils';

export const MiddlewareLogs = (req: Request, res: Response, next: NextFunction) => {
  logger.info(req.originalUrl);
  logger.info(req.body);
  next();
};
