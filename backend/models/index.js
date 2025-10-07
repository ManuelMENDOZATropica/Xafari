const User = require("./user");
const Activity = require("./activity");
const UserActivity = require("./userActivity");
const UserAchievement = require("./userAchievement");
const Achievement = require("./achievement");

const Xelfie = require("./xelfie");
const Xecreto = require("./xecreto");
const Xperiencia = require("./xperiencia");
const Event = require("./event");

const FamilyTree = require("./familyTree");
const House = require("./house");

const Clue = require("./clue");

const UserXelfie = require("./userXelfie");

const UserPreference = require("./userPreference");
// user can have many activities and one activity can be done by many users

User.belongsToMany(Activity, {
  through: UserActivity,
});
Activity.belongsToMany(User, {
  through: UserActivity,
});

User.belongsToMany(Activity, {
  through: UserPreference,
});
Activity.belongsToMany(User, {
  through: UserPreference,
});

User.belongsToMany(Xelfie, {
  through: UserXelfie,
});
Xelfie.belongsToMany(User, {
  through: UserXelfie,
});

Xelfie.hasMany(UserXelfie, { foreignKey: "xelfieId" });
UserXelfie.belongsTo(Xelfie, { foreignKey: "xelfieId" });

// user can have many achievement and one achievement can be done by many users

User.belongsToMany(Achievement, {
  through: UserAchievement,
});
Achievement.belongsToMany(User, {
  through: UserAchievement,
});

//one family tree can have plenty users, but one user cant share family tree

FamilyTree.hasMany(User);
User.belongsTo(FamilyTree, {
  foreignKey: {
    name: "familyTreeId",
    allowNull: false,
  },
});

// one xelfie belongs to one activity only

Xelfie.belongsTo(Activity, {
  onDelete: "CASCADE",
  hooks: true,
});
Activity.hasOne(Xelfie);

// one xecreto belongs to one activity only

Xecreto.belongsTo(Activity, {
  onDelete: "CASCADE",
  hooks: true,
});
Activity.hasOne(Xecreto);

// a xecreto has plenty clues

Xecreto.hasMany(Clue, {
  onDelete: "CASCADE",
  hooks: true,
});
Clue.belongsTo(Xecreto);

// one xperiencia belongs to one activity only
Xperiencia.belongsTo(Activity, {
  onDelete: "CASCADE",
  hooks: true,
});
Activity.hasOne(Xperiencia);

// one Event belongs to one activity only

Event.belongsTo(Activity, {
  onDelete: "CASCADE",
  hooks: true,
});
Activity.hasOne(Event);

// plenty achievement belongs to one activity only

Activity.hasMany(Achievement);
Achievement.belongsTo(Activity);

// one house have plenty achievements and one achievement belongs to a single house

House.hasMany(Achievement);
Achievement.belongsTo(House, {
  foreignKey: {
    name: "houseId",
    allowNull: false,
  },
});

// one house have plenty activities and one achievement belongs to a single house

House.hasMany(Activity);
Activity.belongsTo(House, {
  foreignKey: {
    name: "houseId",
    allowNull: false,
  },
});

module.exports = {
  User,
  Activity,
  Achievement,
  Xelfie,
  Xecreto,
  Xperiencia,
  Event,
  Clue,
  House,
  FamilyTree,
  UserAchievement,
  UserActivity,
  UserXelfie,
  UserPreference,
};
