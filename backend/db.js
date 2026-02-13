const path = require('path');
const Database = require('better-sqlite3');

const databasePath = path.join(__dirname, 'database.sqlite');
const db = new Database(databasePath);

db.pragma('foreign_keys = ON');

// Garante que as tabelas existam antes de preparar statements
initializeDatabase();

const userQueries = {
  findByEmail: db.prepare('SELECT id, name, email, password_hash FROM users WHERE email = ?'),
  create: db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)'),
};

const todoQueries = {
  listByUserId: db.prepare(
    'SELECT id, user_id, title, done, created_at FROM todos WHERE user_id = ? ORDER BY id DESC'
  ),
  findById: db.prepare('SELECT id, user_id, title, done, created_at FROM todos WHERE id = ?'),
  create: db.prepare('INSERT INTO todos (user_id, title, done) VALUES (?, ?, 0)'),
  updateTitle: db.prepare('UPDATE todos SET title = ? WHERE id = ?'),
  updateDone: db.prepare('UPDATE todos SET done = ? WHERE id = ?'),
  updateTitleAndDone: db.prepare('UPDATE todos SET title = ?, done = ? WHERE id = ?'),
  deleteById: db.prepare('DELETE FROM todos WHERE id = ?'),
};

function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      done INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
}

function run(query, params = []) {
  const statement = db.prepare(query);
  return statement.run(params);
}

function get(query, params = []) {
  const statement = db.prepare(query);
  return statement.get(params);
}

function all(query, params = []) {
  const statement = db.prepare(query);
  return statement.all(params);
}

function findUserByEmail(email) {
  return userQueries.findByEmail.get(email);
}

function createUser(name, email, passwordHash) {
  const result = userQueries.create.run(name, email, passwordHash);

  return {
    id: result.lastInsertRowid,
    name,
    email,
  };
}

function mapTodo(todo) {
  if (!todo) {
    return null;
  }

  return {
    id: todo.id,
    userId: todo.user_id,
    title: todo.title,
    done: Boolean(todo.done),
    createdAt: todo.created_at,
  };
}

function listTodosByUserId(userId) {
  return todoQueries.listByUserId.all(userId).map(mapTodo);
}

function findTodoById(id) {
  const todo = todoQueries.findById.get(id);
  return mapTodo(todo);
}

function createTodo(userId, title) {
  const result = todoQueries.create.run(userId, title);
  return findTodoById(result.lastInsertRowid);
}

function updateTodo(id, updates) {
  if (typeof updates.title === 'string' && typeof updates.done === 'boolean') {
    todoQueries.updateTitleAndDone.run(updates.title, Number(updates.done), id);
    return findTodoById(id);
  }

  if (typeof updates.title === 'string') {
    todoQueries.updateTitle.run(updates.title, id);
    return findTodoById(id);
  }

  if (typeof updates.done === 'boolean') {
    todoQueries.updateDone.run(Number(updates.done), id);
    return findTodoById(id);
  }

  return findTodoById(id);
}

function deleteTodoById(id) {
  const result = todoQueries.deleteById.run(id);
  return result.changes > 0;
}

function resetAllData() {
  db.exec(`
    PRAGMA foreign_keys = OFF;
    DELETE FROM todos;
    DELETE FROM users;
    DELETE FROM sqlite_sequence WHERE name IN ('todos', 'users');
    PRAGMA foreign_keys = ON;
  `);
}

module.exports = {
  db,
  initializeDatabase,
  run,
  get,
  all,
  findUserByEmail,
  createUser,
  listTodosByUserId,
  findTodoById,
  createTodo,
  updateTodo,
  deleteTodoById,
  resetAllData,
};
