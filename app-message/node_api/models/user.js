'use strict';
import 'dotenv/config';
import config from '../config/config.js'

import { Model,Sequelize, DataTypes } from 'sequelize';

const MUser = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(_models) {
      // define association here
      User.belongsToMany(User, {through:'Contact'});
      User.hasMany(Message,{
        foreignKey:'id_message',
        onDelete: 'CASCADE',
        
      }
      );
    }
  }
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};


let sequelize;
console.log(config)
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const User = new (MUser(sequelize,DataTypes))()

export default User;