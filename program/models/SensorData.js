const { Sequelize, DataTypes } = require('sequelize');

const SensorData = Sequelize.define('User', {
    // Define attributes
    site_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default : 1
    },
    soil_humdity: {
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
  });
  module.exports = User;
  