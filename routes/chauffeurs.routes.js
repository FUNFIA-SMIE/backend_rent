const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Import PostgreSQL config

// Create - Ajouter un chauffeur
router.post('/', async (req, res) => {
  const {
    nom,
    prenom,
    telephone,
    email,
    numeroPermis,
    dateExpirationPermis,
    statut,
    vehicule_id,
    adresse,
    photo_base64,
    cin_base64,
    permis_base64
  } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO chauffeurs 
        (nom, prenom, telephone, email, numero_permis, date_expiration_permis,
         statut, vehicule_id, adresse, photo_base64, cin_base64, permis_base64)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING *`,
      [
        nom, prenom, telephone, email, numeroPermis, dateExpirationPermis,
        statut, vehicule_id || null, adresse, photo_base64, cin_base64, permis_base64
      ]
    );

    res.status(201).json({ message: 'Chauffeur ajouté', chauffeur: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Read all - Tous les chauffeurs
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM chauffeurs ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read one - Un chauffeur par ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM chauffeurs WHERE id=$1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Chauffeur non trouvé' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update - Modifier un chauffeur
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    nom,
    prenom,
    telephone,
    email,
    numeroPermis,
    dateExpirationPermis,
    statut,
    vehicule_id,
    adresse,
    photo_base64,
    cin_base64,
    permis_base64
  } = req.body;

  try {
    const result = await db.query(
      `UPDATE chauffeurs SET
        nom=$1, prenom=$2, telephone=$3, email=$4,
        numero_permis=$5, date_expiration_permis=$6,
        statut=$7, vehicule_id=$8, adresse=$9,
        photo_base64=$10, cin_base64=$11, permis_base64=$12,
        updated_at=NOW()
       WHERE id=$13
       RETURNING *`,
      [
        nom, prenom, telephone, email, numeroPermis, dateExpirationPermis,
        statut, vehicule_id || null, adresse, photo_base64, cin_base64, permis_base64, id
      ]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: 'Chauffeur non trouvé' });
    res.json({ message: 'Chauffeur mis à jour', chauffeur: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete - Supprimer un chauffeur
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM chauffeurs WHERE id=$1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Chauffeur non trouvé' });
    res.json({ message: 'Chauffeur supprimé', chauffeur: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
