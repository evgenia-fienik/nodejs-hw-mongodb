import mongoose, { model } from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, unique: true },
    // createdAt: { type: String, required: true },
    // updatedAt: { type: String, required: true },
  },
  { timestamps: true, versionKey: null },
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = model('User', userSchema);
