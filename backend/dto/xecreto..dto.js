exports.toXecretoDTO = (xecreto) => {
  return {
    id: xecreto.id,
    house: xecreto.house,
    clueStage: xecreto.clueStage,
    found: xecreto.found,
  };
};
