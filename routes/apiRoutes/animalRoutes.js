const router = require('express').Router();

// bring in animal functions
const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
// bring in animals data JSON
const { animals } = require('../../data/animals');
// route for animal results filtered by url query
router.get('/animals', (req, res) => {
  // store json in results var so we are not affecting initial json data
  let results = animals;
  // console.log(req.query)
  // if the client adds query params
  if (req.query) {
    // pass the json data to the filter function along with the query property on the req object, which extracts and stores the query data from after the ? in the client http request 
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

// retrieve individual animal by id
router.get('/animals/:id', (req, res) => {
  const result = findById(req.params.id, animals);
  if (result) {
    res.json(result);
  } else {
    res.send(404);
  }
})

// add new animal
router.post('/animals', (req, res) => {
  // req.body is where our incoming content will be
  // console.log(req.body);
  // set id based on what the next index of the array will be
  req.body.id = animals.length.toString();

  // if any data in req.body is incorrect, send 400 error back
  if(!validateAnimal(req.body)) {
    res.status(400).send('The animal is not properly formatted.');
  } else {
    // add animal to json file and animals array in this function
    const animal = createNewAnimal(req.body, animals);
    res.json(animal);
  }
})

module.exports = router;