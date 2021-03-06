require('dotenv').config();
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

//cloudinaryStorage config. please see its API via https://www.npmjs.com/package/multer-storage-cloudinary
var storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'youknow',
  allowedFormats: ['jpg', 'png'],
  filename: function (req, file, cb) {
    cb(null, Date.now());
  }
});

const uploadCloud = multer({ storage: storage });

module.exports = uploadCloud;