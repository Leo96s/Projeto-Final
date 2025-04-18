const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false, unique: false },
  phone: { type: DataTypes.STRING, allowNull: true },                // Número de telefone
  birthDate: { type: DataTypes.DATEONLY, allowNull: true },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },         // Se a conta está ativa
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },  // Data de criação
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW } 
});

sequelize.sync();

module.exports = User;