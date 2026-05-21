const { toFamilyTreeDTO } = require("./familyTree.dto");

exports.toUserDTO = (user) => {
  let parsedAvatar = null;
  if (user.avatar) {
    try {
      parsedAvatar = typeof user.avatar === "string" ? JSON.parse(user.avatar) : user.avatar;
    } catch (e) {
      parsedAvatar = user.avatar;
    }
  }
  return {
    id: user.id,
    name: user.name,
    lastname: user.lastname,
    email: user.email,
    birthdate: user.birthdate,
    reservationNumber: user.reservationNumber,
    pronouns: user.pronouns,
    casa: user.casa,
    avatar: parsedAvatar,
    avatarUrl: user.avatarUrl,
    achievements: user.achievements ? user.achievements.map(a => {
      const plainA = a.get ? a.get({ plain: true }) : a;
      return {
        ...plainA,
        userAchievement: plainA.userAchievement || plainA.UserAchievement,
      };
    }) : undefined,
    activities: user.activities ? user.activities.map(act => {
      const plainAct = act.get ? act.get({ plain: true }) : act;
      return {
        ...plainAct,
        userActivity: plainAct.userActivity || plainAct.UserActivity,
      };
    }) : undefined,
    familyTreeId: user.familyTreeId || null,
    familyTree: (user.familyTree && user.familyTreeId) ? toFamilyTreeDTO(user.familyTree) : null,
    preferredActivities: user.preferredActivities ? user.preferredActivities.map(act => {
      const plain = act.get ? act.get({ plain: true }) : act;
      return {
        ...plain,
        userPreference: plain.userPreference || plain.UserPreference,
      };
    }) : [],
  };
};
