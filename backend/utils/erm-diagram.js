const { writeFileSync } = require("fs");

const sequelizeErd = require("sequelize-erd");
const database = require("../config/database");
const models = require("../models");

(async function () {
  
  const svg = await sequelizeErd({ source: database }); 
  
  writeFileSync("./erd.svg", svg);
})();
