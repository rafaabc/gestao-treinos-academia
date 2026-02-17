import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL } from '../config.js';

export const options = {
  vus: 30,
  duration: '60s',  
  thresholds: {
    http_req_duration: ['p(95)<200'],
  },
};

export default function randomUsername() {
  const uniqueUsername = `user_${__VU}_${__ITER}_${Date.now()}`;
  const randomNum = Math.floor(Math.random() * 1e8);
  const randomStr = Math.random().toString(36).slice(2, 6);
  const password = `Senha${randomStr}${randomNum}`;
  const payload = JSON.stringify({
    username: uniqueUsername,
    password,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(`${BASE_URL}/api/users/register`, payload, params);

    check(res, {
      'status is 200 or 201': (r) => {
        const ok = r.status === 200 || r.status === 201;
        if (!ok) {
          console.log(`Failure: status=${r.status}, body=${r.body}`);
        }
        return ok;
      },
      'response time < 200ms': (r) => r.timings.duration < 200,
    });

  sleep(1);
}
