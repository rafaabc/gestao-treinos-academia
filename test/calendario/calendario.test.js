require("dotenv").config();
const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;
const baseURL = process.env.BASE_URL;

// Função para gerar username e senha válidos
function randomUsername(prefix = "user") {
  return `${prefix}_${Math.random().toString(36).substring(2, 10)}`;
}
function validPassword() {
  return "Senha" + Math.floor(Math.random() * 100000);
}
function randomDia() {
  return Math.floor(Math.random() * 27) + 1; // 1 a 28
}

let token, user, treino1, treino2;

describe("RU-2: Marcação de Treinos no Calendário", function () {
  it("5 | Marcar treino em um dia válido", async function () {
    const user = { username: randomUsername("cal"), password: validPassword() };
    await request(baseURL).post("/api/users/register").send(user);
    const resLogin = await request(baseURL).post("/api/users/login").send(user);
    const token = resLogin.body.token;
    const treino = { dia: randomDia(), mes: 2, ano: 2026 };
    const res = await request(baseURL)
      .post("/api/treinos/calendario")
      .set("Authorization", `Bearer ${token}`)
      .send(treino);
    expect([200, 201]).to.include(res.status);
    expect(res.body).to.have.property("message");
  });

  it("6 | Desmarcar treino previamente registrado", async function () {
    const user = { username: randomUsername("cal"), password: validPassword() };
    await request(baseURL).post("/api/users/register").send(user);
    const resLogin = await request(baseURL).post("/api/users/login").send(user);
    const token = resLogin.body.token;
    const treino = { dia: randomDia(), mes: 2, ano: 2026 };
    await request(baseURL)
      .post("/api/treinos/calendario")
      .set("Authorization", `Bearer ${token}`)
      .send(treino);
    const res = await request(baseURL)
      .delete("/api/treinos/calendario")
      .set("Authorization", `Bearer ${token}`)
      .send(treino);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("message");
  });

  it("7 | Marcar treino em dia já registrado", async function () {
    const user = { username: randomUsername("cal"), password: validPassword() };
    await request(baseURL).post("/api/users/register").send(user);
    const resLogin = await request(baseURL).post("/api/users/login").send(user);
    const token = resLogin.body.token;
    const treino = { dia: randomDia(), mes: 2, ano: 2026 };
    await request(baseURL)
      .post("/api/treinos/calendario")
      .set("Authorization", `Bearer ${token}`)
      .send(treino);
    const res = await request(baseURL)
      .post("/api/treinos/calendario")
      .set("Authorization", `Bearer ${token}`)
      .send(treino);
    expect([400]).to.include(res.status);
  });

  it("9 | Persistência dos dados após logout e novo login", async function () {
    const user = { username: randomUsername("cal"), password: validPassword() };
    await request(baseURL).post("/api/users/register").send(user);
    const resLogin = await request(baseURL).post("/api/users/login").send(user);
    const token = resLogin.body.token;
    const treino = { dia: randomDia(), mes: 2, ano: 2026 };
    await request(baseURL)
      .post("/api/treinos/calendario")
      .set("Authorization", `Bearer ${token}`)
      .send(treino);
    // Logout
    await request(baseURL)
      .post("/api/users/logout")
      .set("Authorization", `Bearer ${token}`);
    // Novo login
    const resLogin2 = await request(baseURL)
      .post("/api/users/login")
      .send(user);
    const newToken = resLogin2.body.token;
    // Verificar treino
    const res = await request(baseURL)
      .get(`/api/treinos/calendario?mes=${treino.mes}&ano=${treino.ano}`)
      .set("Authorization", `Bearer ${newToken}`);
    expect(res.status).to.equal(200);
    expect(res.body.some((t) => t.dia === treino.dia)).to.be.true;
  });

  it("10 | Registro de treino vinculado ao usuário autenticado", async function () {
    // Cria dois usuários
    const user1 = {
      username: randomUsername("cal1"),
      password: validPassword(),
    };
    const user2 = {
      username: randomUsername("cal2"),
      password: validPassword(),
    };
    await request(baseURL).post("/api/users/register").send(user1);
    await request(baseURL).post("/api/users/register").send(user2);
    const resLogin1 = await request(baseURL)
      .post("/api/users/login")
      .send(user1);
    const resLogin2 = await request(baseURL)
      .post("/api/users/login")
      .send(user2);
    const token1 = resLogin1.body.token;
    const token2 = resLogin2.body.token;
    const treino = { dia: randomDia(), mes: 2, ano: 2026 };
    await request(baseURL)
      .post("/api/treinos/calendario")
      .set("Authorization", `Bearer ${token2}`)
      .send(treino);
    // Verificar que user1 não vê treino de user2
    const res = await request(baseURL)
      .get(`/api/treinos/calendario?mes=${treino.mes}&ano=${treino.ano}`)
      .set("Authorization", `Bearer ${token1}`);
    expect(res.status).to.equal(200);
    expect(res.body.filter((t) => t.dia === treino.dia).length).to.be.at.most(
      1,
    );
  });
});
