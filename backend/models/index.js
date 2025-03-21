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

// user can have many activities and one activity can be done by many users

User.belongsToMany(Activity, {
  through: UserActivity,
});
Activity.belongsToMany(User, {
  through: UserActivity,
});

// user can have many achievement and one achievement can be done by many users

User.belongsToMany(Achievement, {
  through: UserAchievement,
});
Achievement.belongsToMany(User, {
  through: UserAchievement,
});

//one family tree can have plenty users, but one user cant share family tree

FamilyTree.hasMany(User);
User.belongsTo(FamilyTree);

// one xelfie belongs to one activity only

Xelfie.Activity = Xelfie.belongsTo(Activity);
Activity.hasOne(Xelfie);

// one xecreto belongs to one activity only

Xecreto.Activity = Xecreto.belongsTo(Activity, {
  onDelete: "CASCADE",
  hooks: true,
});
Activity.hasOne(Xecreto);

// a xecreto has plenty clues

Xecreto.Clues = Xecreto.hasMany(Clue, {
  onDelete: "CASCADE",
  hooks: true,
});
Clue.belongsTo(Xecreto);

// one xperiencia belongs to one activity only
Xperiencia.Activity = Xperiencia.belongsTo(Activity, {
  onDelete: "CASCADE",
  hooks: true,
});
Activity.hasOne(Xperiencia);

// one Event belongs to one activity only

Event.Activity = Event.belongsTo(Activity);
Activity.hasOne(Event);

// plenty achievement belongs to one activity only

Activity.hasMany(Achievement);
Achievement.belongsTo(Activity);

// one house have plenty achievements and one achievement belongs to a single house

House.hasMany(Achievement);
Achievement.belongsTo(House);

// one house have plenty activities and one achievement belongs to a single house

House.hasMany(Activity);
Activity.belongsTo(House);

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
};
