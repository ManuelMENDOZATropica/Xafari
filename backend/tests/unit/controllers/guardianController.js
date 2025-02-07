const guardianController = require("../../../controllers/guardianController");
const guardianService = require("../../../services/guardianService");

jest.mock("../../../services/guardianService");

describe("Guardian Controller", () => {
  describe("createGuardian", () => {
    it("shuld return an id when guardian is created", async () => {
      const req = {
        params: {
          name: "guardian 1",
          description: "lorem ipsum adsfasdfasdfasdfa asdf asdf sdf sdf ",
        },
      };

      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await guardianController.createGuardian(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json.mock.calls[0][0]).toHaveProperty("guardian");
      expect(res.json.mock.calls[0][0].guardian).toHaveProperty("id");
    });

    it("Should return error if not enough params", async () => {
      const req = {
        params: {
          name: "guardian 1",
        },
      };

      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await guardianController.createGuardian(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Not enough parameters or bad parameters",
      });
    });

    it("Should return error if guardian already exists", async () => {
      const req = {
        params: {
          name: "guardian 1",
          description: "lorem ipsum adsfasdfasdfasdfa asdf asdf sdf sdf ",
        },
      };

      guardianService.createGuardian.mockResolvedValue(null);

      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await guardianController.createGuardian(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        message: "Guardian already registered",
      });
    });
  });

  describe("getGuardian", () => {
    it("should return a guardian if id provided", async () => {
      const guardian1 = {
        name: "guardian1",
        description: "lorem ipsum",
      };

      guardianService.getGuardianById.mockResolvedValue(guardian1);

      const req = {
        params: { id: "123456" },
      };

      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await guardianController.getGuardian(req, res);

      expect(guardianService.getGuardianById).toHaveBeenCalledWith("123456");
      expect(res.json).toHaveBeenCalledWith({
        guardian: guardian1,
      });
    });
  });
});
