const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.post('/register', async (req,res)=>{
  const {name,email,password} = req.body
  if(!email||!password) return res.status(400).json({msg:'email/password required'})
  const exists = await User.findOne({email})
  if(exists) return res.status(400).json({msg:'User exists'})
  const hash = await bcrypt.hash(password,10)
  const user = await User.create({name,email,password:hash})
  res.status(201).json({id:user._id, email: user.email, name:user.name})
})

router.post('/login', async (req,res)=>{
  const {email,password} = req.body
  const user = await User.findOne({email})
  if(!user) return res.status(400).json({msg:'Invalid credentials'})
  const ok = await bcrypt.compare(password,user.password)
  if(!ok) return res.status(400).json({msg:'Invalid credentials'})
  const token = jwt.sign({id:user._id, role:user.role}, process.env.JWT_SECRET, {expiresIn:'7d'})
  res.json({token, user:{id:user._id, name:user.name, role:user.role}})
})

module.exports = router
