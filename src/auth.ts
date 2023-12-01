import { Request, Response, NextFunction } from 'express';
import admin from './firebaseAdmin';

export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).send('No token provided, pekopekopeko!');
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(403).send('Invalid token');
  }
};
