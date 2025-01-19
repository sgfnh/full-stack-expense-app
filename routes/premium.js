const express = require('express');

const premiumFeatureController = require('../controller/premium');

const authenticatemiddleware = require('../middleware/mid');

const router = express.Router();

router.get('/showLeaderBoard', authenticatemiddleware.authenticate,premiumFeatureController.getUserLeaderBoard);

module.exports = router;