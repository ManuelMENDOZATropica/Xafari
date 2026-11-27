const { flattenSubtype } = require("./activity.dto");

exports.toXelfieDTO = (x) => flattenSubtype(x, "Xelfie");

exports.toUserXelfieDTO = (ux) => ({
  id: ux.id,
  userId: ux.userId,
  xelfieId: ux.xelfieId,
  xelfieUrl: ux.xelfieUrl,
  createdAt: ux.createdAt,
});
