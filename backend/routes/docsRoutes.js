const express = require("express");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const YAML = require("yaml");

const file = fs.readFileSync("./api/openapi.yaml", "utf8");
const swaggerDocument = YAML.parse(file);

const router = express.Router();

router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
module.exports = router;
