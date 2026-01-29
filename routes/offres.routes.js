const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Connexion PostgreSQL

/**
 * ==========================
 *  CREATE - Ajouter une offre
 * ==========================
 */
router.post('/', async (req, res) => {
  const {
    categorieid,
    nom,
    description,
    prix,
    unite,
    image_base64,
    statut
  } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO offres
      (categorieid, nom, description, prix, unite, image_base64, statut)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [
        categorieid,
        nom,
        description,
        prix,
        unite || 'Par trajet',
        image_base64,
        statut || 'active'
      ]
    );

    res.status(201).json({
      message: 'Offre créée avec succès',
      offre: result.rows[0]
    });
  } catch (err) {
    console.error('Erreur création offre:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * ==========================
 *  READ - Toutes les offres
 * ==========================
 */
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM offres ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Erreur liste offres:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * ==========================
 *  READ - Une offre par ID
 * ==========================
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      'SELECT * FROM offres WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Offre non trouvée' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erreur lecture offre:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * ==========================
 *  UPDATE - Modifier une offre
 * ==========================
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    categorieid,
    nom,
    description,
    prix,
    unite,
    image_base64,
    statut
  } = req.body;

  try {
    const result = await db.query(
      `UPDATE offres SET
        categorieid = $1,
        nom = $2,
        description = $3,
        prix = $4,
        unite = $5,
        image_base64 = $6,
        statut = $7,
        updated_at = now()
      WHERE id = $8
      RETURNING *`,
      [
        categorieid,
        nom,
        description,
        prix,
        unite,
        image_base64,
        statut,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Offre non trouvée' });
    }

    res.json({
      message: 'Offre mise à jour avec succès',
      offre: result.rows[0]
    });
  } catch (err) {
    console.error('Erreur mise à jour offre:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * ==========================
 *  DELETE - Supprimer une offre
 * ==========================
 * ⚠️ Référencée par reservations
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      'DELETE FROM offres WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Offre non trouvée' });
    }

    res.json({
      message: 'Offre supprimée avec succès',
      offre: result.rows[0]
    });
  } catch (err) {
    console.error('Erreur suppression offre:', err);
    res.status(500).json({
      error: 'Impossible de supprimer cette offre (elle est utilisée dans des réservations)'
    });
  }
});

module.exports = router;
