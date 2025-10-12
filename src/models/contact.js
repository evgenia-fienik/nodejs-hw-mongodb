import mongoose from 'mongoose';

import { typeList } from '../constants/contacts.js';

const { Schema, model } = mongoose;

const contactSchema = new Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String },
    photo: { type: String, require: false, default: null },
    isFavourite: { type: Boolean, default: false },
    contactType: {
      type: String,
      enum: typeList,
      default: 'personal',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

export const Contact = model('Contact', contactSchema);
