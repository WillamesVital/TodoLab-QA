const express = require('express');
const auth = require('../middleware/auth');
const {
  listTodosByUserId,
  findTodoById,
  createTodo,
  updateTodo,
  deleteTodoById,
} = require('../db');

const router = express.Router();

router.use(auth);

function parseTodoId(idParam) {
  const id = Number(idParam);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

router.get('/', (req, res) => {
  const todos = listTodosByUserId(req.user.id);
  return res.status(200).json(todos);
});

router.post('/', (req, res) => {
  const { title } = req.body || {};

  if (typeof title !== 'string' || title.trim().length < 3) {
    return res.status(400).json({ error: 'Title deve ter no mínimo 3 caracteres' });
  }

  const todo = createTodo(req.user.id, title.trim());
  return res.status(201).json(todo);
});

router.patch('/:id', (req, res) => {
  const id = parseTodoId(req.params.id);

  if (!id) {
    return res.status(404).json({ error: 'Todo não encontrado' });
  }

  const todo = findTodoById(id);

  if (!todo) {
    return res.status(404).json({ error: 'Todo não encontrado' });
  }

  if (todo.userId !== req.user.id) {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  const updates = {};

  if (Object.prototype.hasOwnProperty.call(req.body || {}, 'title')) {
    if (typeof req.body.title !== 'string' || req.body.title.trim().length < 3) {
      return res.status(400).json({ error: 'Title deve ter no mínimo 3 caracteres' });
    }

    updates.title = req.body.title.trim();
  }

  if (Object.prototype.hasOwnProperty.call(req.body || {}, 'done')) {
    if (typeof req.body.done !== 'boolean') {
      return res.status(400).json({ error: 'done deve ser boolean' });
    }

    updates.done = req.body.done;
  }

  if (!Object.keys(updates).length) {
    return res.status(400).json({ error: 'Nada para atualizar' });
  }

  const updatedTodo = updateTodo(id, updates);
  return res.status(200).json(updatedTodo);
});

router.delete('/:id', (req, res) => {
  const id = parseTodoId(req.params.id);

  if (!id) {
    return res.status(404).json({ error: 'Todo não encontrado' });
  }

  const todo = findTodoById(id);

  if (!todo) {
    return res.status(404).json({ error: 'Todo não encontrado' });
  }

  if (todo.userId !== req.user.id) {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  deleteTodoById(id);
  return res.status(204).send();
});

module.exports = router;
