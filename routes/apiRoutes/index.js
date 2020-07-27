const router = require('express').Router();
// QUESTION...why not just ./animalRoutes here if this file is in the same apiRoutes folder?
const animalRoutes = require('../apiRoutes/animalRoutes');

const zookeeperRoutes = require('./zookeeperRoutes');
// const zookeeperRoutes = require('../apiRoutes/zookeeperRoutes');


router.use(animalRoutes);
router.use(zookeeperRoutes);

module.exports = router;