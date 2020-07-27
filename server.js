// bring in modules
const express = require('express');
const fs = require('fs');
const path = require('path');
// bring in routes...will read index.js files in each directory if no file specified
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');
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
// if client navigates to '<host>/api', use router set up in apiRoutes
app.use('/api', apiRoutes);
// if client navigates to '<host>/', use router set up in htmlRoutes
app.use('/', htmlRoutes);
// middleware to make static assets readily available, not gated behind a server endpoint
app.use(express.static('public'));






app.listen(PORT, () => {
	console.log(`API server now on port ${PORT}!`);
});
