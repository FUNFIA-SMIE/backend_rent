-- Structure de base de données pour services de transport

-- Table principale des catégories de services
CREATE TABLE categories_services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    description TEXT,
    actif BOOLEAN DEFAULT TRUE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des services/offres
CREATE TABLE services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    categorie_id INT,
    nom VARCHAR(200) NOT NULL,
    description TEXT,
    prix_base DECIMAL(10,2),
    unite_prix VARCHAR(50), -- 'par trajet', 'par jour', 'par heure'
    actif BOOLEAN DEFAULT TRUE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categorie_id) REFERENCES categories_services(id)
);

-- Table des types de véhicules
CREATE TABLE vehicules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type VARCHAR(100) NOT NULL, -- Berline, SUV, Minibus, etc.
    capacite_passagers INT,
    prix_supplement DECIMAL(10,2),
    disponible BOOLEAN DEFAULT TRUE
);

-- Table de liaison services-véhicules
CREATE TABLE services_vehicules (
    service_id INT,
    vehicule_id INT,
    PRIMARY KEY (service_id, vehicule_id),
    FOREIGN KEY (service_id) REFERENCES services(id),
    FOREIGN KEY (vehicule_id) REFERENCES vehicules(id)
);

-- Insertion des catégories
INSERT INTO categories_services (nom, description) VALUES
('Location de véhicule', 'Service de location de véhicules avec ou sans chauffeur'),
('Transfert Aéroport', 'Services de transfert depuis/vers l''aéroport'),
('Circuit Ville', 'Déplacements et courses dans la ville d''Antananarivo'),
('Circuit Professionnel', 'Services pour rendez-vous d''affaires et événements professionnels'),
('Circuit Événementiel', 'Services pour événements familiaux et cérémonies');

-- Insertion des services
INSERT INTO services (categorie_id, nom, description, unite_prix) VALUES
-- Location de véhicule
(1, 'Location véhicule journalière', 'Location de véhicule pour une journée complète', 'par jour'),
(1, 'Location véhicule avec chauffeur', 'Location avec chauffeur professionnel', 'par jour'),

-- Transferts aéroport
(2, 'Transfert Ville → Aéroport', 'Transfert depuis la ville ou hôtel vers l''aéroport', 'par trajet'),
(2, 'Transfert Aéroport → Ville', 'Transfert depuis l''aéroport vers la ville ou hôtel', 'par trajet'),

-- Circuits ville
(3, 'Course en ville Antananarivo', 'Déplacement ponctuel dans la ville', 'par course'),
(3, 'Circuit touristique ville', 'Visite guidée de la ville', 'par jour'),

-- Circuits professionnels
(4, 'Circuit rendez-vous d''affaires', 'Service pour enchaîner plusieurs rendez-vous professionnels', 'par demi-journée'),
(4, 'Transport réunion/séminaire', 'Service de transport pour réunions, séminaires, ateliers, conférences', 'par événement'),

-- Circuits événementiels
(5, 'Transport mariage', 'Service de transport pour mariage et cortège', 'par événement'),
(5, 'Transport événement familial', 'Service pour baptême, anniversaire, etc.', 'par événement');

-- Insertion des types de véhicules
INSERT INTO vehicules (type, capacite_passagers) VALUES
('Berline standard', 4),
('Berline luxe', 4),
('SUV', 6),
('Minibus', 12),
('Van', 8);

-- Exemples de requêtes utiles

-- Afficher tous les services par catégorie
SELECT c.nom AS categorie, s.nom AS service, s.description
FROM categories_services c
LEFT JOIN services s ON c.id = s.categorie_id
WHERE c.actif = TRUE AND s.actif = TRUE
ORDER BY c.id, s.id;

-- Rechercher un service spécifique
SELECT s.*, c.nom AS categorie
FROM services s
JOIN categories_services c ON s.categorie_id = c.id
WHERE s.nom LIKE '%aéroport%';

-- Compter les services par catégorie
SELECT c.nom, COUNT(s.id) AS nombre_services
FROM categories_services c
LEFT JOIN services s ON c.id = s.categorie_id
GROUP BY c.id, c.nom;