require('dotenv').config();
const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const baseURL = process.env.BASE_URL;

// Funções utilitárias
function randomUsername(prefix = 'met') {
  return `${prefix}_${Math.random().toString(36).substring(2, 10)}`;
}
function validPassword() {
  return 'Senha' + Math.floor(Math.random() * 100000);
}
function randomDia() {
  return Math.floor(Math.random() * 27) + 1; // 1 a 28
}

describe('RU-3: Métricas de Treinos Planejados x Realizados', function () {
  it('1 | Definir meta anual válida de treinos', async function () {
    const user = { username: randomUsername('met1'), password: validPassword() };
    await request(baseURL).post('/api/users/register').send(user);
    const resLogin = await request(baseURL).post('/api/users/login').send(user);
    const token = resLogin.body.token;
    const meta = { meta: 100 };
    const res = await request(baseURL)
      .post('/api/metricas/meta')
      .set('Authorization', `Bearer ${token}`)
      .send(meta);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message');
  });//ainda falta asserção de que a meta é igual a 200

  it('2 | Definir meta anual com valor inválido', async function () {
    const user = { username: randomUsername('met2'), password: validPassword() };
    await request(baseURL).post('/api/users/register').send(user);
    const resLogin = await request(baseURL).post('/api/users/login').send(user);
    const token = resLogin.body.token;
    const meta = { meta: -10 };
    const res = await request(baseURL)
      .post('/api/metricas/meta')
      .set('Authorization', `Bearer ${token}`)
      .send(meta);
    expect(res.status).to.equal(400);
  });//aqui meu teste pegou um bug pois esperava que falhasse mas a aplicação permite cadastrar metas com valores negativos e zero.

  it('3 | Calcular total de treinos realizados no mês atual', async function () {
    const user = { username: randomUsername('met3'), password: validPassword() };
    await request(baseURL).post('/api/users/register').send(user);
    const resLogin = await request(baseURL).post('/api/users/login').send(user);
    const token = resLogin.body.token;
    await request(baseURL)
      .post('/api/metricas/meta')
      .set('Authorization', `Bearer ${token}`)
      .send({ meta: 200 });
    const treino = { dia: randomDia(), mes: 2, ano: 2026 };
    await request(baseURL)
      .post('/api/treinos/calendario')
      .set('Authorization', `Bearer ${token}`)
      .send(treino);
    const res = await request(baseURL)
      .get('/api/metricas')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('totalMes');
    expect(res.body.totalMes).to.equal(1);
  });

  it('4 | Calcular total de treinos realizados no ano', async function () {
    const user = { username: randomUsername('met4'), password: validPassword() };
    await request(baseURL).post('/api/users/register').send(user);
    const resLogin = await request(baseURL).post('/api/users/login').send(user);
    const token = resLogin.body.token;
    await request(baseURL)
      .post('/api/metricas/meta')
      .set('Authorization', `Bearer ${token}`)
      .send({ meta: 200 });
    const treino = { dia: randomDia(), mes: 2, ano: 2026 };
    await request(baseURL)
      .post('/api/treinos/calendario')
      .set('Authorization', `Bearer ${token}`)
      .send(treino);
    const res = await request(baseURL)
      .get('/api/metricas')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('totalAno');
    expect(res.body.totalAno).to.equal(1);
  });

  it('5 | Calcular percentual de treinos realizados em relação à meta anual', async function () {
    const user = { username: randomUsername('met5'), password: validPassword() };
    await request(baseURL).post('/api/users/register').send(user);
    const resLogin = await request(baseURL).post('/api/users/login').send(user);
    const token = resLogin.body.token;
    await request(baseURL)
      .post('/api/metricas/meta')
      .set('Authorization', `Bearer ${token}`)
      .send({ meta: 200 });
    const treino = { dia: randomDia(), mes: 2, ano: 2026 };
    await request(baseURL)
      .post('/api/treinos/calendario')
      .set('Authorization', `Bearer ${token}`)
      .send(treino);
    const res = await request(baseURL)
      .get('/api/metricas')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('porcentagem');
    expect(res.body.porcentagem).to.equal(Math.floor((1/100)*100));
  });

  it('6 | Atualizar métricas ao marcar treino', async function () {
    const user = { username: randomUsername('met6'), password: validPassword() };
    await request(baseURL).post('/api/users/register').send(user);
    const resLogin = await request(baseURL).post('/api/users/login').send(user);
    const token = resLogin.body.token;
    await request(baseURL)
      .post('/api/metricas/meta')
      .set('Authorization', `Bearer ${token}`)
      .send({ meta: 100 });
    const treino1 = { dia: randomDia(), mes: 2, ano: 2026 };
    const treino2 = { dia: treino1.dia === 28 ? 27 : treino1.dia + 1, mes: 2, ano: 2026 };
    await request(baseURL)
      .post('/api/treinos/calendario')
      .set('Authorization', `Bearer ${token}`)
      .send(treino1);
    await request(baseURL)
      .post('/api/treinos/calendario')
      .set('Authorization', `Bearer ${token}`)
      .send(treino2);
    const res = await request(baseURL)
      .get('/api/metricas')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body.totalMes).to.equal(2);
    expect(res.body.totalAno).to.equal(2);
    expect(res.body.porcentagem).to.equal(Math.floor((2/100)*100));
  });

  it('7 | Atualizar métricas ao desmarcar treino', async function () {
    const user = { username: randomUsername('met7'), password: validPassword() };
    await request(baseURL).post('/api/users/register').send(user);
    const resLogin = await request(baseURL).post('/api/users/login').send(user);
    const token = resLogin.body.token;
    await request(baseURL)
      .post('/api/metricas/meta')
      .set('Authorization', `Bearer ${token}`)
      .send({ meta: 200 });
    const treino1 = { dia: randomDia(), mes: 2, ano: 2026 };
    const treino2 = { dia: treino1.dia === 28 ? 27 : treino1.dia + 1, mes: 2, ano: 2026 };
    await request(baseURL)
      .post('/api/treinos/calendario')
      .set('Authorization', `Bearer ${token}`)
      .send(treino1);
    await request(baseURL)
      .post('/api/treinos/calendario')
      .set('Authorization', `Bearer ${token}`)
      .send(treino2);
    // Desmarcar treino2
    await request(baseURL)
      .delete('/api/treinos/calendario')
      .set('Authorization', `Bearer ${token}`)
      .send(treino2);
    const res = await request(baseURL)
      .get('/api/metricas')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body.totalMes).to.equal(1);
    expect(res.body.totalAno).to.equal(1);
    expect(res.body.porcentagem).to.equal(Math.floor((1/100)*100));
  });

  it('8 | Exibir métricas apenas para usuário autenticado', async function () {
    const res = await request(baseURL)
      .get('/api/metricas');
    expect(res.status).to.equal(401);
  });
});
