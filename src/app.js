const express = require('express');
const path = require('path');
require("dotenv").config();
const handlebars = require('express-handlebars');
const apiRoutes = require('./routes/apiRoutes');
const appRoutes = require('./routes/appRoutes');

const app = express();


// Configure Handlebars
app.engine('handlebars', handlebars.engine({
  layoutsDir: './views/layouts', // Layouts directory
  defaultLayout: 'main',         // Default layout file
}));
app.set('view engine', 'handlebars');      // Set the view engine
app.set('views', './views');  

// Middleware
app.use(express.json());

app.use('/', appRoutes);
app.use('/api/v1', apiRoutes);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static('public'));

// Default route to serve the frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


module.exports = app;
