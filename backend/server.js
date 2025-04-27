const app = require("./app");
const { Sequelize } = require("sequelize");

const PORT = process.env.PORT || 5000;

const URL = process.env.DATABASE_URL || ""

const sequelize = new Sequelize(URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,          // força a utilização de SSL
      rejectUnauthorized: false, // aceita certificados autoassinados
    },
  },
  ssl: true,
  logging: false,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("PostgreSQL conectado");
    app.listen(PORT, () => {
      console.log(`Servidor a correr na porta ${PORT}`);
      console.log(`http://localhost:${PORT}/`);
    });
  })
  .catch((err) => {
    console.error("Erro ao conectar à base de dados:", err);
  });


