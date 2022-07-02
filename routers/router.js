const express = require('express');
const controller = require('../controllers/controller');

const router = express.Router();

//route definitions
router.get("/", controller.home)
router.get("/computer", controller.computer)
router.get("/multiplayer/friend", controller.friendmultiplayer)
router.get("/multiplayer/online", controller.onlinemultiplayer)

module.exports = router;