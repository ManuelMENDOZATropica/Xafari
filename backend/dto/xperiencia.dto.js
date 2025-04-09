exports.toXperienciaDTO = (xp) => {
  return {
    id: xp.id,
    name: xp.name,
    category: xp.category,
    validable: xp.validable,
  };
};
