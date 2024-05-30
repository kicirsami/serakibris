const express = require('express');
const app = express.Router();
const bcrypt = require('bcrypt');
const utils = require('../utils');
const db = require('../utils/db');
const multer = require('multer');

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

    cb(null, Date.now() + ext)
  }
});

var upload = multer({ storage: storage });

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const sql = `SELECT * FROM users WHERE username = ?`;

  db.query(sql, [username], async (err, result) => {
    if (err) {
      console.error('Sunucu hatası:', err);
      res.status(500).json({ message: 'Sunucu hatası' });
      return;
    }

    if (result.length > 0) {
      let hashCheck = await bcrypt.compare(password, result[0]["password"]);
      if (hashCheck) {
        let userData = {};
        for (let key in result[0]) {
          userData[key] = result[0][key];
        }

        const token = utils.generateToken(userData);

        res.json({ message: 'Giriş başarılı', token });
      } else {
        console.log('Kullanıcı adı veya şifre hatalı.');
        res.status(401).json({ message: 'Kullanıcı adı veya şifre hatalı' });
      }
    } else {
      console.log('Kullanıcı adı veya şifre hatalı.');
      res.status(401).json({ message: 'Kullanıcı adı veya şifre hatalı' });
    }
  });
  console.log('Giriş yapma işlemi denendi.');
});

app.get('/login', utils.authenticateToken, (req, res) => {
  res.json({ message: 'Token doğrulandı!' });
});

app.post('/logout', (req, res) => {
  console.log('Çıkış yapıldı.');
  res.json({ message: "Çıkış yapıldı." });
});

app.get('/getUserInfo', utils.authenticateToken, (req, res) => {
  const sql = `SELECT * FROM users WHERE username = ?`;
  db.query(sql, [req.user.username], (err, result) => {
    if (err) {
      console.error('Sunucu hatası:', err);
      res.status(500).json({ message: 'Sunucu hatası' });
      return;
    }

    if (result.length > 0) {
      let userInfo = result[0];
      userInfo['image_path'] = userInfo['image_path'] ? `http://localhost:3000/${userInfo['image_path']}` : null;
      res.json(userInfo);
    } else {
      res.status(404).json({ message: 'Kullanıcı adı bulunamadı' });
    }
  });
});

// Kullanıcı profilini alma
app.get('/user/:id', utils.authenticateToken, (req, res) => {
  const userId = req.params.id;
  const sql = `SELECT * FROM users WHERE id = ?`;
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('Sunucu hatası:', err);
      res.status(500).json({ message: 'Sunucu hatası' });
      return;
    }
    if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
  });
});

// Kullanıcı profilini güncelleme
app.put('/user/:id', utils.authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = req.params.id;
    const { fullname, phone, email, password, role_id } = req.body;
    const file = req.file;

    console.log('Gelen bilgiler:', req.body);
    console.log('Yüklenen dosya:', file);

    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    let sql = 'UPDATE users SET fullname = ?, phone = ?, email = ?, role_id = ?';
    const queryParams = [fullname, phone, email, role_id];

    if (password) {
      sql += ', password = ?';
      queryParams.push(hashedPassword);
    }

    if (file) {
      sql += ', image_path = ?';
      queryParams.push(file.filename);
    }

    sql += ' WHERE id = ?';
    queryParams.push(userId);

    console.log('SQL Sorgusu:', sql);
    db.query(sql, queryParams, (err, result) => {
      if (err) {
        console.error('Sunucu hatası:', err);
        return res.status(500).json({ message: 'Sunucu hatası' });
      }
      if (result.affectedRows === 1) {
        res.json({ message: 'Kullanıcı bilgileri başarıyla güncellendi', filePath: file ? file.path : null });
      } else {
        console.error('Kullanıcı bilgileri güncellenemedi:', result.message);
        res.status(500).json({ message: 'Kullanıcı bilgileri güncellenemedi' });
      }
    });
  } catch (error) {
    console.error('Bir hata oluştu:', error);
    res.status(500).json({ message: 'Bir hata oluştu' });
  }
});

app.get('/user/:id/team-members', utils.authenticateToken, (req, res) => {
  const userId = req.params.id;

  // İlk olarak kullanıcının rolünü ve parent_user_id'sini öğreniyoruz
  const getUserInfoSql = `SELECT role_id, parent_user_id FROM users WHERE id = ?`;
  db.query(getUserInfoSql, [userId], (err, userInfoResult) => {
    if (err) {
      console.error('Sunucu hatası:', err);
      res.status(500).json({ message: 'Sunucu hatası' });
      return;
    }

    if (userInfoResult.length === 0) {
      res.status(404).json({ message: 'Kullanıcı bulunamadı' });
      return;
    }

    const { role_id, parent_user_id } = userInfoResult[0];

    let sql;
    let queryParams;

    if (role_id === 1) { // Kullanıcı yönetici ise
      sql = `SELECT * FROM users WHERE parent_user_id = ?`;
      queryParams = [userId];
    } else { // Kullanıcı çalışan ise
      sql = `SELECT * FROM users WHERE parent_user_id = ? AND id != ?`;
      queryParams = [parent_user_id, userId];
    }

    db.query(sql, queryParams, (err, result) => {
      if (err) {
        console.error('Sunucu hatası:', err);
        res.status(500).json({ message: 'Sunucu hatası' });
        return;
      }
      res.json(result);
    });
  });
});

app.get('/user/:id/manager', utils.authenticateToken, (req, res) => {
  const userId = req.params.id;
  const sql = `SELECT u.fullname FROM users u INNER JOIN users u2 ON u.id = u2.parent_user_id WHERE u2.id = ?`;
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('Sunucu hatası:', err);
      res.status(500).json({ message: 'Sunucu hatası' });
      return;
    }
    if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(404).json({ message: 'Yönetici bulunamadı' });
    }
  });
});

module.exports = app;
