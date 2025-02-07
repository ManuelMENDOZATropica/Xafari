const activityController = require("../../../controllers/activityController");
const activityService = require("../../../services/activityService");

jest.mock("../../../services/activityService");

describe("Activity Controller", () => {
  describe("createActivity", () => {
    it("shuld return an id when activity is created", async () => {
      const req = {
        params: {
          name: "activity 1",
          description: "lorem ipsum adsfasdfasdfasdfa asdf asdf sdf sdf ",
          guardian: {
            id: "123456"
          }
        },
      };

      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await activityController.createActivity(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json.mock.calls[0][0]).toHaveProperty("activity");
      expect(res.json.mock.calls[0][0].activity).toHaveProperty("id");
    });

    it("Should return error if not enough params", async () => {
      const req = {
        params: {
          name: "activity 1",
        },
      };

      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await activityController.createActivity(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Not enough parameters or bad parameters",
      });
    });

    it("Should return error if activity already exists", async () => {
      const req = {
        params: {
          name: "activity 1",
          description: "lorem ipsum adsfasdfasdfasdfa asdf asdf sdf sdf ",
        },
      };

      activityService.createActivity.mockResolvedValue(null);

      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await activityController.createActivity(req, res)

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        message: "Activity already registered",
      });
    });
  });

  describe("getActivity", () => {
    it("should return an activity if id provided", async () => {
      const activity1 = {
        name: "activity1",
        description: "lorem ipsum",
      };

      activityService.getActivityById.mockResolvedValue(activity1);

      const req = {
        params: { id: "123456" },
      };

      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await activityController.getActivity(req, res);

      expect(activityService.getActivityById).toHaveBeenCalledWith("123456");
      expect(res.json).toHaveBeenCalledWith({
        activity: activity1,
      });
    });
  });
});
