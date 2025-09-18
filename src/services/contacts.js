import { Contact } from '../models/contact.js';

export const getAllContacts = async () => {
  const contacts = await Contact.find();
  return contacts;
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
