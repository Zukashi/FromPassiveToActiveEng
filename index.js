const express = require('express');
const { engine } = require('express-handlebars');
const methodOverride = require('method-override');
const { homeRouter } = require('./routes/home');
const { handlebarsHelpers } = require('./utils/handlebars-helpers');

const app = express();

app.use(methodOverride('_method'));

app.use(express.urlencoded({
  extended: true,
}));

app.use(express.static('public'));
app.use(express.json());

app.engine('.hbs', engine({
  extname: '.hbs',
  helpers: handlebarsHelpers,
}));
app.set('view engine', '.hbs');

app.use('/', homeRouter);

app.listen(3000, 'localhost');
