const request = require('supertest');
const app = require('../../app');
const { resetDatabase } = require('../helpers/resetDatabase');

async function createUserAndReturnCredentials(overrides = {}) {
  const payload = {
    name: 'Login User',
    email: 'login@example.com',
    password: '123456',
    ...overrides,
  };

  const response = await request(app).post('/auth/register').send(payload);
  expect(response.status).toBe(201);

  return payload;
}

describe('Auth - /auth/login', () => {
  beforeEach(() => {
    resetDatabase();
  });

  it('deve autenticar com credenciais válidas', async () => {
    const { email, password } = await createUserAndReturnCredentials();

    const response = await request(app).post('/auth/login').send({ email, password });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(typeof response.body.token).toBe('string');
    expect(response.body.token.length).toBeGreaterThan(0);
  });

  it('deve validar ausência de email ou senha', async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'login@example.com',
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Email e senha são obrigatórios' });
  });

  it('deve falhar quando usuário não existe', async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'naoexiste@example.com',
      password: '123456',
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Credenciais inválidas' });
  });

  it('deve falhar com senha incorreta', async () => {
    const { email } = await createUserAndReturnCredentials();

    const response = await request(app).post('/auth/login').send({
      email,
      password: 'senha-errada',
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Credenciais inválidas' });
  });
});
