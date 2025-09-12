import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { getAllContacts, getContactById } from './services/contacts.js';

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(pino());
  app.use(express.json());

  app.get('/contacts', async (req, res) => {
    try {
      const contacts = await getAllContacts();
      res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  app.get('/contacts/:contactId', async (req, res) => {
    try {
      const contact = await getContactById(req.params.contactId);
      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
      }
      res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${req.params.contactId}!`,
        data: contact,
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  //обробка неіснуючіх роутів
  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  //
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
