import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new createHttpError(401, 'Please provide access token');
  }
  const [bearer, accessToken] = authHeader.split(' ', 2);

  if (bearer !== 'Bearer' || typeof accessToken !== 'string') {
    throw new createHttpError(401, 'Please provide access token');
  }

  const session = await Session.findOne({ accessToken });

  if (session === null) {
    throw new createHttpError(401, 'Session not found');
  }

  if (session.accessTokenValidUntil < new Date()) {
    throw new createHttpError(401, 'Access token is expired');
  }
  const user = await User.findById(session.userId);

  if (user === null) {
    throw new createHttpError(401, 'User not found');
  }
  req.user = { id: user._id, name: user.name };

  next();
};
