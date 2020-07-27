// bring in modules
const express = require('express');
const fs = require('fs');
const path = require('path');
// cache json data in local const
const { animals } = require('./data/animals');
// use heroku environment variable for deployment, or 3001 for developing
const PORT = process.env.PORT || 3001;
// instantiate app
const app = express();

// intercept data before it reaches POST route
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
// middleware to make static assets readily available, not gated behind a server endpoint
app.use(express.static('public'));

// take in req.query as an argument when it is called in the '/api/animals' route (if there are query params in the client request) and filter through the animals accordingly, returning the new filtered array
function filterByQuery(query, animalsArray) {
  let personalityTraitsArray = [];
  let filteredResults = animalsArray;
  if (query.personalityTraits) {
    // Save personalityTraits as a dedicated array.
    // If personalityTraits is a string (only one trait passed as param), place it into a new array and save.
    if (typeof query.personalityTraits === 'string') {
      personalityTraitsArray = [query.personalityTraits];
    } else {
      personalityTraitsArray = query.personalityTraits;
    }
    // Loop through each trait in the personalityTraits array:
    personalityTraitsArray.forEach(trait => {
      // Check the trait against each animal in the filteredResults array.
      // Remember, it is initially a copy of the animalsArray
      // but here we're updating it for each trait in the .forEach() loop
      // For each trait being targeted by the filter, the filteredResults
      // array will then contain only the entries that contain the trait, 
      // so at the end we'll have an array of animals that have every one 
      // of the traits when the .forEach() loop is finished
      filteredResults = filteredResults.filter(
        animal => animal.personalityTraits.indexOf(trait) !== -1
      );
    });
  }
  if (query.diet) {
    filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
  }
  if (query.species) {
    filteredResults = filteredResults.filter(animal => animal.species === query.species);
  }
  if (query.name) {
    filteredResults = filteredResults.filter(animal => animal.name === query.name);
  }
  return filteredResults;
}

function findById(id, animalsArray) {
  const result = animalsArray.filter(animal => animal.id === id)[0];
  return result;
}

// route for animal results filtered by url query
app.get('/api/animals', (req, res) => {
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

function validateAnimal(animal) {
  if (!animal.name || typeof animal.name !== 'string') {
    return false;
  }
  if (!animal.species || typeof animal.species !== 'string') {
    return false;
  }
  if (!animal.diet || typeof animal.diet !== 'string') {
    return false;
  }
  if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
    return false;
  }
  return true;
}

// POST route function to add new animal to data
function createNewAnimal(body, animalsArray) {
  // cache new animal from req.body
  const animal = body;
  // add new animal to array
  animalsArray.push(animal);
  // write to .json file (add to database)
  fs.writeFileSync(
      path.join(__dirname, './data/animals.json'),
      JSON.stringify({ animals: animalsArray }, null, 2)
  );
  // return code to post route for response
  return animal;
}


// retrieve individual animal by id
app.get('/api/animals/:id', (req, res) => {
  const result = findById(req.params.id, animals);
  if (result) {
    res.json(result);
  } else {
    res.send(404);
  }
})

// add new animal
app.post('/api/animals', (req, res) => {
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

// serve index.html -- homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/animals', (req, res) => {
  res.sendFile(path.join(__dirname, './public/animals.html'));
})

app.get('/zookeepers', (req, res) => {
  res.sendFile(path.join(__dirname, './public/zookeepers.html'));
})





app.listen(PORT, () => {
	console.log(`API server now on port ${PORT}!`);
});
