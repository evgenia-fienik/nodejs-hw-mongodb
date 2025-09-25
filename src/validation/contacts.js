import Joi from 'joi';

import { typeList } from '../constants/contacts.js';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'name must be a string',
    'string.empty': 'name is required',
    'string.min': 'name length must be at least 3 characters',
    'string.max': 'name length must be less than or equal to 20 characters',
    'any.required': `name is required`,
  }),
  phoneNumber: Joi.string().min(3).max(20).required().messages({
    'string.min': 'phoneNumber length must be at least 3 characters',
    'string.max':
      'phoneNumber length must be less than or equal to 20 characters',
    'any.required': 'phoneNumber is required',
  }),
  email: Joi.string().email().min(3).max(20).messages({
    'string.email': 'email must be a valid email',
    'string.min': 'email length must be at least 3 characters',
    'string.max': 'email length must be less than or equal to 20 characters',
  }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .valid(...typeList)
    .default('personal')
    .required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20),
  email: Joi.string().email().min(3).max(20),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .valid(...typeList)
    .default('personal'),
});
