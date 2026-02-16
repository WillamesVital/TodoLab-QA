import { useEffect, useMemo, useState } from 'react';
import { ApiError, createTodo, deleteTodo, getTodos, login, register, updateTodo } from './api';

const TOKEN_KEY = 'todolab_token';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const isAuthenticated = useMemo(() => Boolean(token), [token]);

  function handleSessionExpired() {
    localStorage.removeItem(TOKEN_KEY);
    setToken('');
    setTodos([]);
    setError('Sessão expirada. Faça login novamente.');
  }

  async function loadTodos(authToken) {
    setLoading(true);
    setError('');

    try {
      const list = await getTodos(authToken);
      setTodos(list);
    } catch (apiError) {
      if (apiError instanceof ApiError && apiError.status === 401) {
        handleSessionExpired();
        return;
      }

      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      setTodos([]);
      return;
    }

    loadTodos(token);
  }, [isAuthenticated, token]);

  async function handleLogin(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login({ email, password });
      localStorage.setItem(TOKEN_KEY, response.token);
      setToken(response.token);
      setPassword('');
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({ name, email, password });

      const response = await login({ email, password });
      localStorage.setItem(TOKEN_KEY, response.token);
      setToken(response.token);
      setPassword('');
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddTodo(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const created = await createTodo(token, { title });
      setTodos((current) => [created, ...current]);
      setTitle('');
    } catch (apiError) {
      if (apiError instanceof ApiError && apiError.status === 401) {
        handleSessionExpired();
        return;
      }

      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleDone(todo) {
    setError('');
    setLoading(true);

    try {
      const updated = await updateTodo(token, todo.id, { done: !todo.done });
      setTodos((current) => current.map((item) => (item.id === todo.id ? updated : item)));
    } catch (apiError) {
      if (apiError instanceof ApiError && apiError.status === 401) {
        handleSessionExpired();
        return;
      }

      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteTodo(todoId) {
    setError('');
    setLoading(true);

    try {
      await deleteTodo(token, todoId);
      setTodos((current) => current.filter((item) => item.id !== todoId));
    } catch (apiError) {
      if (apiError instanceof ApiError && apiError.status === 401) {
        handleSessionExpired();
        return;
      }

      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken('');
    setTodos([]);
    setError('');
  }

  return (
    <main className="container">
      <h1>TodoLab QA</h1>

      {error ? (
        <p className="error" data-cy="error-message">
          {error}
        </p>
      ) : null}

      {!isAuthenticated ? (
        <section className="card" data-cy="auth-card">
          {!isRegistering ? (
            <form onSubmit={handleLogin} data-cy="login-form">
              <h2>Login</h2>
              <label>
                Email
                <input
                  data-cy="login-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={loading}
                  required
                />
              </label>

              <label>
                Senha
                <input
                  data-cy="login-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={loading}
                  required
                  minLength={6}
                />
              </label>

              <button data-cy="login-submit" type="submit" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </button>

              <p className="auth-switch">
                Não tem conta?
                <button
                  type="button"
                  className="link-button"
                  data-cy="go-to-register"
                  disabled={loading}
                  onClick={() => {
                    setError('');
                    setIsRegistering(true);
                    setPassword('');
                  }}
                >
                  Criar conta
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} data-cy="register-form">
              <h2>Criar conta</h2>

              <label>
                Nome
                <input
                  data-cy="register-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  disabled={loading}
                  required
                  minLength={2}
                />
              </label>

              <label>
                Email
                <input
                  data-cy="register-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={loading}
                  required
                />
              </label>

              <label>
                Senha
                <input
                  data-cy="register-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={loading}
                  required
                  minLength={6}
                />
              </label>

              <button data-cy="register-submit" type="submit" disabled={loading}>
                {loading ? 'Criando conta...' : 'Criar conta'}
              </button>

              <p className="auth-switch">
                Já tem conta?
                <button
                  type="button"
                  className="link-button"
                  data-cy="go-to-login"
                  disabled={loading}
                  onClick={() => {
                    setError('');
                    setIsRegistering(false);
                    setPassword('');
                  }}
                >
                  Entrar
                </button>
              </p>
            </form>
          )}
        </section>
      ) : (
        <section className="card" data-cy="todos-screen">
          <div className="header-row">
            <h2>Minhas tarefas</h2>
            <button data-cy="logout" type="button" onClick={handleLogout}>
              Sair
            </button>
          </div>

          <form onSubmit={handleAddTodo} className="todo-form">
            <input
              data-cy="todo-title"
              type="text"
              placeholder="Nova tarefa"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              disabled={loading}
              minLength={3}
              required
            />
            <button data-cy="todo-add" type="submit" disabled={loading}>
              Adicionar
            </button>
          </form>

          {loading ? <p data-cy="loading">Carregando...</p> : null}

          <ul className="todo-list" data-cy="todo-list">
            {todos.map((todo) => (
              <li key={todo.id} className="todo-item" data-cy="todo-item">
                <label>
                  <input
                    data-cy="todo-toggle"
                    type="checkbox"
                    checked={todo.done}
                    disabled={loading}
                    onChange={() => handleToggleDone(todo)}
                  />
                  <span className={todo.done ? 'done' : ''}>{todo.title}</span>
                </label>
                <button
                  data-cy="todo-delete"
                  type="button"
                  disabled={loading}
                  onClick={() => handleDeleteTodo(todo.id)}
                >
                  Excluir
                </button>
              </li>
            ))}
          </ul>

          {!loading && todos.length === 0 ? <p data-cy="empty-state">Nenhuma tarefa ainda.</p> : null}
        </section>
      )}
    </main>
  );
}

export default App;
