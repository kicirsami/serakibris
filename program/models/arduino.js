var SerialPort = require("serialport").SerialPort
const { ReadlineParser } = require('@serialport/parser-readline')
const { Sequelize, DataTypes } = require('sequelize');
const { log } = require("sf");
const sequelize = new Sequelize('sera', 'root', '123456', {
  host: 'localhost',
  dialect: 'mysql',
});
let tempTime = new Date().getTime();
sequelize.authenticate().then((db) => {
  console.log('Connection successful',db);
  const SensorData = sequelize.define('sensor_data', {
    // Define attributes
    site_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default : 1
    },
    soil_humidity: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    temperature: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    humidity: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      fan: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      water_motor: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      light: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      water_level: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      magnet:{
        type: DataTypes.BOOLEAN,
        allowNull: false
      }
  });

  
 var serialPort = new SerialPort({
  path:'COM5',
  baudRate:9600,
  parser: new ReadlineParser("\n"),
  autoOpen: true,
  }).setEncoding('utf8');
  
  serialPort.on('data', function(data) {
   var chunks = (data.split(','));
    let nowTime = new Date().getTime();
   let diff = Math.abs(tempTime - nowTime);
 
   if(chunks.length === 8 && diff > 1000){
  
     SensorData.create({
         site_id: 1,
         soil_humidity: chunks[2],
         temperature:chunks[0],
        humidity:chunks[1],
        fan:chunks[6],
         water_motor:chunks[5],
         light:chunks[4],
         water_level:chunks[3],
         magnet:chunks[7]
      });
       tempTime = new Date().getTime();
     }else{
  
     }
    });

}) 
.catch((err) => {
  console.log('Unable to connect to database', err);
}); 