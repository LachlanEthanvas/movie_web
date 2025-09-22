const multer = require('multer')
const path = require('path')

// storage config
const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'uploads/')
  },
  filename: function(req, file, cb){
    const unique = Date.now() + '-' + Math.round(Math.random()*1E9)
    cb(null, unique + path.extname(file.originalname))
  }
})

// filter only images
function fileFilter(req, file, cb){
  if(file.mimetype.startsWith('image/')){
    cb(null, true)
  } else {
    cb(new Error('Only image files allowed!'), false)
  }
}

const upload = multer({ storage, fileFilter, limits:{ fileSize:5*1024*1024 } }) // 5MB limit
module.exports = upload
