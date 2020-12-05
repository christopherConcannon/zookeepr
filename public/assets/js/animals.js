const $animalForm = document.querySelector('#animals-form');
const $displayArea = document.querySelector('#display-area');

// loop over array of animals sent back from server and output card for each
const printResults = resultArr => {
  console.log(resultArr);

  const animalHTML = resultArr.map(({ id, name, personalityTraits, species, diet }) => {
    return `
  <div class="col-12 col-md-5 mb-3">
    <div class="card p-3" data-id=${id}>
      <h4 class="text-primary">${name}</h4>
      <p>Species: ${species.substring(0, 1).toUpperCase() + species.substring(1)}<br/>
      Diet: ${diet.substring(0, 1).toUpperCase() + diet.substring(1)}<br/>
      Personality Traits: ${personalityTraits
        .map(trait => `${trait.substring(0, 1).toUpperCase() + trait.substring(1)}`)
        .join(', ')}</p>
    </div>
  </div>
    `;
  });

  $displayArea.innerHTML = animalHTML.join('');
};

// make http request to api/animals route, passing in query params if extant
const getAnimals = (formData = {}) => {
  let queryUrl = '/api/animals?';

  // Object.entries() returns an array whose elements are arrays corresponding to the enumerable string-keyed property [key, value] pairs found directly upon object. The ordering of the properties is the same as that given by looping over the property values of the object manually.  [['diet', 'herbivore'], ['personlalityTraits', 'hungry,anxious']].  then for each element in that array, we format it as a query string parameter and append it to the entire query string. NOTE...the trailing ? will be ignored...and  
  console.log(Object.entries(formData));
  Object.entries(formData).forEach(([key, value]) => {
    queryUrl += `${key}=${value}&`;
  });

  console.log(queryUrl);

  fetch(queryUrl) 
    .then(response => {
      if (!response.ok) {
        return alert('Error: ' + response.statusText);
      }
      // data returned from within api/animals route...res.json(results);
      return response.json();
    })
    .then(animalData => {
      console.log(animalData);
      printResults(animalData);
    });

};

// package up form data to send in http request
const handleGetAnimalsSubmit = event => {
  event.preventDefault();
  const dietRadioHTML = $animalForm.querySelectorAll('[name="diet"]');
  let diet;

  for (let i = 0; i < dietRadioHTML.length; i += 1) {
    if (dietRadioHTML[i].checked) {
      diet = dietRadioHTML[i].value;
    }
  }

  if (diet === undefined) {
    diet = '';
  }

  const personalityTraitArr = [];
  const selectedTraits = $animalForm.querySelector('[name="personality"').selectedOptions;

  for (let i = 0; i < selectedTraits.length; i += 1) {
    personalityTraitArr.push(selectedTraits[i].value);
  }

  const personalityTraits = personalityTraitArr.join(',');

  const animalObject = { diet, personalityTraits };

  getAnimals(animalObject);
};

$animalForm.addEventListener('submit', handleGetAnimalsSubmit);

getAnimals();
