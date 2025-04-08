const request = require("supertest");
const app = require("../../../app");
const { User } = require("../../../models");

describe("FamilyTree route", () => {
  describe("GET FamilyTree", () => {
    it("Should return error if family does not exists", async () => {
      const response = await request(app).get("/familyTree/1234");

      console.debug("response console", response.body, response.status);
      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        error: "FamilyTree not found",
      });
    });
  });
  describe("DELETE familyTree", () => {
    it("Should return error if  familyTree does not exists", async () => {
      const response = await request(app).delete("/familyTree/1234");

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        error: "FamilyTree not found",
      });
    });

    it("Should return familyTree after delete, user should not be deleted", async () => {
      const user = {
        name: `Name ${Math.floor(Math.random() * 200)}`,
        email: `${Math.random().toString(16).substring(2)}@gmail.com`,
        password: "1234",
        birthdate: "2025-03-22T22:52:46.816Z",
        reservationNumber: "1234",
      };

      const responseUser = await request(app).post("/user").send(user);

      const responseFamily = await request(app).post("/familyTree").send({
        adminId: responseUser.body.user.id,
        name: "garcia",
      });

      const response = await request(app).delete(
        `/familyTree/${responseFamily.body.familyTree.id}`
      );

      expect(response.status).toBe(200);
      expect(responseFamily.body.familyTree).toMatchObject(
        response.body.familyTree
      );

      const userFromModel = await User.findByPk(responseUser.body.user.id);

      expect(userFromModel.toJSON() == null).toBe(false);
    });
  });
  describe("POST familyTree create", () => {
    it("Should create a new familyTree", async () => {
      const user = {
        name: `Name ${Math.floor(Math.random() * 200)}`,
        email: `${Math.random().toString(16).substring(2)}@gmail.com`,
        password: "1234",
        birthdate: "2025-03-22T22:52:46.816Z",
        reservationNumber: "1234",
      };

      const responseUser = await request(app).post("/user").send(user);

      const responseFamily = await request(app).post("/familyTree").send({
        adminId: responseUser.body.user.id,
        name: "garcia",
      });

      const response = await request(app).get(
        `/user/${responseUser.body.user.id}`
      );

      expect(responseFamily.body.familyTree).toMatchObject(
        response.body.user.familyTree
      );
    });

    it("Should add members to a familyTree", async () => {
      const admin = {
        name: `Name ${Math.floor(Math.random() * 200)}`,
        email: `${Math.random().toString(16).substring(2)}@gmail.com`,
        password: "1234",
        birthdate: "2025-03-22T22:52:46.816Z",
        reservationNumber: "1234",
      };

      const membersPayload = [
        {
          name: `Name ${Math.floor(Math.random() * 200)}`,
          email: `${Math.random().toString(16).substring(2)}@gmail.com`,
          password: "1234",
          birthdate: "2025-03-22T22:52:46.816Z",
          reservationNumber: "1234",
        },
        {
          name: `Name ${Math.floor(Math.random() * 200)}`,
          email: `${Math.random().toString(16).substring(2)}@gmail.com`,
          password: "1234",
          birthdate: "2025-03-22T22:52:46.816Z",
          reservationNumber: "1234",
        },
        {
          name: `Name ${Math.floor(Math.random() * 200)}`,
          email: `${Math.random().toString(16).substring(2)}@gmail.com`,
          password: "1234",
          birthdate: "2025-03-22T22:52:46.816Z",
          reservationNumber: "1234",
        },
      ];
      const responseAdmin = await request(app).post("/user").send(admin);

      const responseMembers = await Promise.all(
        membersPayload.map((member) => request(app).post("/user").send(member))
      );

      const response = await request(app)
        .post("/familyTree")
        .send({
          adminId: responseAdmin.body.user.id,
          name: "dominguez",
          members: responseMembers.map((m) => m.body.user.id),
        });

      const responseMembersGet = await Promise.all(
        responseMembers.map((member) =>
          request(app).get(`/user/${member.body.user.id}`)
        )
      );
      expect(responseMembersGet[0].body.user.familyTreeId).toBe(
        response.body.familyTree.id
      );
      expect(responseMembersGet[1].body.user.familyTreeId).toBe(
        response.body.familyTree.id
      );
      expect(responseMembersGet[2].body.user.familyTreeId).toBe(
        response.body.familyTree.id
      );
    });

    it("Should return error if members are more than 8", async () => {
      const admin = {
        name: `Name ${Math.floor(Math.random() * 200)}`,
        email: `${Math.random().toString(16).substring(2)}@gmail.com`,
        password: "1234",
        birthdate: "2025-03-22T22:52:46.816Z",
        reservationNumber: "1234",
      };

      const membersPayload = new Array(8)
        .fill(() => ({
          name: `Name ${Math.floor(Math.random() * 200)}`,
          email: `${Math.random().toString(16).substring(2)}@gmail.com`,
          password: "1234",
          birthdate: "2025-03-22T22:52:46.816Z",
          reservationNumber: "1234",
        }))
        .map((m) => m());

      const responseAdmin = await request(app).post("/user").send(admin);

      const responseMembers = await Promise.all(
        membersPayload.map((member) => request(app).post("/user").send(member))
      );

      const response = await request(app)
        .post("/familyTree")
        .send({
          adminId: responseAdmin.body.user.id,
          name: "dominguez",
          members: responseMembers.map((m) => m.body.user.id),
        });

      expect(response.body).toMatchObject({
        error: "Family cannot exceed 8 members",
      });
    });

    it("Should error if some member is already in a familyTree", async () => {
      const admin = {
        name: `Name ${Math.floor(Math.random() * 200)}`,
        email: `${Math.random().toString(16).substring(2)}@gmail.com`,
        password: "1234",
        birthdate: "2025-03-22T22:52:46.816Z",
        reservationNumber: "1234",
      };

      const membersPayload = [
        {
          name: `Name ${Math.floor(Math.random() * 200)}`,
          email: `${Math.random().toString(16).substring(2)}@gmail.com`,
          password: "1234",
          birthdate: "2025-03-22T22:52:46.816Z",
          reservationNumber: "1234",
        },
        {
          name: `Name ${Math.floor(Math.random() * 200)}`,
          email: `${Math.random().toString(16).substring(2)}@gmail.com`,
          password: "1234",
          birthdate: "2025-03-22T22:52:46.816Z",
          reservationNumber: "1234",
        },
        {
          name: `Name ${Math.floor(Math.random() * 200)}`,
          email: `${Math.random().toString(16).substring(2)}@gmail.com`,
          password: "1234",
          birthdate: "2025-03-22T22:52:46.816Z",
          reservationNumber: "1234",
        },
      ];
      const responseAdmin = await request(app).post("/user").send(admin);

      const responseMembers = await Promise.all(
        membersPayload.map((member) => request(app).post("/user").send(member))
      );

      await request(app)
        .post("/familyTree")
        .send({
          adminId: responseAdmin.body.user.id,
          name: "dominguez",
          members: responseMembers.slice(1).map((m) => m.body.user.id),
        });

      const response2 = await request(app)
        .post("/familyTree")
        .send({
          adminId: responseMembers[0].body.user.id,
          name: "ramirez",
          members: responseMembers.map((m) => m.body.user.id),
        });

      expect(response2.body).toMatchObject({
        error: "Some users not found or belong to other families",
      });
    });

    it("Should return error if already in a familyTree", async () => {
      const user = {
        name: `Name ${Math.floor(Math.random() * 200)}`,
        email: `${Math.random().toString(16).substring(2)}@gmail.com`,
        password: "1234",
        birthdate: "2025-03-22T22:52:46.816Z",
        reservationNumber: "1234",
      };

      const responseUser = await request(app).post("/user").send(user);

      await request(app).post("/familyTree").send({
        adminId: responseUser.body.user.id,
        name: "dominguez",
      });

      const responseFamily2 = await request(app).post("/familyTree").send({
        adminId: responseUser.body.user.id,
        name: "dominguez",
      });

      expect(responseFamily2.status).toBe(400);
      expect(responseFamily2.body).toMatchObject({
        error: "User already belongs to a family tree",
      });
    });

    it("should return error if family name is not valid", async () => {
      const user = {
        name: `Name ${Math.floor(Math.random() * 200)}`,
        email: `${Math.random().toString(16).substring(2)}@gmail.com`,
        password: "1234",
        birthdate: "2025-03-22T22:52:46.816Z",
        reservationNumber: "1234",
      };

      const responseUser = await request(app).post("/user").send(user);

      const response = await request(app).post("/familyTree").send({
        adminId: responseUser.body.user.id,
      });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        error: "Name cannot be empty",
      });
    });
  });
  describe("POST familyTree update", () => {
    it("Should return error if familyTree does not exists", async () => {
      const familyTree = {
        name: `rodriguez`,
      };

      const response = await request(app)
        .post("/familyTree/1234")
        .send(familyTree);

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        error: "FamilyTree not found",
      });
    });

    it("Should modify an familyTree name", async () => {
      const user = {
        name: `Name ${Math.floor(Math.random() * 200)}`,
        email: `${Math.random().toString(16).substring(2)}@gmail.com`,
        password: "1234",
        birthdate: "2025-03-22T22:52:46.816Z",
        reservationNumber: "1234",
      };

      const responseUser = await request(app).post("/user").send(user);

      const responseFamily = await request(app).post("/familyTree").send({
        adminId: responseUser.body.user.id,
        name: "Rodriguez",
      });

      await request(app)
        .post(`/familyTree/${responseFamily.body.familyTree.id}`)
        .send({
          name: "Gonzalez",
        });
      const response = await request(app).get(
        `/familyTree/${responseFamily.body.familyTree.id}`
      );

      expect(response.body.familyTree.name).toBe("Gonzalez");
    });

    it("Should add users to a created family", async () => {
      const user = {
        name: `Name ${Math.floor(Math.random() * 200)}`,
        email: `${Math.random().toString(16).substring(2)}@gmail.com`,
        password: "1234",
        birthdate: "2025-03-22T22:52:46.816Z",
        reservationNumber: "1234",
      };

      const responseAdmin = await request(app).post("/user").send(user);

      const responseFamily = await request(app).post("/familyTree").send({
        adminId: responseAdmin.body.user.id,
        name: "Rodriguez",
      });

      const newMembers = [
        {
          name: `Name ${Math.floor(Math.random() * 200)}`,
          email: `${Math.random().toString(16).substring(2)}@gmail.com`,
          password: "1234",
          birthdate: "2025-03-22T22:52:46.816Z",
          reservationNumber: "1234",
        },
        {
          name: `Name ${Math.floor(Math.random() * 200)}`,
          email: `${Math.random().toString(16).substring(2)}@gmail.com`,
          password: "1234",
          birthdate: "2025-03-22T22:52:46.816Z",
          reservationNumber: "1234",
        },
      ];

      const responseNewMembers = await Promise.all(
        newMembers.map((m) => request(app).post("/user").send(m))
      );

      const response = await request(app)
        .post(`/familyTree/${responseFamily.body.familyTree.id}`)
        .send({
          members: [...responseNewMembers.map((m) => m.body.user.id)],
        });

      const expectedUsers = [
        Object.fromEntries(
          Object.entries(responseAdmin.body.user).filter(
            ([key, value]) => key != "updatedAt"
          )
        ),
        ...responseNewMembers.map((m) => ({
          ...Object.fromEntries(
            Object.entries(m.body.user).filter(
              ([key, value]) => key != "updatedAt"
            )
          ),
          familyTreeId: responseFamily.body.familyTree.id,
        })),
      ].sort((a, b) => a.id > b.id);

      expect(
        response.body.familyTree.users
          .sort((a, b) => a.id > b.id)
          .map((u) =>
            Object.fromEntries(
              Object.entries(u).filter(([key, value]) => key != "updatedAt")
            )
          )
      ).toMatchObject(expectedUsers);
    });

    it("Should modify admin", async () => {
      const user = {
        name: `Name ${Math.floor(Math.random() * 200)}`,
        email: `${Math.random().toString(16).substring(2)}@gmail.com`,
        password: "1234",
        birthdate: "2025-03-22T22:52:46.816Z",
        reservationNumber: "1234",
      };

      const newMembers = [
        {
          name: `Name ${Math.floor(Math.random() * 200)}`,
          email: `${Math.random().toString(16).substring(2)}@gmail.com`,
          password: "1234",
          birthdate: "2025-03-22T22:52:46.816Z",
          reservationNumber: "1234",
        },
        {
          name: `Name ${Math.floor(Math.random() * 200)}`,
          email: `${Math.random().toString(16).substring(2)}@gmail.com`,
          password: "1234",
          birthdate: "2025-03-22T22:52:46.816Z",
          reservationNumber: "1234",
        },
      ];

      const responseAdmin = await request(app).post("/user").send(user);

      const responseNewMembers = await Promise.all(
        newMembers.map((m) => request(app).post("/user").send(m))
      );

      const responseFamily = await request(app)
        .post("/familyTree")
        .send({
          adminId: responseAdmin.body.user.id,
          name: "Rodriguez",
          members: responseNewMembers.map((m) => m.body.user.id),
        });

      const response = await request(app)
        .post(`/familyTree/${responseFamily.body.familyTree.id}`)
        .send({
          adminId: responseNewMembers[0].body.user.id,
        });

      expect(response.body.familyTree.admin).toBe(
        responseNewMembers[0].body.user.id
      );
    });

    it("Should return error if new admin is not from the family", async () => {
      const user = {
        name: `Name ${Math.floor(Math.random() * 200)}`,
        email: `${Math.random().toString(16).substring(2)}@gmail.com`,
        password: "1234",
        birthdate: "2025-03-22T22:52:46.816Z",
        reservationNumber: "1234",
      };

      const newMembers = [
        {
          name: `Name ${Math.floor(Math.random() * 200)}`,
          email: `${Math.random().toString(16).substring(2)}@gmail.com`,
          password: "1234",
          birthdate: "2025-03-22T22:52:46.816Z",
          reservationNumber: "1234",
        },
        {
          name: `Name ${Math.floor(Math.random() * 200)}`,
          email: `${Math.random().toString(16).substring(2)}@gmail.com`,
          password: "1234",
          birthdate: "2025-03-22T22:52:46.816Z",
          reservationNumber: "1234",
        },
        {
          name: `Name ${Math.floor(Math.random() * 200)}`,
          email: `${Math.random().toString(16).substring(2)}@gmail.com`,
          password: "1234",
          birthdate: "2025-03-22T22:52:46.816Z",
          reservationNumber: "1234",
        },
      ];

      const responseAdmin = await request(app).post("/user").send(user);

      const responseNewMembers = await Promise.all(
        newMembers.map((m) => request(app).post("/user").send(m))
      );

      const responseFamily = await request(app)
        .post("/familyTree")
        .send({
          adminId: responseAdmin.body.user.id,
          name: "Rodriguez",
          members: responseNewMembers.slice(0, -1).map((m) => m.body.user.id),
        });

      const response = await request(app)
        .post(`/familyTree/${responseFamily.body.familyTree.id}`)
        .send({
          adminId: responseNewMembers[2].body.user.id,
        });

      expect(response.body).toMatchObject({
        error: "New admin must be a family member",
      });
    });

    it("Should remove a family member", async () => {
      const user = {
        name: `Name ${Math.floor(Math.random() * 200)}`,
        email: `${Math.random().toString(16).substring(2)}@gmail.com`,
        password: "1234",
        birthdate: "2025-03-22T22:52:46.816Z",
        reservationNumber: "1234",
      };

      const newMembers = [
        {
          name: `Name ${Math.floor(Math.random() * 200)}`,
          email: `${Math.random().toString(16).substring(2)}@gmail.com`,
          password: "1234",
          birthdate: "2025-03-22T22:52:46.816Z",
          reservationNumber: "1234",
        },
        {
          name: `Name ${Math.floor(Math.random() * 200)}`,
          email: `${Math.random().toString(16).substring(2)}@gmail.com`,
          password: "1234",
          birthdate: "2025-03-22T22:52:46.816Z",
          reservationNumber: "1234",
        },
        {
          name: `Name ${Math.floor(Math.random() * 200)}`,
          email: `${Math.random().toString(16).substring(2)}@gmail.com`,
          password: "1234",
          birthdate: "2025-03-22T22:52:46.816Z",
          reservationNumber: "1234",
        },
      ];

      const responseAdmin = await request(app).post("/user").send(user);

      const responseNewMembers = await Promise.all(
        newMembers.map((m) => request(app).post("/user").send(m))
      );

      const responseFamily = await request(app)
        .post("/familyTree")
        .send({
          adminId: responseAdmin.body.user.id,
          name: "Rodriguez",
          members: responseNewMembers.map((m) => m.body.user.id),
        });

      await request(app)
        .post(`/familyTree/${responseFamily.body.familyTree.id}`)
        .send({
          members: responseNewMembers.slice(0, -1).map((m) => m.body.user.id),
        });

      const response = await request(app).get(
        `/user/${responseNewMembers[2].body.user.id}`
      );

      expect(response.body.user.familyTreeId).toBe(null);
      expect(response.body.user.familyTree).toBe(null);
    });
  });
});

