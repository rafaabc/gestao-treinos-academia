import 'dotenv/config';
import request from 'supertest';
import { expect } from 'chai';
const baseURL = process.env.BASE_URL;

import { randomUsername, validPassword, randomDay } from '../testUtils.js';

describe('UR-3: Metrics for Planned vs. Actual Workouts', function () {
  it('1 | Set a valid annual workout goal.', async function () {
    const user = { username: randomUsername('met1'), password: validPassword() };
    await request(baseURL).post('/api/users/register').send(user);
    const resLogin = await request(baseURL).post('/api/users/login').send(user);
    const token = resLogin.body.token;
    const goal = { goal: 100 };
    const res = await request(baseURL)
      .post('/api/metrics/goal')
      .set('Authorization', `Bearer ${token}`)
      .send(goal);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message');
  });

  it('2 | Set an invalid annual goal', async function () {
    const user = { username: randomUsername('met2'), password: validPassword() };
    await request(baseURL).post('/api/users/register').send(user);
    const resLogin = await request(baseURL).post('/api/users/login').send(user);
    const token = resLogin.body.token;
    const goal = { goal: -10 };
    const res = await request(baseURL)
      .post('/api/metrics/goal')
      .set('Authorization', `Bearer ${token}`)
      .send(goal);
    expect(res.status).to.equal(400);
  });

  it('3 | Calculate the total number of workouts completed in the current month', async function () {
    const user = { username: randomUsername('met3'), password: validPassword() };
    await request(baseURL).post('/api/users/register').send(user);
    const resLogin = await request(baseURL).post('/api/users/login').send(user);
    const token = resLogin.body.token;
    await request(baseURL)
      .post('/api/metrics/goal')
      .set('Authorization', `Bearer ${token}`)
      .send({ goal: 200 });
    const workout = { day: randomDay(), month: 2, year: 2026 };
    await request(baseURL)
      .post('/api/workouts/calendar')
      .set('Authorization', `Bearer ${token}`)
      .send(workout);
    const res = await request(baseURL)
      .get('/api/metrics')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('totalMonth');
    expect(res.body.totalMonth).to.equal(1);
    
  });

  it('4 | Calculate total workouts completed in the year', async function () {
    const user = { username: randomUsername('met4'), password: validPassword() };
    await request(baseURL).post('/api/users/register').send(user);
    const resLogin = await request(baseURL).post('/api/users/login').send(user);
    const token = resLogin.body.token;
    await request(baseURL)
      .post('/api/metrics/goal')
      .set('Authorization', `Bearer ${token}`)
      .send({ goal: 200 });
    const workout = { day: randomDay(), month: 2, year: 2026 };
    await request(baseURL)
      .post('/api/workouts/calendar')
      .set('Authorization', `Bearer ${token}`)
      .send(workout);
    const res = await request(baseURL)
      .get('/api/metrics')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('totalYear');
    expect(res.body.totalYear).to.equal(1);
  });

  it('5 | Calculate the percentage of workouts completed in relation to the annual goal', async function () {
    const user = { username: randomUsername('met5'), password: validPassword() };
    await request(baseURL).post('/api/users/register').send(user);
    const resLogin = await request(baseURL).post('/api/users/login').send(user);
    const token = resLogin.body.token;
    await request(baseURL)
      .post('/api/metrics/goal')
      .set('Authorization', `Bearer ${token}`)
      .send({ goal: 200 });
    const workout = { day: randomDay(), month: 2, year: 2026 };
    await request(baseURL)
      .post('/api/workouts/calendar')
      .set('Authorization', `Bearer ${token}`)
      .send(workout);
    const res = await request(baseURL)
      .get('/api/metrics')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('percentage');
    expect(res.body.percentage).to.equal(Math.floor((1/100)*100));
  });

  it('6 | Update metrics when setting a workout', async function () {
    const user = { username: randomUsername('met6'), password: validPassword() };
    await request(baseURL).post('/api/users/register').send(user);
    const resLogin = await request(baseURL).post('/api/users/login').send(user);
    const token = resLogin.body.token;
    await request(baseURL)
      .post('/api/metrics/goal')
      .set('Authorization', `Bearer ${token}`)
      .send({ goal: 100 });
    const workout1 = { day: randomDay(), month: 2, year: 2026 };
    const workout2 = { day: workout1.day === 28 ? 27 : workout1.day + 1, month: 2, year: 2026 };
    await request(baseURL)
      .post('/api/workouts/calendar')
      .set('Authorization', `Bearer ${token}`)
      .send(workout1);
    await request(baseURL)
      .post('/api/workouts/calendar')
      .set('Authorization', `Bearer ${token}`)
      .send(workout2);
    const res = await request(baseURL)
      .get('/api/metrics')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body.totalMonth).to.equal(2);
    expect(res.body.totalYear).to.equal(2);
    expect(res.body.percentage).to.equal(Math.floor((2/100)*100));
  });

  it('7 | Update metrics when unsetting a workout', async function () {
    const user = { username: randomUsername('met7'), password: validPassword() };
    await request(baseURL).post('/api/users/register').send(user);
    const resLogin = await request(baseURL).post('/api/users/login').send(user);
    const token = resLogin.body.token;
    await request(baseURL)
      .post('/api/metrics/goal')
      .set('Authorization', `Bearer ${token}`)
      .send({ goal: 200 });
    const workout1 = { day: randomDay(), month: 2, year: 2026 };
    const workout2 = { day: workout1.day === 28 ? 27 : workout1.day + 1, month: 2, year: 2026 };
    await request(baseURL)
      .post('/api/workouts/calendar')
      .set('Authorization', `Bearer ${token}`)
      .send(workout1);
    await request(baseURL)
      .post('/api/workouts/calendar')
      .set('Authorization', `Bearer ${token}`)
      .send(workout2);
    await request(baseURL)
      .delete('/api/workouts/calendar')
      .set('Authorization', `Bearer ${token}`)
      .send(workout2);
    const res = await request(baseURL)
      .get('/api/metrics')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body.totalMonth).to.equal(1);
    expect(res.body.totalYear).to.equal(1);
    expect(res.body.percentage).to.equal(Math.floor((1/100)*100));
  });

  it('8 | Display metrics only for authenticated users', async function () {
    const res = await request(baseURL)
      .get('/api/metrics');
    expect(res.status).to.equal(401);
  });
});
