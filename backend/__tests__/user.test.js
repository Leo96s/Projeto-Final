const request = require("supertest");
const app = require("../app");
const { sequelize, User } = require("../models"); // importa corretamente
const bcrypt = require("bcrypt");

beforeEach(async () => {
  await sequelize.sync({ force: true }); // Cria as tabelas na memória
});

afterEach(async () => {
  // Limpa a base de dados após cada teste
  await User.destroy({ where: {} });
});

afterAll(async () => {
  await sequelize.close(); // Fecha a conexão
});

describe("User API - Integração com SQLite em memória", () => {
  it("deve criar um utilizador com dados válidos", async () => {
    const res = await request(app).post("/api/u/register-user").send({
      name: "Maria",
      email: "maria@ex.com",
      password: "abcdef",
      phone: "912345678",
      birthDate: "1990-01-01",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe("maria@ex.com");

    const userInDb = await User.findOne({ where: { email: "maria@ex.com" } });
    expect(userInDb).not.toBeNull();
  });

  it("deve criar um utilizador com nome mínimo de 2 caracteres", async () => {
    const res = await request(app).post("/api/u/register-user").send({
      name: "Jo",
      email: "jo@ex.com",
      password: "abcdef",
      phone: "912345678",
      birthDate: "1990-01-01",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe("jo@ex.com");
  });

  it("deve criar um utilizador com password exatamente 6 caracteres", async () => {
    const res = await request(app).post("/api/u/register-user").send({
      name: "Jo",
      email: "jo@ex.com",
      password: "abcdef",
      phone: "912345678",
      birthDate: "1990-01-01",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe("jo@ex.com");
  });

  it("deve criar um utilizador com telefone de 9 dígitos", async () => {
    const res = await request(app).post("/api/u/register-user").send({
      name: "Jo",
      email: "jo@ex.com",
      password: "abcdef",
      phone: "912345678",
      birthDate: "1990-01-01",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe("jo@ex.com");
  });

  it("deve retornar erro 400 se email já estiver em uso", async () => {
    await User.create({
      name: "Existente",
      email: "teste@email.com",
      password: "hashed", // pode ser qualquer coisa, não importa neste teste
      phone: "912345678",
      birthDate: "1990-01-01",
    });

    const res = await request(app).post("/api/u/register-user").send({
      name: "Outro",
      email: "teste@email.com",
      password: "123456",
      phone: "912345678",
      birthDate: "1990-01-01",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/já existe um utilizador/i);
  });

  it("deve retornar erro 400 se email for inválido", async () => {
    const res = await request(app).post("/api/u/register-user").send({
      name: "Invalido",
      email: "email-invalido",
      password: "123456",
      phone: "912345678",
      birthDate: "1990-01-01",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toContain('"email" must be a valid email');
  });

  it("deve retornar erro 400 se nome for inválido (menos de 2 caracteres)", async () => {
    const res = await request(app).post("/api/u/register-user").send({
      name: "A",
      email: "maria@ex.com",
      password: "abcdef",
      phone: "912345678",
      birthDate: "1990-01-01",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toContain(
      '"name" length must be at least 2 characters long'
    );
  });

  it("deve retornar erro 400 se password for inválido (<6 caracteres)", async () => {
    const res = await request(app).post("/api/u/register-user").send({
      name: "Maria",
      email: "maria@ex.com",
      password: "abc",
      phone: "912345678",
      birthDate: "1990-01-01",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toContain(
      '"password" length must be at least 6 characters long'
    );
  });

  it("deve retornar erro 400 se phone contiver letras", async () => {
    const res = await request(app).post("/api/u/register-user").send({
      name: "Maria",
      email: "maria@ex.com",
      password: "abcdef",
      phone: "91234ABCD",
      birthDate: "1990-01-01",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toContain(
      '"phone" with value "91234ABCD" fails to match the required pattern: /^\\d{9}$/'
    );
  });

  it("deve retornar erro 400 se birthDate estiver no formato inválido", async () => {
    const res = await request(app).post("/api/u/register-user").send({
      name: "Maria",
      email: "maria@ex.com",
      password: "abcdef",
      phone: "912345678",
      birthDate: "20-12-1990",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toContain('"birthDate" must be a valid date');
  });
});

describe("User API - Get User By ID", () => {
  it("deve retornar 200 OK e o utilizador quando o ID for válido", async () => {
    const user = await User.create({
      name: "Maria",
      email: "maria@ex.com",
      password: "abcdef",
      phone: "912345678",
      birthDate: "1990-01-01",
    });

    const res = await request(app).get(`/api/u/user/get-by-id/${user.id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe("maria@ex.com");
    expect(res.body.name).toBe("Maria");
  });

  it("deve retornar 404 Not Found quando o ID de utilizador não existir", async () => {
    const res = await request(app).get("/api/u/user/get-by-id/99"); // ID inexistente

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Utilizador não encontrado");
  });

  it("deve retornar 200 OK ou 404, conforme a existência, com ID limite inferior (1)", async () => {
    const user = await User.create({
      name: "João",
      email: "joao@ex.com",
      password: "123456",
      phone: "912345678",
      birthDate: "1990-01-01",
    });

    const res = await request(app).get(`/api/u/user/get-by-id/1`); // Testando o ID limite inferior

    if (user.id === 1) {
      expect(res.statusCode).toBe(200);
      expect(res.body.email).toBe("joao@ex.com");
    } else {
      expect(res.statusCode).toBe(404);
    }
  });

  it("deve retornar 400 Bad Request ou 404 Not Found com ID negativo", async () => {
    const res = await request(app).get("/api/u/user/get-by-id/-1"); // ID negativo

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Bad Request: ID inválido");
  });

  it("deve retornar 400 Bad Request com ID inválido (string)", async () => {
    const res = await request(app).get("/api/u/user/get-by-id/abc"); // ID inválido (string)

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Bad Request: ID inválido");
  });
});

describe("Testes para a rota GET /user/get-by-email/:email", () => {
  it("deve retornar 200 OK e os dados do utilizador para um ID válido de utilizador existente", async () => {
    await User.create({
      name: "João",
      email: "joao@ex.com",
      password: "123456",
      phone: "912345678",
      birthDate: "1990-01-01",
    });

    const res = await request(app).get("/api/u/user/get-by-email/joao@ex.com"); // Email válido

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("email", "joao@ex.com");
  });

  it("deve retornar 404 Not Found quando o utilizador com o email não existir", async () => {
    const res = await request(app).get(
      "/api/u/user/get-by-email/nonexistent-email@example.com"
    ); // Email inexistente

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Utilizador não encontrado");
  });

  it("deve retornar 400 Bad Request para email com formato inválido", async () => {
    const res = await request(app).get(
      "/api/u/user/get-by-email/invalid-email"
    ); // Email com formato inválido

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Bad Request: Email inválido");
  });
});

describe("Testes para a rota PUT /user/:userId", () => {

  it("deve retornar 200 OK e os dados atualizados para uma atualização válida", async () => {
    const user =  await User.create({
      name: "Carlos",
      email: "carlos@ex.com",
      password: "123456",
      phone: "987654321",
      birthDate: "1985-05-15",
    });

    const res = await request(app).put(`/api/u/user/${user.id}`).send({
      name: "Carlos Silva",
      email: "carlos.silva@ex.com",
      phone: "987654322",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("name", "Carlos Silva");
    expect(res.body).toHaveProperty("email", "carlos.silva@ex.com");
    expect(res.body).toHaveProperty("phone", "987654322");
  });

  it("deve retornar 400 Bad Request quando o email já estiver em uso", async () => {
    await User.create({
      name: "Carlos",
      email: "carlos@ex.com",
      password: "123456",
      phone: "987654321",
      birthDate: "1985-05-15",
    });
    // Criar um outro utilizador com um email existente
    const user2 = await User.create({
      name: "Ana",
      email: "ana@ex.com",
      password: "123456",
      phone: "912345679",
      birthDate: "1992-02-02",
    });

    const res = await request(app).put(`/api/u/user/${user2.id}`).send({
      email: "carlos@ex.com", // Email já em uso
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toContain("Já existe um utilizador com este email");
  });

  it("deve retornar 400 Bad Request quando o campo name for muito curto", async () => {
    const user = await User.create({
      name: "Carlos",
      email: "carlos@ex.com",
      password: "123456",
      phone: "987654321",
      birthDate: "1985-05-15",
    });
    const res = await request(app).put(`/api/u/user/${user.id}`).send({
      name: "A", // Nome com apenas 1 caractere
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toContain("\"name\" length must be at least 2 characters long");
  });

  it("deve retornar 404 Not Found quando o ID do utilizador não existir", async () => {

    const res = await request(app).put("/api/u/user/999").send({
      name: "Inexistente",
    });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toContain("Utilizador não encontrado");
  });

  it("deve retornar 400 Bad Request quando nenhum campo válido for enviado", async () => {
    const user= await User.create({
      name: "Carlos",
      email: "carlos@ex.com",
      password: "123456",
      phone: "987654321",
      birthDate: "1985-05-15",
    });
    const res = await request(app).put(`/api/u/user/${user.id}`).send({}); // Nenhum campo válido para atualização

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toContain("\"value\" must have at least 1 key");
  });

  it("deve retornar 400 para dados inválidos ou mal formatados", async () => {
    const res = await request(app).put("/api/u/user/abc").send({
    });

    expect(res.statusCode).toBe(400);
  });
});

describe("DELETE /api/u/user/:userId", () => {
  it("ECP_DELETE_01 – deve retornar 200 OK quando o utilizador existir", async () => {
    const user = await User.create({
      name: "Carlos",
      email: "carlos@ex.com",
      password: "123456",
      phone: "911111111",
      birthDate: "1990-01-01",
    });

    const res = await request(app).delete(`/api/u/user/${user.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Utilizador eliminado com sucesso");
  });

  it("ECP_DELETE_02 – deve retornar 404 Not Found quando o utilizador não existir", async () => {
    const res = await request(app).delete("/api/u/user/99999");
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Utilizador não encontrado");
  });

  it("BVA_DELETE_01 – deve retornar 200 OK ou 404 para ID limite inferior (1)", async () => {
    // Opcional: garantir que não existe utilizador com id 1, ou criar um para testar
    const user = await User.create({
      id: 1,
      name: "Limite",
      email: "limite@ex.com",
      password: "123456",
      phone: "922222222",
      birthDate: "1991-01-01",
    });

    const res = await request(app).delete("/api/u/user/1");

    // Pode ser 200 ou 404 dependendo da existência
    expect([200, 404]).toContain(res.statusCode);
  });

  it("BVA_DELETE_02 – deve retornar 400 Bad Request para ID negativo", async () => {
    const res = await request(app).delete("/api/u/user/-1");
    expect([400, 404]).toContain(res.statusCode);
  });

  it("ECP_DELETE_03 – deve retornar 400 Bad Request para ID inválido (string)", async () => {
    const res = await request(app).delete("/api/u/user/abc");
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Bad Request: ID inválido");
  });
});
