var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
var vehiculeRoutes = require('./routes/vehicules.routes');
var chauffeurRoutes = require('./routes/chauffeurs.routes');
var offresRoutes = require('./routes/offres.routes');
var reservationRoutes = require('./routes/reservation.routes');

var app = express();
app.use(cors());

app.use(express.json({ limit: '10mb' })); // <-- augmenter la limite
app.use(express.urlencoded({ extended: false, limit: '10mb' })); // pour les formulaires
// Middleware
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/vehicules', vehiculeRoutes);
app.use('/chauffeur', chauffeurRoutes);
app.use('/offres', offresRoutes);
app.use('/reservations', reservationRoutes);

// Erreurs
app.use(function(req, res, next) {
  res.status(404).send('Page non trouvée');
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Erreur serveur');
});

module.exports = app;
