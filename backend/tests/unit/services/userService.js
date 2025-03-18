const userService = require("../../../services/userService");
const User = require("../../../models/user");

const { NotFoundError, BadRequestError } = require("../../../utils/errors");

const sequelize = require("sequelize");

jest.mock("../../../models/user", () => {
  const model = jest.requireActual("../../../models/user");

  return {
    findByPk: jest.fn((id) => {
      return model.findByPk(id);
    }),
    create: jest.fn((user) => {
      return model.create(user);
    }),
  };
});

describe("User service", () => {
  describe("create user", () => {
    it("Should return a brand new user", async () => {
      const user = await userService.addUser("name", 2, 2, 2);

      expect(user).toHaveProperty("id");
      expect(user).toHaveProperty("name");
      expect(user).toHaveProperty("age");
    });

    it("Should have all obligatory fields", async () => {
      expect.assertions(4);

      try {
        await userService.addUser();
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestError);
      }

      try {
        await userService.addUser("name");
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestError);
      }

      try {
        await userService.addUser("name", 20);
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestError);
      }

      try {
        await userService.addUser("name", 20, 2);
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestError);
      }
    });
  });
  describe("delete user", () => {
    it("Should throw error if user does not exists", async () => {
      expect.assertions(1);

      try {
        await userService.deleteUser("1234");
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundError);
      }
    });
  });
});
