import * as fs from 'node:fs';
import path from 'node:path';

import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import Handlebars from 'handlebars';

import { sendMail } from '../utils/sendMail.js';

import { User } from '../models/user.js';
import { Session } from '../models/session.js';

import { getEnvVar } from '../utils/getEnvVar.js';

import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/contacts.js';

const REQUEST_PASSWORD_RESET_TEMPLATE = fs.readFileSync(
  path.resolve('src/templates/send-reset-email.html'),
  { encoding: 'utf-8' },
);
console.log(REQUEST_PASSWORD_RESET_TEMPLATE);

export async function registerUser(payload) {
  const user = await User.findOne({ email: payload.email });

  if (user !== null) {
    throw new createHttpError.Conflict('Email in use');
  }

  payload.password = await bcrypt.hash(payload.password, 10);

  return User.create(payload);
}

export async function loginUser(email, password) {
  const user = await User.findOne({ email });

  if (user === null) {
    console.log('Email');
    throw new createHttpError.Unauthorized('Email or password is incorrect');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch !== true) {
    console.log('Password');
    throw new createHttpError.Unauthorized('Email or password is incorrect');
  }

  await Session.deleteOne({ userId: user._id });

  const newSession = await Session.create({
    userId: user._id,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES), // 15 min
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS), // 30 days
  });

  return newSession;
}

export async function logoutUser(sessionId) {
  await Session.deleteOne({ _id: sessionId });
}

export async function refreshSession(sessionId, refreshToken) {
  const session = await Session.findById(sessionId);

  if (session === null) {
    throw new createHttpError.Unauthorized('Session not found');
  }

  if (session.refreshToken !== refreshToken) {
    throw new createHttpError.Unauthorized('Refresh token is invalid');
  }

  if (session.refreshTokenValidUntil < new Date()) {
    throw new createHttpError.Unauthorized('Refresh token is expired');
  }

  await Session.deleteOne({ _id: session._id });

  const newSession = await Session.create({
    userId: session.userId,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES), // 15 min
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS), // 30 days
  });
  return newSession;
}

export async function requestPasswordReset(email) {
  const user = await User.findOne({ email });

  if (user === null) {
    throw createHttpError.NotFound('User not found!');
  }

  const token = jwt.sign({ sub: user._id }, getEnvVar('JWT_SECRET'), {
    expiresIn: '5m',
  });

  const template = Handlebars.compile(REQUEST_PASSWORD_RESET_TEMPLATE);

  const resetLink = `${getEnvVar('APP_DOMAIN')}/reset-pwd?token=${token}`;

  try {
    await sendMail({
      to: email,
      subject: 'Reset password instruction',
      html: template({
        resetPasswordLink: resetLink,
      }),
    });
  } catch (error) {
    throw createHttpError.InternalServerError(
      'Failed to send the email, please try again later.',
    );
  }
}

export async function resetPassword(token, password) {
  try {
    const decoded = jwt.verify(token, getEnvVar('JWT_SECRET'));

    const user = await User.findById(decoded.sub);
    if (!user) {
      throw createHttpError.NotFound('User not found!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(decoded.sub, {
      password: hashedPassword,
    });

    await Session.deleteOne({ userId: user._id });
  } catch (error) {
    if (
      error.name === 'TokenExpiredError' ||
      error.name === 'JsonWebTokenError'
    ) {
      throw createHttpError.Unauthorized('Token is expired or invalid.');
    }
    throw error;
  }
}
