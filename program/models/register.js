const express = require('express');
const app = express.Router();
const multer = require('multer');
const utils = require('../utils');
const db = require('../utils/db');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    let ext ='.png';
    switch (true) {
      case file.mimetype.includes('jpg') || file.mimetype.includes('jpeg'):
        ext = ".jpg"
        break;
    }

    cb(null, Date.now() + ext) //Appending extension
  }
})

var upload = multer({ storage: storage });
const bcrypt = require('bcrypt');
const { log } = require('sf');

console.log("register enpointi çalıştı");

app.post('/register', utils.authenticateToken, async (req, res) => {
  console.log("register endpointi başladı");
  const userData = req.body;
  const { username, password, fullname, phone, email, role_id, img } = userData;

  try {
    // Parolayı hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO users (username, password, fullname, phone, email, role_id, image_path, parent_user_id) VALUES (?, ?, ?, ?, ?, ?, ?,?)`;
    db.query(query, [username, hashedPassword, fullname, phone, email, role_id, img, req.user.id], (err, results) => {
      if (err) {
        console.error('Error inserting user: ', err);
        res.status(500).json({ error: 'Error registering user' });
        return;
      }
      console.log('User registered successfully');
      res.status(200).json({ message: 'User registered successfully' });
    });
  } catch (error) {
    console.error('Error hashing password: ', error);
    res.status(500).json({ error: 'Error hashing password' });
  }
});


// Resmi sunucuya kaydetme ve veritabanına kaydetme
app.post('/upload', upload.single('file'), (req, res) => {
  console.log(req.user);
  const image = req.file;
  const userId = req.body.userId;
  const imagePath = image.filename;

 return res.status(200).json({ message: 'Resim kaydedildi', imagePath });
});


module.exports = app;