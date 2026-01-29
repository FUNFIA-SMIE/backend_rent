const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Connexion PostgreSQL

/**
 * ==========================
 * CREATE - Ajouter une réservation
 * ==========================
 */
router.post('/', async (req, res) => {
  const {
    id_client,
    id_vehicule,
    id_offre,
    date_reservation,
    statut
  } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO reservations
      (id_client, id_vehicule, id_offre, date_reservation, statut)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *`,
      [
        id_client,
        id_vehicule,
        id_offre,
        date_reservation || new Date(),
        statut || 'en_attente'
      ]
    );

    res.status(201).json({
      message: 'Réservation créée avec succès',
      reservation: result.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Erreur lors de la création de la réservation (vérifie les IDs)'
    });
  }
});

/**
 * ==========================
 * READ - Toutes les réservations
 * ==========================
 */
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        r.id,
        r.date_reservation,
        r.statut,
        r.created_at,
        r.updated_at,

        c.id AS client_id,
        c.nom AS client_nom,

        v.id AS vehicule_id,
        v.marque,
        v.modele,
        v.numero_plaque,

        o.id AS offre_id,
        o.nom AS offre_nom,
        o.prix

      FROM reservations r
      JOIN clients c ON c.id = r.id_client
      JOIN vehicules v ON v.id = r.id_vehicule
      JOIN offres o ON o.id = r.id_offre
      ORDER BY r.created_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * ==========================
 * READ - Une réservation par ID
 * ==========================
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      'SELECT * FROM reservations WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ==========================
 * UPDATE - Modifier une réservation
 * ==========================
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    id_client,
    id_vehicule,
    id_offre,
    date_reservation,
    statut
  } = req.body;

  try {
    const result = await db.query(
      `UPDATE reservations SET
        id_client = $1,
        id_vehicule = $2,
        id_offre = $3,
        date_reservation = $4,
        statut = $5,
        updated_at = now()
      WHERE id = $6
      RETURNING *`,
      [
        id_client,
        id_vehicule,
        id_offre,
        date_reservation,
        statut,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

    res.json({
      message: 'Réservation mise à jour avec succès',
      reservation: result.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Erreur lors de la mise à jour (vérifie les clés étrangères)'
    });
  }
});

/**
 * ==========================
 * DELETE - Supprimer une réservation
 * ==========================
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      'DELETE FROM reservations WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

    res.json({
      message: 'Réservation supprimée avec succès',
      reservation: result.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
