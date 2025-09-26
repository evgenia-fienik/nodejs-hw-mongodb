import { Contact } from '../models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = 'asc',
  filters,
}) => {
  const skip = (page - 1) * perPage;

  const query = {};
  if (filters.contactType) query.contactType = filters.contactType;
  if (typeof filters.isFavourite === 'boolean')
    query.isFavourite = filters.isFavourite;

  const contacts = await Contact.find(query)
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 });

  const totalItems = await Contact.countDocuments(query);
  const paginationData = calculatePaginationData(totalItems, page, perPage);
  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (id) => {
  const contact = await Contact.findById(id);
  return contact;
};

export const createContact = async (contactData) => {
  return Contact.create(contactData);
};

export const updateContact = async (id, contactData) => {
  const updatedContact = await Contact.findByIdAndUpdate(id, contactData, {
    new: true,
  });
  return updatedContact;
};

export const deleteContact = async (id) => {
  const deletedContact = await Contact.findByIdAndDelete(id);
  return deletedContact;
};
