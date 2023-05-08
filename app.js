const express = require('express');
const app = express();
const routes = require('./src/routes/routes');

app.use('/', routes);

const server = app.listen(3000, function() {
  console.log('Server listening on port 3000');
});
