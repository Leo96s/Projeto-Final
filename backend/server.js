require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Sequelize } = require("sequelize");

const path = require("path");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger/swagger.json");

const app = express();
const PORT = process.env.PORT || 5000;

const userRoutes = require("./routes/api/userRoutes");

app.use(express.json());
app.use(cors());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
});

sequelize
  .authenticate()
  .then(() => console.log("PostgreSQL conectado"))
  .catch((err) => console.log(err));


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/index.html"));
});


app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
  console.log(`http://localhost:5000/`);

});

app.use("/api/u", userRoutes);

