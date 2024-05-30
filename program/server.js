const express = require('express');
// const registerRouter = require('./models/register');
// const SensorData = require('./models/arduino');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const cors = require('cors');
const app = express();
const port = 3000;

require("./models/arduino")

app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(cors());
app.use(express.static("uploads"));
app.use(require('./models/login.js'));
app.use(require('./models/register.js'));
app.use(require('./models/GreenHouse.js'));


app.listen(port, () => {
  console.log(`Server çalışıyor: http://localhost:${port}`);
});