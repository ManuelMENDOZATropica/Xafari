const User = require("../models/user");
const {
  NotFoundError,
  BadRequestError,
  AgeRestrictionError,
} = require("../utils/errors");

const Casa = require("../models/casa");

const Xecreto = require("../models/xecreto");
const xecretoService = require("./xecretoService");

const Xelfie = require("../models/xelfie");
const xelfieService = require("./xelfieService");

const Xperiencia = require("../models/xperiencia");
const xperienciaService = require("./xperienciaService");

exports.getUserById = async (id, include = []) => {
  if (!id) {
    throw new BadRequestError("Not enough args or wrong parameters");
  }

  const user = await User.findByPk(id, {
    include,
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user;
};

exports.addUser = async (name, age, num_brazalete, qr_iptv) => {
  if (!name || isNaN(age) || isNaN(num_brazalete) || !qr_iptv) {
    throw new BadRequestError("Not enough args or wrong parameters");
  }

  return await User.create({
    name,
    age,
    num_brazalete,
    qr_iptv,
  });
};

exports.deleteUser = async (id) => {
  const user = await this.getUserById(id);
  return await user.destroy();
};

exports.getAllCasas = async (id) => {
  const user = await this.getUserById(
    id,
    (include = [
      { model: Xecreto, include: [Casa] },
      { model: Xelfie, include: [Casa] },
      { model: Xperiencia, include: [Casa] },
    ])
  );

  const casas = [
    ...user.xecretos.map((x) => x.casa),
    ...user.xelfies.map((x) => x.casa),
    ...user.xperiencia.map((x) => x.casa),
  ].filter(
    (casa, index, self) => self.findIndex((c) => c.id === casa.id) == index
  );

  return casas;
};

exports.getAllXecretos = async (id) => {
  const user = await this.getUserById(
    id,
    (include = [{ model: Xecreto, through: [] }])
  );
  return user.xecretos;
};

exports.getAllXelfies = async (id) => {
  const user = await this.getUserById(
    id,
    (include = [{ model: Xelfie, through: [] }])
  );
  return user.xelfies;
};

exports.getAllXperiencias = async (id) => {
  const user = await this.getUserById(
    id,
    (include = [{ model: Xperiencia, through: [] }])
  );
  return user.xelfies;
};

exports.addXecreto = async (id, xecreto_id, xecreto_url) => {
  const user = await this.getUserById(id);
  const xecreto = await xecretoService.getXecretoById(xecreto_id);

  if (
    !xecreto.familiar &&
    !(user.age >= xecreto.min_age && user.age <= xecreto.max_age)
  ) {
    throw new AgeRestrictionError("this Xecreto is age restricted");
  }

  const x = await user.addXecreto(xecreto, {
    through: { xecreto_url },
  });

  return x;
};

exports.addXelfie = async (id, xelfie_id, xelfie_url) => {
  const user = await this.getUserById(id);
  const xelfie = await xelfieService.getXelfieById(xelfie_id);

  if (
    !xelfie.familiar &&
    !(user.age >= xelfie.min_age && user.age <= xelfie.max_age)
  ) {
    throw new AgeRestrictionError("this Xelfie is age restricted");
  }

  const x = await user.addXelfie(xelfie, {
    through: { xelfie_url },
  });

  return x;
};

exports.addXperiencia = async (id, xperiencia_id, xperiencia_url) => {
  if (
    !xperiencia.familiar &&
    !(user.age >= xperiencia.min_age && user.age <= xperiencia.max_age)
  ) {
    throw new AgeRestrictionError("this Xperiencia is age restricted");
  }

  const user = await this.getUserById(id);
  const xperiencia = await xperienciaService.getXperienciaById(xperiencia_id);

  const x = await user.addXperiencia(xperiencia, {
    through: { xperiencia_url },
  });

  return x;
};
