const userService = require("../services/userService");
const { toUserDTO } = require("../dto/user.dto");
const { signSession } = require("../utils/tokens");
const { pick } = require("../middleware/validateRequest");
const { AuthenticationError, ResourceNotFoundError } = require("../utils/errors");

// Campos que el usuario puede editar de su perfil. email, password, casa y role NO.
const PROFILE_FIELDS = ["name", "lastname", "pronouns", "avatar", "birthdate", "reservationNumber"];

function serializeAvatar(data) {
  if (data.avatar !== undefined && data.avatar !== null && typeof data.avatar === "object") {
    data.avatar = JSON.stringify(data.avatar);
  }
  return data;
}

function respondUser(res, status, user, extra = {}) {
  const dto = toUserDTO(user);
  // `...dto` se conserva por compatibilidad con el front actual (lee data.user || data).
  res.status(status).json({ ...extra, user: dto, ...dto });
}

exports.createUser = async (req, res) => {
  const data = serializeAvatar(
    pick(req.body, ["name", "lastname", "email", "password", "birthdate", "reservationNumber", "pronouns", "casa", "avatar"])
  );
  const user = await userService.createUser(data);
  respondUser(res, 201, user, { token: signSession(user) });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const candidates = await userService.findByEmail(email, { withPassword: true });
  // Con cuentas antiguas duplicadas por mayúsculas, vale la que coincida la contraseña.
  for (const user of candidates) {
    // eslint-disable-next-line no-await-in-loop
    if (await user.checkPassword(password)) {
      return respondUser(res, 200, user, { token: signSession(user) });
    }
  }
  throw new AuthenticationError("Credenciales inválidas");
};

async function sendFullUser(res, id) {
  const user = await userService.getUserWithProgress(id);
  if (!user) throw new ResourceNotFoundError("User not found");
  respondUser(res, 200, user);
}

// GET /users/:id (solo el propio o admin) y GET /user
exports.getUser = (req, res) => sendFullUser(res, req.params.id);
exports.getCurrentUser = (req, res) => sendFullUser(res, req.user.id);

// PUT /user y PUT /users/:id (solo el propio)
exports.updateProfile = async (req, res) => {
  const id = req.params.id || req.user.id;
  const data = serializeAvatar(pick(req.body, PROFILE_FIELDS));
  if (data.name === null) delete data.name;
  if (data.birthdate === null) delete data.birthdate;
  await userService.updateProfile(id, data);
  await sendFullUser(res, id);
};

// PUT /user/password
exports.changePassword = async (req, res) => {
  const user = await userService.changePassword(
    req.user.id,
    req.body.currentPassword,
    req.body.newPassword
  );
  res.status(200).json({ token: signSession(user) });
};

// DELETE /users/:id y DELETE /user
exports.deleteUser = async (req, res) => {
  const id = req.params.id || req.user.id;
  const user = await userService.deleteUser(id);
  res.status(200).json({ id: user.id, deleted: true });
};
