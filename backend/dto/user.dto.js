const plain = (x) => (x && x.get ? x.get({ plain: true }) : x);

exports.parseAvatar = (avatar) => {
  if (!avatar) return null;
  if (typeof avatar !== "string") return avatar;
  try {
    return JSON.parse(avatar);
  } catch (_) {
    return avatar;
  }
};

function activitiesWithProgress(list) {
  return (list || []).map((act) => {
    const p = plain(act);
    const ua = p.userActivity || p.UserActivity;
    return {
      id: p.id,
      name: p.name,
      type: p.type,
      location: p.location,
      houseId: p.houseId,
      userActivity: ua
        ? { id: ua.id, startedAt: ua.startedAt, completedAt: ua.completedAt }
        : undefined,
    };
  });
}

/**
 * DTO del propio usuario (GET /users/:id, GET /user, login, registro).
 * Nunca incluye password ni tokenVersion.
 */
exports.toUserDTO = (user) => {
  const u = plain(user);
  const { toFamilyTreeDTO } = require("./familyTree.dto");
  return {
    id: u.id,
    name: u.name,
    lastname: u.lastname,
    email: u.email,
    birthdate: u.birthdate,
    reservationNumber: u.reservationNumber,
    pronouns: u.pronouns,
    casa: u.casa,
    role: u.role || "user",
    avatar: exports.parseAvatar(u.avatar),
    familyTreeId: u.familyTreeId || null,
    familyTree: u.familyTree && u.familyTreeId ? toFamilyTreeDTO(u.familyTree) : null,
    activities: u.activities ? activitiesWithProgress(u.activities) : undefined,
    achievements: u.achievements
      ? u.achievements.map((a) => {
          const ua = a.userAchievement || a.UserAchievement;
          return {
            id: a.id,
            name: a.name,
            type: a.type,
            imageUrl: a.imageUrl,
            userAchievement: ua
              ? { amount: ua.amount, completedAt: ua.completedAt }
              : undefined,
          };
        })
      : undefined,
    preferredActivities: u.preferredActivities
      ? u.preferredActivities.map((act) => {
          const pref = act.userPreference || act.UserPreference;
          return {
            id: act.id,
            name: act.name,
            type: act.type,
            userPreference: pref
              ? { id: pref.id, rating: pref.rating, comment: pref.comment, isFavorite: pref.isFavorite }
              : undefined,
          };
        })
      : [],
  };
};

/**
 * DTO de un familiar: nombre, avatar, casa y progreso. Sin email, fecha de
 * nacimiento, reservación, rol ni tokenVersion.
 */
exports.toMemberDTO = (user) => {
  const u = plain(user);
  return {
    id: u.id,
    name: u.name,
    casa: u.casa,
    avatar: exports.parseAvatar(u.avatar),
    activities: activitiesWithProgress(u.activities),
  };
};
