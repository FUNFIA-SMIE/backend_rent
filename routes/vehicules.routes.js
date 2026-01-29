const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Import de la config PostgreSQL

// Create - Ajouter un véhicule
router.post('/', async (req, res) => {


    const {numeroPlaque, marque, modele, annee, places, statut, carburant, transmission, image_url } = req.body;

    console.log(req.body)


    try {

        const result = await db.query(
            `INSERT INTO vehicules 
       (marque,numero_plaque, modele, annee, places, statut, carburant, transmission, image_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [marque,numeroPlaque, modele, annee, places, statut, carburant, transmission, image_url]
        );

        console.log(result)
        res.status(201).json({ message: 'Véhicule ajouté', vehicule: result.rows[0] });
    } catch (err) {
        //res.status(500).json({ error: err.message });

        console.log(err)
    }

});

// Read all - Tous les véhicules
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM vehicules ORDER BY id'); // <-- schéma rent
        res.json(result.rows);
    } catch (err) {
        console.error('🔥 ERREUR GET /vehicules :', err);
        res.status(500).json({ error: err.message });
    }
});

// Read one - Un véhicule par ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM vehicules WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Véhicule non trouvé' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update - Modifier un véhicule
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { marque, modele, annee, places, statut, carburant, transmission, image_url } = req.body;
    try {
        const result = await db.query(
            `UPDATE vehicules SET 
         marque=$1, modele=$2, annee=$3, places=$4, statut=$5, carburant=$6, transmission=$7, image_url=$8
       WHERE id=$9 RETURNING *`,
            [marque, modele, annee, places, statut, carburant, transmission, image_url, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: 'Véhicule non trouvé' });
        res.json({ message: 'Véhicule mis à jour', vehicule: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete - Supprimer un véhicule
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM vehicules WHERE id=$1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Véhicule non trouvé' });
        res.json({ message: 'Véhicule supprimé', vehicule: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
