const Joi = require("joi");

const createUserSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().pattern(/^\d{9}$/).required(),
  birthDate: Joi.date().required(),
  isActive: Joi.boolean(),       // Se a conta está ativa
  createdAt: Joi.date(),  // Data de criação
  updatedAt: Joi.date() 
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(2),
  email: Joi.string().email({ tlds: { allow: false } }),
  password: Joi.string().min(6),
  phone: Joi.string().pattern(/^\d{9}$/),
  birthDate: Joi.date(),
  isActive: Joi.string(),       // Se a conta está ativa
  createdAt: Joi.date(),  // Data de criação
  updatedAt: Joi.date() 
}).min(1); // pelo menos 1 campo é obrigatório

module.exports = {
  createUserSchema,
  updateUserSchema,
};
