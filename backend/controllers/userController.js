const User = require("../models/User.js");

// Criar utilizador
const createUser = async (req, res) => {
    const { name, email, password } = req.body;
  
    // Validação básica do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.pt$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Email inválido. Tem de conter '@' e terminar em '.pt'" });
    }
  
    try {
      // Verifica se o email já existe
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "Já existe um utilizador com este email" });
      }
  
      // Cria o utilizador
      const user = await User.create({ name, email, password });
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
  
    const fieldsToUpdate = {};
    for (const key in userData) {
      if (
        userData[key] !== undefined &&
        userData[key] !== null &&
        userData[key] !== ""
      ) {
        fieldsToUpdate[key] = userData[key];
      }
    }
  
    if (Object.keys(fieldsToUpdate).length === 0) {
      return res.status(400).json({ error: "Nenhum campo válido para atualizar" });
    }
  
    try {
      // Se o email for um dos campos a atualizar
      if (fieldsToUpdate.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.pt$/;
        if (!emailRegex.test(fieldsToUpdate.email)) {
          return res.status(400).json({ error: "Email inválido. Tem de conter '@' e terminar em '.pt'" });
        }
  
        // Verifica se já existe um utilizador com o mesmo email (exceto o próprio)
        const existingUser = await User.findOne({
          where: { email: fieldsToUpdate.email }
        });
  
        if (existingUser && existingUser.id != userId) {
          return res.status(400).json({ error: "Já existe um utilizador com este email" });
        }
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
