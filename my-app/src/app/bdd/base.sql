-- 1. Category
INSERT INTO "Category" (id_Category, name_Category, created_at) VALUES
(1, 'Fruits & Légumes', '2024-01-01 10:00:00'),
(2, 'Viandes & Charcuteries', '2024-01-01 10:00:00'),
(3, 'Poissons & Fruits de mer', '2024-01-01 10:00:00'),
(4, 'Boissons & Alcools', '2024-01-01 10:00:00'),
(5, 'Épicerie salée', '2024-01-01 10:00:00'),
(6, 'Épicerie sucrée', '2024-01-01 10:00:00'),
(7, 'Produits laitiers', '2024-01-01 10:00:00'),
(8, 'Plats traiteur', '2024-01-01 10:00:00');

-- 2. Label
INSERT INTO "Label" (id_Label, name_Label, created_at) VALUES
(1, 'BIO', '2024-01-01 10:00:00'),
(2, 'Bleu Blanc Coeur', '2024-01-01 10:00:00'),
(3, 'Pêche durable MSC', '2024-01-01 10:00:00'),
(4, 'Élu produit de l''année', '2024-01-01 10:00:00'),
(5, 'Produit de montagne', '2024-01-01 10:00:00'),
(6, 'Label Rouge', '2024-01-01 10:00:00'),
(7, 'Appellation d''origine contrôlée', '2024-01-01 10:00:00'),
(8, 'Demeter', '2024-01-01 10:00:00');

-- 3. Product
INSERT INTO "Product" (id_Product, name_Product, img_Product, price, description, id_Category, created_at) VALUES
(1, 'Bourriche d''huîtres "Authentique" de Paimpol', '/images/products/product1.png', 24.90, 'Huîtres fraîches de Paimpol', 3, '2024-01-01 10:00:00'),
(2, 'Confit de vin rouge Bio', '/images/products/product2.png', 6.90, 'Délicieux confit au vin rouge biologique', 4, '2024-01-01 10:00:00'),
(3, 'Sorbet Pomme Verte 0.5L', '/images/products/product3.png', 4.50, 'Sorbet rafraîchissant à la pomme verte', 6, '2024-01-01 10:00:00'),
(4, 'Confit de vin rouge Bio', '/images/products/product4.png', 6.90, 'Confit de vin rouge produit de saison', 4, '2024-01-01 10:00:00'),
(5, 'Confit de vin rouge Bio', '/images/products/product5.png', 7.50, 'Confit de vin rouge au miel', 4, '2024-01-01 10:00:00');

-- 4. Product_Label
INSERT INTO "Product_Label" (id, id_Product, id_Label, created_at) VALUES
(1, 2, 1, '2024-01-01 10:00:00'),
(2, 2, 6, '2024-01-01 10:00:00'),
(3, 3, 1, '2024-01-01 10:00:00'),
(4, 4, 1, '2024-01-01 10:00:00'),
(5, 5, 1, '2024-01-01 10:00:00');