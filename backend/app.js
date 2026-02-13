const express = require('express');
const cors = require('cors');
const healthRouter = require('./routes/health');
const authRouter = require('./routes/auth');
const todosRouter = require('./routes/todos');
const testRouter = require('./routes/testRoutes');
const { initializeDatabase } = require('./db');

initializeDatabase();

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && Object.prototype.hasOwnProperty.call(error, 'body')) {
    return res.status(400).json({ error: 'JSON inválido' });
  }

  return next(error);
});

app.use('/', healthRouter);
app.use('/auth', authRouter);
app.use('/todos', todosRouter);
app.use('/test', testRouter);

app.use((req, res) => {
  return res.status(404).json({ error: 'Rota não encontrada' });
});

app.use((error, req, res, next) => {
  console.error(error);
  return res.status(500).json({ error: 'Erro interno do servidor' });
});

module.exports = app;
