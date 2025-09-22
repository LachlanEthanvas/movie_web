const express = require('express'), router = express.Router()
const Entry = require('../models/Entry')
const auth = require('../middleware/auth')
const upload = require('../middleware/upload')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

// Create entry with images
router.post('/', auth, upload.array('images', 5), async (req,res)=>{
  try {
    const {title,type,description} = req.body
    let images = []

    if(req.files){
      for(let f of req.files){
        const thumbPath = 'uploads/thumb-' + f.filename
        await sharp(f.path).resize(300).toFile(thumbPath)
        images.push({
          url: '/' + f.path,
          thumbUrl: '/' + thumbPath,
          filename: f.filename
        })
      }
    }

    const entry = await Entry.create({
      title, type, description,
      images,
      createdBy: req.user.id
    })
    res.status(201).json(entry)
  } catch(err){
    console.error(err)
    res.status(500).json({msg:'Upload failed'})
  }
})

// Public listing with search, filter, pagination
router.get('/', async (req,res)=>{
  try {
    const { cursor, limit = 5, q, type } = req.query
    const query = { approved:true, deletedAt:null }

    // keyword search (title or description)
    if(q){
      query.$or = [
        { title: new RegExp(q, 'i') },
        { description: new RegExp(q, 'i') }
      ]
    }

    if(type && ['Movie','TV Show'].includes(type)){
      query.type = type
    }

    let mongoQuery = Entry.find(query).sort({ _id:-1 }).limit(Number(limit))
    if(cursor){
      mongoQuery = Entry.find({ ...query, _id:{ $lt: cursor } })
        .sort({ _id:-1 })
        .limit(Number(limit))
    }

    const items = await mongoQuery
    const nextCursor = items.length > 0 ? items[items.length-1]._id : null

    res.json({ items, nextCursor })
  } catch(err){
    console.error(err)
    res.status(500).json({msg:'Fetching entries failed'})
  }
})

// User's own entries
router.get('/my', auth, async (req,res)=>{
  const items = await Entry.find({createdBy: req.user.id, deletedAt: null}).sort({createdAt:-1})
  res.json(items)
})

// Admin: list pending
router.get('/pending', auth, async (req,res)=>{
  if(req.user.role!=='admin') return res.status(403).json({msg:'Admin only'})
  const items = await Entry.find({approved:false, deletedAt: null}).sort({createdAt:-1})
  res.json(items)
})

// Admin: approve
router.patch('/:id/approve', auth, async (req,res)=>{
  if(req.user.role!=='admin') return res.status(403).json({msg:'Admin only'})
  const e = await Entry.findByIdAndUpdate(req.params.id, {approved:true}, {new:true})
  res.json(e)
})

// Edit entry (owner or admin)
router.patch('/:id', auth, async (req,res)=>{
  try {
    const entry = await Entry.findById(req.params.id)
    if(!entry) return res.status(404).json({msg:'Not found'})

    // only owner or admin
    if(entry.createdBy.toString() !== req.user.id && req.user.role !== 'admin'){
      return res.status(403).json({msg:'Not allowed'})
    }

    const { title, type, description } = req.body
    if(title) entry.title = title
    if(type) entry.type = type
    if(description) entry.description = description

    await entry.save()
    res.json(entry)
  }catch(err){
    console.error(err)
    res.status(500).json({msg:'Error updating'})
  }
})

// Soft delete entry (owner or admin)
router.delete('/:id', auth, async (req,res)=>{
  try {
    const entry = await Entry.findById(req.params.id)
    if(!entry) return res.status(404).json({msg:'Not found'})

    if(entry.createdBy.toString() !== req.user.id && req.user.role !== 'admin'){
      return res.status(403).json({msg:'Not allowed'})
    }

    entry.deletedAt = new Date()
    await entry.save()
    res.json({msg:'Deleted'})
  }catch(err){
    console.error(err)
    res.status(500).json({msg:'Error deleting'})
  }
})

module.exports = router
