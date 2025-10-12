import express from 'express';

import {
  registerUserController,
  loginUserController,
  logoutUserController,
  refreshSessionController,
  requestPasswordResetController,
  resetPasswordController,
} from '../controllers/auth.js';

// import { authenticate } from '../middlewares/authenticate.js';

import { validateBody } from '../middlewares/validateBody.js';

import {
  registerSchema,
  loginSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
} from '../validation/auth.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), registerUserController);
router.post('/login', validateBody(loginSchema), loginUserController);
router.post('/logout', logoutUserController);
router.post('/refresh', refreshSessionController);
router.post(
  '/send-reset-email',
  validateBody(requestPasswordResetSchema),
  requestPasswordResetController,
);
router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  resetPasswordController,
);

export default router;
