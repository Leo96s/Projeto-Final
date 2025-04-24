const Joi = require("joi");

const validateUserId = (req, res, next) => {
  const { userId } = req.params;
  console.log('userId:', userId);
  // Validar se userId é um número inteiro e positivo
  const schema = Joi.number().integer().positive().required();
  
  const { error } = schema.validate(userId);
  
  if (error) {
    return res.status(400).json({ error: 'Bad Request: ID inválido' });
  }
  
  next(); // Se a validação passar, chama o próximo middleware (o controlador)
};

const validateEmail = (req, res, next) => {
  const { email } = req.params;  // O email está nos parâmetros da rota
  
  // Validar se email tem um formato válido
  const schema = Joi.string().email().required();  // Valida um email no formato correto
  
  const { error } = schema.validate(email);
  
  if (error) {
    return res.status(400).json({ error: 'Bad Request: Email inválido' });
  }
  
  next(); // Se a validação passar, chama o próximo middleware (o controlador)
};

module.exports = {
  validateUserId,
  validateEmail
};
