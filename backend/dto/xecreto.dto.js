exports.toXecretoDTO = (xecreto) => {
  return {
    id: xecreto.id,
    clues: xecreto.clues.map((clue) => clue.id),
    name: xecreto.activity.name,
    description: xecreto.activity.description,
    location: xecreto.activity.location,
    type: "Xecreto",
    isActive: xecreto.activity.isActive,
    minAge: xecreto.activity.minAge,
    maxAge: xecreto.activity.maxAge,
  };
};
