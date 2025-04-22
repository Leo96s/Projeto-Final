const request = require('supertest');
const app = require('../app'); // ou onde defines o teu express()

describe('User API', () => {
  it('deve retornar erro ao tentar criar utilizador com email inválido', async () => {
    const res = await request(app)
      .post('/api/u/register-user')
      .send({
        name: "Teste",
        email: "invalid-email",
        password: "123456",
        phone: "912345678",
        birthDate: "1990-01-01"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toContain("\"email\" must be a valid email");

  });
});
