exports.toXecretoDTO = (xecreto) => {
  return {
    id: xecreto.id,
    clues: xecreto.clues
      ? xecreto.clues.map((clue) => ({
          id: clue.id,
          text: clue.text,
          correctAnswer: clue.correctAnswer,
          order: clue.order,
        }))
      : [],
    name: xecreto.activity ? xecreto.activity.name : null,
    description: xecreto.activity ? xecreto.activity.description : null,
    location: xecreto.activity ? xecreto.activity.location : null,
    type: "Xecreto",
    isActive: xecreto.activity ? xecreto.activity.isActive : null,
    minAge: xecreto.activity ? xecreto.activity.minAge : null,
    maxAge: xecreto.activity ? xecreto.activity.maxAge : null,
    activity: xecreto.activity ? {
      id: xecreto.activity.id,
      name: xecreto.activity.name,
      description: xecreto.activity.description,
      location: xecreto.activity.location,
      type: xecreto.activity.type,
      isActive: xecreto.activity.isActive,
      minAge: xecreto.activity.minAge,
      maxAge: xecreto.activity.maxAge,
    } : null
  };
};
