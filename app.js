const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

// Import routes
const vehiculeRoutes = require('./routes/vehicules.routes');
const chauffeurRoutes = require('./routes/chauffeurs.routes');
const offresRoutes = require('./routes/offres.routes');
const reservationRoutes = require('./routes/reservation.routes');

const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/vehicules', vehiculeRoutes);
app.use('/chauffeur', chauffeurRoutes);
app.use('/offres', offresRoutes);
app.use('/reservations', reservationRoutes);

// Gestion des erreurs
app.use((req, res) => {
  res.status(404).send('Page non trouvée');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Erreur serveur');
});

// PORT dynamique pour Render ou local
const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
});
