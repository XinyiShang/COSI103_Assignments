'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const consultingSchema = Schema({
  mood: String,
  specialThings: String,
  createdAt: Date,
  response: String,
  userId: { type: ObjectId, ref: 'User' },
});

module.exports = mongoose.model('ConsultingXinyiShang', consultingSchema);
