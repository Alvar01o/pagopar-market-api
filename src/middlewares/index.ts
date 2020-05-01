import { NextFunction, Request, Response } from 'express';
import { logger } from './../utils';

export const token = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Request from: ${req.originalUrl}`);
  logger.info(`Request type: ${req.method}`);
  if (req.query.key !== '78942ef2c1c98bf10fca09c808d718fa3734703e') {
    res.status(401).send('You shall not pass!');
  } else {
    next();
  }
};
