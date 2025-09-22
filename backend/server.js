require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/v1/auth', require('./routes/auth'))
app.use('/api/v1/entries', require('./routes/entries'))
app.use('/uploads', express.static('uploads'))

// Routes will be added later
app.get('/', (req,res)=> res.send('API running'))

const PORT = process.env.PORT || 4000
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/favmedia')
  .then(()=> app.listen(PORT, ()=> console.log('Server:', PORT)))
  .catch(err => console.error(err))
