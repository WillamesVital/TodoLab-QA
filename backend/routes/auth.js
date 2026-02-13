const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../db');
const { JWT_SECRET } = require('../config');

const router = express.Router();

function safeHandler(handler) {
  return function wrappedHandler(req, res, next) {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

router.post('/register', safeHandler(async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Nome é obrigatório' });
  }

  if (!email || typeof email !== 'string' || !isValidEmail(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = findUserByEmail(normalizedEmail);

  if (existingUser) {
    return res.status(409).json({ error: 'Email já cadastrado' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = createUser(name.trim(), normalizedEmail, passwordHash);

  return res.status(201).json(user);
}));

router.post('/login', safeHandler(async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = findUserByEmail(normalizedEmail);

  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  return res.status(200).json({ token });
}));

module.exports = router;
