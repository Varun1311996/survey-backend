const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.user = require("./user.model")(sequelize, Sequelize);
console.log("UUUUU22222", db.user);

db.role = require("./role.model.js")(sequelize, Sequelize);
db.survey = require("./survey.model.js")(sequelize, Sequelize);
db.survey_responses = require("./surveyApplication.model.js")(sequelize, Sequelize);

console.log("RRRRR", db.role);
console.log("UUUUU", db.user);
console.log("SSSSSSS",db.survey)

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});

db.user.hasMany(db.survey,{
  foreignKey:'userId', as:'user',
});

db.survey.hasMany(db.survey_responses,{
  foreignKey:'surveyId', as:'survey',
});
db.user.hasMany(db.survey_responses,{
  foreignKey:'responder', as:'userid',
});

db.ROLES = ["user", "admin", "guest"];

module.exports = db;
