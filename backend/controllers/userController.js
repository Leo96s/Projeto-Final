const User = require("../models/User.js");

const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

// Criar utilizador
const createUser = async (req, res) => {
    const { name, email, password, phone, birthDate } = req.body;
  
    // Validação básica do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Email inválido. Tem de conter '@' e terminar em por exemplo '.pt'" });
    }
  
    // Validação do número de telefone (9 dígitos, apenas números)
    const phoneRegex = /^\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: "Número de telefone inválido. Deve conter exatamente 9 dígitos e apenas números." });
    }
  
    try {
      // Verifica se o email já existe
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "Já existe um utilizador com este email" });
      }
  
      // Encripta a palavra-passe
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  
      // Cria o utilizador
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        phone,
        birthDate
      });
  
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

// Obter utilizador por ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "Utilizador não encontrado" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obter utilizador por email
const getUserByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.params.email } });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "Utilizador não encontrado" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obter todos os utilizadores
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Atualizar utilizador
const updateUser = async (req, res) => {
    const userId = req.params.userId;
    const userData = req.body;
  
    // Campos protegidos que não devem ser atualizados
    const protectedFields = ["isActive", "createdAt", "updatedAt"];
  
    const fieldsToUpdate = {};
    for (const key in userData) {
      if (
        userData[key] !== undefined &&
        userData[key] !== null &&
        userData[key] !== "" &&
        !protectedFields.includes(key)
      ) {
        fieldsToUpdate[key] = userData[key];
      }
    }
  
    if (Object.keys(fieldsToUpdate).length === 0) {
      return res.status(400).json({ error: "Nenhum campo válido para atualizar" });
    }
  
    try {
      // Validação e verificação de email
      if (fieldsToUpdate.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(fieldsToUpdate.email)) {
          return res.status(400).json({ error: "Email inválido. Tem de conter '@' e terminar em por exemplo '.pt'" });
        }
  
        const existingUser = await User.findOne({
          where: { email: fieldsToUpdate.email }
        });
  
        if (existingUser && existingUser.id != userId) {
          return res.status(400).json({ error: "Já existe um utilizador com este email" });
        }
      }
  
      // Validação do número de telefone (9 dígitos, apenas números)
      if (fieldsToUpdate.phone) {
        const phoneRegex = /^\d{9}$/;
        if (!phoneRegex.test(fieldsToUpdate.phone)) {
          return res.status(400).json({ error: "Número de telefone inválido. Deve conter exatamente 9 dígitos e apenas números." });
        }
      }
  
      // Encriptar palavra-passe se for atualizada
      if (fieldsToUpdate.password) {
        fieldsToUpdate.password = await bcrypt.hash(fieldsToUpdate.password, SALT_ROUNDS);
      }
  
      // Atualizar utilizador
      const [updated] = await User.update(fieldsToUpdate, {
        where: { id: userId },
        returning: true,
      });
  
      if (updated) {
        const updatedUser = await User.findByPk(userId);
        res.json(updatedUser);
      } else {
        res.status(404).json({ error: "Utilizador não encontrado" });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

// Eliminar utilizador
const deleteUser = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  if (isNaN(userId)) {
    return res.status(400).json({ error: "ID de utilizador inválido" });
  }

  try {
    const deleted = await User.destroy({ where: { id: userId } });

    if (deleted) {
      res.json({ message: "Utilizador eliminado com sucesso" });
    } else {
      res.status(404).json({ error: "Utilizador não encontrado" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  getAllUsers,
  updateUser,
  deleteUser,
};
