import { Router } from 'express';

import {
  getContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';
// import {ctrlWraper} from '../utils/ctrlWrapper.js'

import { authenticate } from '../middlewares/authenticate.js';

import { validateBody } from '../middlewares/validateBody.js';

import { isValidId } from '../middlewares/isValidId.js';

import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';

const router = Router();

router.use(authenticate);

router.get('/', getContactsController);

router.get('/:contactId', isValidId, getContactByIdController);

router.post('/', validateBody(createContactSchema), createContactController);

router.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  updateContactController,
);

router.delete('/:contactId', isValidId, deleteContactController);

export default router;
