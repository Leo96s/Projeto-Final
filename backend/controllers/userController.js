const User = require("../models/User.js");

const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

// Criar utilizador
const createUser = async (req, res) => {
  const { name, email, password, phone, birthDate } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Já existe um utilizador com este email" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

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
    if (fieldsToUpdate.email) {
      const existingUser = await User.findOne({
        where: { email: fieldsToUpdate.email }
      });

      if (existingUser && existingUser.id != userId) {
        return res.status(400).json({ error: "Já existe um utilizador com este email" });
      }
    }

    if (fieldsToUpdate.password) {
      fieldsToUpdate.password = await bcrypt.hash(fieldsToUpdate.password, SALT_ROUNDS);
    }

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
