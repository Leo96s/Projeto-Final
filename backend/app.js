require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger/swagger.json");
const userRoutes = require("./routes/api/userRoutes");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/index.html"));
});

app.post('/', (req, res) => {
  const githubEvent = req.headers['x-github-event'];

  if (githubEvent === 'push') {
    console.log('Recebido push do GitHub, executando pipeline...');
    exec('az pipelines run --name NomeDaSuaPipeline', (err, stdout, stderr) => {
      if (err) {
        console.error(`Erro ao executar pipeline: ${stderr}`);
        return res.status(500).send('Erro na execução da pipeline');
      }
      console.log(`Pipeline iniciada com sucesso: ${stdout}`);
      res.status(200).send('Pipeline iniciada!');
    });
  } else {
    res.status(200).send('Evento ignorado');
  }
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/u", userRoutes);

module.exports = app;
