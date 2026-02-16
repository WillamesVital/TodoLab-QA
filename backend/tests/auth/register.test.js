const request = require('supertest');
const app = require('../../app');
const { resetDatabase } = require('../helpers/resetDatabase');

describe('Auth - /auth/register', () => {
  beforeEach(() => {
    resetDatabase();
  });

  it('deve cadastrar usuário com dados válidos', async () => {
    const response = await request(app).post('/auth/register').send({
      name: 'Usuário Teste',
      email: 'teste@example.com',
      password: '123456',
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      name: 'Usuário Teste',
      email: 'teste@example.com',
    });
  });

  it('deve validar nome obrigatório', async () => {
    const response = await request(app).post('/auth/register').send({
      email: 'teste@example.com',
      password: '123456',
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Nome é obrigatório' });
  });

  it('deve validar email inválido', async () => {
    const response = await request(app).post('/auth/register').send({
      name: 'Usuário Teste',
      email: 'email-invalido',
      password: '123456',
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Email inválido' });
  });

  it('deve validar senha curta', async () => {
    const response = await request(app).post('/auth/register').send({
      name: 'Usuário Teste',
      email: 'teste@example.com',
      password: '123',
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Senha deve ter no mínimo 6 caracteres' });
  });

  it('não deve permitir email duplicado', async () => {
    const payload = {
      name: 'Usuário Teste',
      email: 'duplicado@example.com',
      password: '123456',
    };

    const first = await request(app).post('/auth/register').send(payload);
    expect(first.status).toBe(201);

    const second = await request(app).post('/auth/register').send(payload);
    expect(second.status).toBe(409);
    expect(second.body).toEqual({ error: 'Email já cadastrado' });
  });
});
