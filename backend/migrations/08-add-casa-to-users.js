"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;

    await queryInterface.addColumn("users", "casa", {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("users", "casa");
  },
};
