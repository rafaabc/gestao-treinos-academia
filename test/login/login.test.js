require('dotenv').config();
const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const baseURL = process.env.BASE_URL;

// Função simples para gerar username aleatório
function randomUsername(prefix = 'user') {
  return `${prefix}_${Math.random().toString(36).substring(2, 10)}`;
}

// Função para senha válida
function validPassword() {
  return 'Senha' + Math.floor(Math.random() * 100000);
}

describe('RU-1: Login de Usuário', function () {
  let validUser;

  it('1 | Registrar novo usuário com dados válidos', async function () {
    validUser = { username: randomUsername('valido'), password: validPassword() };
    const res = await request(baseURL)
      .post('/api/users/register')
      .send(validUser);
    expect([200, 201]).to.include(res.status);
  });

  it('2 | Registrar usuário com username já existente', async function () {
    // Tenta registrar o mesmo usuário do teste anterior
    const res = await request(baseURL)
      .post('/api/users/register')
      .send(validUser);
    expect(res.status).to.equal(400);
  });

  it('3 | Registrar usuário com password fora do padrão', async function () {
    const user = { username: randomUsername('invalido'), password: 'short' };
    const res = await request(baseURL)
      .post('/api/users/register')
      .send(user);
    expect(res.status).to.equal(400);
  });

  it('4 | Login com credenciais válidas', async function () {
    const res = await request(baseURL)
      .post('/api/users/login')
      .send(validUser);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token');
  });

  it('5 | Login com username inexistente', async function () {
    const user = { username: randomUsername('naoexiste'), password: validPassword() };
    const res = await request(baseURL)
      .post('/api/users/login')
      .send(user);
    expect(res.status).to.equal(401);
  });

  it('6 | Login com password incorreto', async function () {
    // Usa o mesmo username válido, mas senha errada
    const user = { username: validUser.username, password: 'SenhaErrada123' };
    const res = await request(baseURL)
      .post('/api/users/login')
      .send(user);
    expect(res.status).to.equal(401);
  });
});
