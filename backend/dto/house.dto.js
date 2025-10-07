exports.toHouseDTO = (house) => {
  return {
    id: house.id,
    name: house.name,
    animal: house.animal,
    element: house.element,
    description: house.description,
    activities: house.activities,
  };
};
