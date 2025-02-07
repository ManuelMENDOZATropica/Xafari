const userController = require("../../../controllers/userControllers");
const userService = require("../../../services/userService");

jest.mock("../../../services/userService");

describe("User controller", () => {
  describe("getUser", () => {
    it("should return a user when found", async () => {
      const mockUser = {
        id: "f52828d5-8a8a-488a-9f2d-f4ab6a8a1462",
        name: "Alice",
        age: 20,
        suiteNumber: 1,
      };

      userService.getUserById.mockResolvedValue(mockUser);

      const req = { params: { id: "f52828d5-8a8a-488a-9f2d-f4ab6a8a1462" } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await userController.getUser(req, res);

      expect(userService.getUserById).toHaveBeenCalledWith(
        "f52828d5-8a8a-488a-9f2d-f4ab6a8a1462"
      );
      expect(res.json).toHaveBeenCalledWith({ user: mockUser });
    });

    it("should return 404 when user not found", async () => {
      userService.getUserById.mockResolvedValue(null);

      const req = { params: { id: "asdfadf" } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await userController.getUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });
  });

  describe("createUser", () => {
    it("Should return an id when created a user", async () => {
      const user = {
        name: "Alice",
        age: 20,
        suiteNumber: 1,
      };

      const req = { params: user };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json.mock.calls[0][0]).toHaveProperty("user");
      expect(res.json.mock.calls[0][0].user).toHaveProperty("id");
    });

    it("Should return error if not enough params", async () => {
      const user = {
        name: "Alice",
      };

      const req = { params: user };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Not enough parameters or bad parameters",
      });
    });
  });

  describe("deleteUser", () => {
    it("if user found, deletes it", async () => {
      userService.deleteUser.mockResolvedValue(1);

      const req = {
        params: {
          id: "123456",
        },
      };

      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        user: { id: "123456" },
      });
    });

    it("if user not found, return error", async () => {
      userService.deleteUser.mockResolvedValue(null);

      const req = {
        params: {
          id: "123456",
        },
      };

      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "User not deleted",
        id: "123456",
      });
    });

    it("if no id, return error", async () => {
      userService.deleteUser.mockResolvedValue(null);

      const req = {
        params: {},
      };

      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Not enough parameters or bad parameters",
      });
    });
  });
});
