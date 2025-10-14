import {
  registerUser,
  loginUser,
  logoutUser,
  refreshSession,
  requestPasswordReset,
  resetPassword,
} from '../services/auth.js';

export async function registerUserController(req, res) {
  const user = await registerUser(req.body);

  res.status(200).json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: user,
  });
}

// export async function loginUserController(req, res, next) {
//   try {
//     console.log('➡️ Login request received:', req.body);

//     const session = await loginUser(req.body.email, req.body.password);

//     console.log('✅ Session created:', session);

//     res.cookie('sessionId', session._id, {
//       httpOnly: true,
//       expires: session.refreshTokenValidUntil,
//     });

//     res.cookie('refreshToken', session.refreshToken, {
//       httpOnly: true,
//       expires: session.refreshTokenValidUntil,
//     });

//     return res.send({
//       status: 200,
//       message: 'Successfully logged in an user!',
//       data: {
//         accessToken: session.accessToken,
//       },
//     });
//   } catch (error) {
//     console.log('❌ Login error:', error);
//     next(error); // важливо!
//   }
// }

export async function loginUserController(req, res) {
  const session = await loginUser(req.body.email, req.body.password);

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.send({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
}

export async function logoutUserController(req, res) {
  const { sessionId } = req.cookies;

  if (typeof sessionId === 'string') {
    await logoutUser(sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).end();
}

export async function refreshSessionController(req, res) {
  const { sessionId, refreshToken } = req.cookies;

  if (!sessionId || !refreshToken) {
    return res.status(401).json({
      status: 401,
      message: 'No refresh token provided',
    });
  }

  const session = await refreshSession(sessionId, refreshToken);

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
}

export async function requestPasswordResetController(req, res) {
  await requestPasswordReset(req.body.email);
  res.status(200).json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
}

export async function resetPasswordController(req, res) {
  await resetPassword(req.body.token, req.body.password);
  res.json({ status: 200, message: 'Reset password successfully' });
}
