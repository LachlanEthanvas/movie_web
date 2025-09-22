require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../models/User')

async function run(){
  await mongoose.connect(process.env.MONGO_URI)
  const exists = await User.findOne({email:'admin@local'})
  if(exists) { console.log('Admin exists'); process.exit() }
  const hash = await bcrypt.hash('admin123',10)
  await User.create({name:'Admin', email:'admin@local', password:hash, role:'admin'})
  console.log('Admin created as admin@local / admin123')
  process.exit()
}
run()
