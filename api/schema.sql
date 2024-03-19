-- Créer la base de données calendar
DROP DATABASE IF EXISTS calendar;
CREATE DATABASE calendar;

-- Utiliser la base de données calendar
USE calendar;

-- Créer une nouvelle table users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    type ENUM('vendor', 'buyer') NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Créer la table vendor
CREATE TABLE IF NOT EXISTS vendor (
    vendor_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    fullname VARCHAR(255) NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Créer la table buyer
CREATE TABLE IF NOT EXISTS buyer (
    buyer_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    fullname VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Créer la table appointment
CREATE TABLE IF NOT EXISTS appointment (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    type ENUM('virtual', 'physical') NOT NULL,
    location VARCHAR(255),
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    vendor_id INT NOT NULL,
    FOREIGN KEY (vendor_id) REFERENCES vendor(vendor_id),
    created TIMESTAMP NOT NULL DEFAULT NOW()
    
);

-- Créer la table de jonction appointment_buyer
CREATE TABLE IF NOT EXISTS appointment_buyer (
    appointment_id INT NOT NULL,
    buyer_id INT NOT NULL,
    FOREIGN KEY (appointment_id) REFERENCES appointment(appointment_id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_id) REFERENCES buyer(buyer_id) ON DELETE CASCADE,
    PRIMARY KEY (appointment_id, buyer_id)
);


INSERT INTO users (id, fullname, email, password, type)
VALUES 
(1, 'Buyer1', 'buyer1@example.com', 'password1', 'buyer'),
(2, 'Buyer2', 'buyer2@example.com', 'password2', 'buyer'),
(3, 'Vendor1', 'vendor1@example.com', 'password1', 'vendor'),
(4, 'Vendor2', 'vendor2@example.com', 'password2', 'vendor'),
(5, 'Vendor3', 'vendor3@example.com', 'password3', 'vendor'),
(6, 'Buyer3', 'buyer3@example.com', 'password3', 'buyer');
 
INSERT INTO vendor (user_id, fullname) SELECT id, fullname FROM users WHERE type = 'vendor';
INSERT INTO buyer (user_id, fullname, company_name) SELECT id, fullname, '' FROM users WHERE type = 'buyer';

-- Insérer les rendez-vous
INSERT INTO appointment (title, description, type, location, start_time, end_time, vendor_id)
VALUES
('Réunion de présentation', 'Présentation des nouveaux produits', 'virtual', 'Salle de conférence virtuelle', '2024-03-18 10:00:00', '2024-03-18 11:30:00', 1),
('Consultation en personne', 'Consultation individuelle', 'physical', 'Cabinet médical', '2024-03-20 14:30:00', '2024-03-20 15:30:00', 2),
('Séance de coaching', 'Séance de coaching personnel', 'physical', 'Centre de fitness', '2024-03-22 18:00:00', '2024-03-22 19:00:00', 3);
-- Associer les acheteurs aux rendez-vous
INSERT INTO appointment_buyer (appointment_id, buyer_id)
VALUES
(1, 1),
(1, 2),
(2, 2),
(2, 3),
(3, 1);  

INSERT INTO appointment (title, description, type, location, start_time, end_time, vendor_id)
VALUES ('Réunion de projet', 'Discussion sur le nouveau projet', 'virtual', 'Salle de conférence virtuelle', '2024-03-20 10:00:00', '2024-03-20 11:00:00', 4),
       ('Appel client', 'Appel pour discuter des spécifications du produit', 'virtual', 'En ligne', '2024-03-21 14:00:00', '2024-03-21 15:00:00', 4),
       ('Entretien dembauche', 'Entretien pour le poste de développeur', 'virtual', 'Skype', '2024-03-22 09:00:00', '2024-03-22 10:00:00', 4),
       ('Présentation de vente', 'Présentation des nouveaux produits', 'virtual', 'Salle de réunion virtuelle', '2024-03-23 11:00:00', '2024-03-23 12:00:00', 4),
       ('Consultation médicale', 'Consultation avec le médecin', 'physical', 'Cabinet médical', '2024-03-24 15:00:00', '2024-03-24 16:00:00', 4),
       ('Déjeuner daffaires', 'Déjeuner avec des partenaires commerciaux', 'physical', 'Restaurant', '2024-03-25 12:30:00', '2024-03-25 13:30:00', 4),
       ('Réunion déquipe', 'Réunion hebdomadaire de léquipe', 'virtual', 'Microsoft Teams', '2024-03-26 10:00:00', '2024-03-26 11:00:00', 4),
       ('Séance de formation', 'Formation sur les meilleures pratiques', 'virtual', 'En ligne', '2024-03-27 14:00:00', '2024-03-27 15:30:00', 4),
       ('Rendez-vous avec le banquier', 'Discussion sur le financement du projet', 'physical', 'Banque', '2024-03-28 09:30:00', '2024-03-28 10:30:00', 4),
       ('Appel de suivi client', 'Suivi avec un client potentiel', 'virtual', 'Skype', '2024-03-29 11:00:00', '2024-03-29 12:00:00', 4);

