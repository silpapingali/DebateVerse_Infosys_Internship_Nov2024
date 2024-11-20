/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('debateverse');

// Create a new document in the collection.
db.getCollection('users').insertOne({
  _id: ObjectId('673c4f06392ea413eaf88a1f'),
  email: 'pg65734@gmail.com',
  password: '$2b$10$KaSnDkWwY/js6UGOcL4kwe24OoUhbh6y6pgy3nsr.csPnPUeFsQJS',
  role: 'admin',
  isVerified: true,
  __v: 0
});
