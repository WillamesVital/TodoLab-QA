const request = require('supertest');
const app = require('../../app');
const { resetDatabase } = require('../helpers/resetDatabase');

async function createUserAndLogin(overrides = {}) {
  const payload = {
    name: 'Todo User',
    email: 'todo@example.com',
    password: '123456',
    ...overrides,
  };

  const registerResponse = await request(app).post('/auth/register').send(payload);
  expect(registerResponse.status).toBe(201);

  const loginResponse = await request(app).post('/auth/login').send({
    email: payload.email,
    password: payload.password,
  });

  expect(loginResponse.status).toBe(200);
  const { token } = loginResponse.body;
  return { token };
}

function authHeader(token) {
  return { Authorization: `Bearer ${token}` };
}

describe('Todos - /todos', () => {
  beforeEach(() => {
    resetDatabase();
  });

  it('deve exigir token para acessar /todos', async () => {
    const response = await request(app).get('/todos');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Token ausente ou inválido' });
  });

  it('deve listar vazio quando usuário não possui todos', async () => {
    const { token } = await createUserAndLogin();

    const response = await request(app)
      .get('/todos')
      .set(authHeader(token));

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('deve criar um novo todo válido', async () => {
    const { token } = await createUserAndLogin();

    const response = await request(app)
      .post('/todos')
      .set(authHeader(token))
      .send({ title: 'Meu primeiro todo' });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      userId: expect.any(Number),
      title: 'Meu primeiro todo',
      done: false,
      createdAt: expect.any(String),
    });
  });

  it('não deve criar todo com título curto', async () => {
    const { token } = await createUserAndLogin();

    const response = await request(app)
      .post('/todos')
      .set(authHeader(token))
      .send({ title: 'aa' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Title deve ter no mínimo 3 caracteres' });
  });

  it('deve atualizar título e done de um todo', async () => {
    const { token } = await createUserAndLogin();

    const createResponse = await request(app)
      .post('/todos')
      .set(authHeader(token))
      .send({ title: 'Todo inicial' });

    const todoId = createResponse.body.id;

    const updateResponse = await request(app)
      .patch(`/todos/${todoId}`)
      .set(authHeader(token))
      .send({ title: 'Todo atualizado', done: true });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toMatchObject({
      id: todoId,
      title: 'Todo atualizado',
      done: true,
    });
  });

  it('não deve permitir atualizar todo de outro usuário', async () => {
    const { token: tokenUser1 } = await createUserAndLogin({
      email: 'user1@example.com',
    });
    const { token: tokenUser2 } = await createUserAndLogin({
      email: 'user2@example.com',
    });

    const createResponse = await request(app)
      .post('/todos')
      .set(authHeader(tokenUser1))
      .send({ title: 'Todo do user1' });

    const todoId = createResponse.body.id;

    const response = await request(app)
      .patch(`/todos/${todoId}`)
      .set(authHeader(tokenUser2))
      .send({ title: 'Hackeando', done: true });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: 'Acesso negado' });
  });

  it('deve deletar um todo existente', async () => {
    const { token } = await createUserAndLogin();

    const createResponse = await request(app)
      .post('/todos')
      .set(authHeader(token))
      .send({ title: 'Todo para deletar' });

    const todoId = createResponse.body.id;

    const deleteResponse = await request(app)
      .delete(`/todos/${todoId}`)
      .set(authHeader(token));

    expect(deleteResponse.status).toBe(204);

    const listResponse = await request(app)
      .get('/todos')
      .set(authHeader(token));

    expect(listResponse.status).toBe(200);
    expect(listResponse.body).toEqual([]);
  });
});
