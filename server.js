// bring in express module
const express = require('express');
// cache json data in local const
const { animals } = require('./data/animals');
// instantiate app
const app = express();

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

app.listen(3001, () => {
	console.log(`API server now on port 3001!`);
});
