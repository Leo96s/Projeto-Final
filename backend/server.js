const app = require("./app");
const { Sequelize } = require("sequelize");

const PORT = process.env.PORT || 5000;

const URL = process.env.DATABASE_URL || ""

const sequelize = new Sequelize(URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Isto é importante para Aiven/Heroku bancos
    },
  },
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


