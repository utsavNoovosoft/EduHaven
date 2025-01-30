import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  FullName: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
    unique: true,
  },
  Password: {
    type: String,
    required: true,
  },
  UserProfile: {
    type: String,
    required: true,
    default: 'https://cdn-icons-png.flaticon.com/512/219/219986.png',
  },
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note',
    },
  ],
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
    },
  ],
});

const User = mongoose.model('User', UserSchema);
export default User;
