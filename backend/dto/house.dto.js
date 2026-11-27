exports.toHouseDTO = (house) => ({
  id: house.id,
  name: house.name,
  animal: house.animal,
  element: house.element,
  activities: house.activities ? house.activities.map((a) => ({ id: a.id, name: a.name, type: a.type, location: a.location })) : undefined,
  achievements: house.achievements ? house.achievements.map((a) => ({ id: a.id, name: a.name, type: a.type, imageUrl: a.imageUrl })) : undefined,
});
