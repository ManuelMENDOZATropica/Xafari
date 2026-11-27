const path = require("path");
const fs = require("fs");
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yaml");

const swaggerDocument = YAML.parse(fs.readFileSync(path.join(__dirname, "..", "api", "openapi.yaml"), "utf8"));

const router = express.Router();
router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = router;
