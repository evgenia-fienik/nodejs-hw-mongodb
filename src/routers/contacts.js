import { Router } from 'express';

import {
  getContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';
// import {ctrlWraper} from '../utils/ctrlWrapper.js'

const router = Router();

// GET /contacts — отримати всі контакти
router.get('/', getContactsController);

// GET /contacts/:contactId — отримати контакт за id
router.get('/:contactId', getContactByIdController);

//севорити новий контакт
router.post('/', createContactController);

//оновити контакт (PATCH)
router.patch('/:contactId', updateContactController);

//видаляє контакт
router.delete('/:contactId', deleteContactController);

export default router;
