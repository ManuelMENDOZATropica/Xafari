const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

router.get("/user/:id", userController.getUser);  // done
router.get("/user/:id/casas", userController.getAllCasas);
router.get("/user/:id/xecretos", userController.getAllXecretos);
router.get("/user/:id/xelfies", userController.getAllXelfies);
router.get("/user/:id/xperiencias", userController.getAllXperiencias);

router.delete("/user/:id", userController.deleteUser); // done

router.post("/user", userController.addUser); // done
router.post("/user/:id/xecretos", userController.addXecreto);
router.post("/user/:id/xelfies", userController.addXelfie);
router.post("/user/:id/xperiencias", userController.addXperiencia);

module.exports = router;
