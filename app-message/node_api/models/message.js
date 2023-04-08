'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Message.belongsTo(User);
    }
  }
  Message.init({
    body: DataTypes.STRING,
    request_to: DataTypes.STRING,
    send_to: DataTypes.STRING,
    from: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Message',
    timestamps:true,
  });
  return Message;
};