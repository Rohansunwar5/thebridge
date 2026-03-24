import JWT from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../../errors/bad-request.error';
import { UnauthorizedError } from '../../errors/unauthorized.error';
import { decode, encode, encryptionKey } from '../../services/crypto.service';
import config from '../../config';
import {
  creatorAccessTokenCache,
  brandAccessTokenCache,
} from '../../services/cache/entities';

interface IJWTVerifyPayload {
  _id: string;
  role: 'creator' | 'brand';
}

const getVerifyTokenMiddleware = (expectedRole: 'creator' | 'brand') => async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new BadRequestError('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1];
    if (!token) throw new BadRequestError('Token is missing or invalid');

    const { _id, role } = JWT.verify(token, config.JWT_ACCESS_SECRET) as IJWTVerifyPayload;

    if (role !== expectedRole) {
      throw new UnauthorizedError('Access denied');
    }

    const cache = expectedRole === 'creator' ? creatorAccessTokenCache : brandAccessTokenCache;
    const key = await encryptionKey(config.JWT_CACHE_ENCRYPTION_KEY);
    const cachedJWT = await cache.get({ userId: _id });

    if (!cachedJWT) {
      const encryptedData = await encode(token, key);
      await cache.set({ userId: _id }, encryptedData);
    } else {
      const decodedJWT = await decode(cachedJWT, key);
      if (decodedJWT !== token) {
        throw new UnauthorizedError('Session Expired!');
      }
    }

    req.user = { _id, role };
    next();
  } catch (error) {
    next();
  }
};

export default getVerifyTokenMiddleware;
