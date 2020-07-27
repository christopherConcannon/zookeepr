const router = require('express').Router();
const path = require('path');
// serve index.html -- homepage
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

router.get('/animals', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/animals.html'));
})

router.get('/zookeepers', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
})

module.exports = router;