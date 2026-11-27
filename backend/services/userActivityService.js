const { UniqueConstraintError } = require("sequelize");
const database = require("../config/database");
const env = require("../config/env");
const { Activity, UserActivity, Xperiencia } = require("../models");
const { isValidActivityCode } = require("../utils/tokens");
const {
  BadRequestError,
  ForbiddenError,
  ResourceNotFoundError,
  TooManyRequestsError,
} = require("../utils/errors");

// Tipos que exigen el código del QR físico (placas). Ver CONTRATO-API §4.
const QR_TYPES = new Set(["Xecreto"]);

const normalize = (s) => String(s || "").trim().toLowerCase();

exports.listForUser = (userId) =>
  UserActivity.findAll({ where: { userId }, order: [["createdAt", "ASC"]] });

exports.getForUser = (userId, activityId) =>
  UserActivity.findOne({ where: { userId, activityId } });

/**
 * Marca una actividad como completada por el usuario del token.
 * Devuelve {userActivity, created}. Idempotente.
 */
exports.complete = async (userId, { activityId, code, answer }) => {
  let pendingError = null;

  const result = await database.transaction(async (transaction) => {
    const activity = await Activity.findByPk(activityId, {
      attributes: ["id", "type", "isActive"],
      include: [{ model: Xperiencia, attributes: ["id", "correctAnswer"] }],
      transaction,
    });
    if (!activity) throw new ResourceNotFoundError("Activity not found");
    if (activity.isActive === false) throw new BadRequestError("Activity is not active");

    if (QR_TYPES.has(activity.type) && !isValidActivityCode(activity.id, code)) {
      const err = new ForbiddenError("invalid_code");
      throw err;
    }

    const existing = await UserActivity.findOne({
      where: { userId, activityId: activity.id },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    if (existing && existing.completedAt) return { userActivity: existing, created: false };

    const now = new Date();
    const correctAnswer = activity.xperiencium && activity.xperiencium.correctAnswer;
    if (activity.type === "Xperiencia" && correctAnswer) {
      const cooldownMs = env.XPERIENCIA_COOLDOWN_SECONDS * 1000;
      if (existing && existing.startedAt && now - existing.startedAt < cooldownMs) {
        const retryAfter = Math.ceil((cooldownMs - (now - existing.startedAt)) / 1000);
        throw new TooManyRequestsError("cooldown", { retryAfter });
      }
      if (answer === undefined || answer === null || answer === "") {
        throw new BadRequestError("answer_required");
      }
      if (normalize(answer) !== normalize(correctAnswer)) {
        // Se guarda el intento fallido (startedAt) para el cooldown y se confirma.
        if (existing) await existing.update({ startedAt: now }, { transaction });
        else await UserActivity.create({ userId, activityId: activity.id, startedAt: now, completedAt: null }, { transaction });
        pendingError = new BadRequestError("wrong_answer");
        pendingError.extra = { retryAfter: env.XPERIENCIA_COOLDOWN_SECONDS };
        return null;
      }
    }

    if (existing) {
      await existing.update({ completedAt: now }, { transaction });
      return { userActivity: existing, created: true };
    }
    const userActivity = await UserActivity.create(
      { userId, activityId: activity.id, startedAt: now, completedAt: now },
      { transaction }
    );
    return { userActivity, created: true };
  }).catch(async (err) => {
    // Dos peticiones simultáneas: la segunda choca con el UNIQUE(userId, activityId).
    if (err instanceof UniqueConstraintError) {
      const userActivity = await exports.getForUser(userId, activityId);
      if (userActivity && userActivity.completedAt) return { userActivity, created: false };
    }
    throw err;
  });

  if (pendingError) throw pendingError;
  return result;
};
