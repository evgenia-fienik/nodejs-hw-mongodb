import * as fs from 'node:fs/promises';
import path from 'node:path';

import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

// import { createContactSchema } from '../validation/contacts.js';

import createHttpError from 'http-errors';
import mongoose from 'mongoose';

const APP_DOMAIN = getEnvVar('APP_DOMAIN');

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filters = parseFilterParams(req.query);

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filters,
    userId: req.user.id, // додаємо userId iз токена
  });
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return next(createHttpError(404, 'Contact not found'));
  }

  const contact = await getContactById(contactId);

  if (!contact || contact.userId.toString() !== req.user.id.toString()) {
    return next(createHttpError(404, 'Contact not found'));
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${req.params.contactId}!`,
    data: contact,
  });
};

//POST/contacts
export const createContactController = async (req, res) => {
  let photo = null;

  if (getEnvVar('UPLOAD_CLOUDINARY') === 'true') {
    const response = await uploadToCloudinary(req.file.path);
    await fs.unlink(req.file.path);
    photo = response.secure_url;
  } else {
    await fs.rename(
      req.file.path,
      path.resolve('src/uploads/photos', req.file.filename),
    );
    photo = `${APP_DOMAIN}/photos/${req.file.filename}`;
  }

  const newContact = await createContact({
    ...req.body,
    photo: photo || null,
    userId: req.user.id,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

//PATCH
export const updateContactController = async (req, res, next) => {
  const { contactId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return next(createHttpError(404, 'Contact not found'));
  }

  let updateData = { ...req.body };

  if (getEnvVar('UPLOAD_CLOUDINARY') === 'true') {
    const response = await uploadToCloudinary(req.file.path);
    await fs.unlink(req.file.path);
    updateData.photo = response.secure_url;
  } else {
    await fs.rename(
      req.file.path,
      path.resolve('src/uploads/photos', req.file.filename),
    );
    updateData.photo = `${APP_DOMAIN}/photos/${req.file.filename}`;
  }

  const updatedContact = await updateContact(contactId, updateData);

  if (
    !updatedContact ||
    updatedContact.userId.toString() !== req.user.id.toString()
  ) {
    return next(createHttpError(404, 'Contact not found'));
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return next(createHttpError(404, 'Contact not found'));
  }

  const deletedContact = await deleteContact(contactId);

  if (
    !deletedContact ||
    deletedContact.userId.toString() !== req.user.id.toString()
  ) {
    return next(createHttpError(404, 'Contact not found'));
  }

  if (!deletedContact) {
    return next(createHttpError(404, 'Contact not found'));
  }

  res.status(204).send();
};
