'use strict';
const bcrypt = require('bcrypt-nodejs');
const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var job_bids = sequelize.define('job_bids', {
    jobID: DataTypes.INTEGER,
    coID: DataTypes.INTEGER,
    estCost: DataTypes.INTEGER,
    estTime: DataTypes.INTEGER,
    startDays: DataTypes.INTEGER,
    comment : DataTypes.TEXT,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return job_bids;
};