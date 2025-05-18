-- Clear existing data first
DELETE FROM menu_items;
DELETE FROM menu_categories;

-- Reset sequences
ALTER SEQUENCE IF EXISTS menu_categories_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS menu_items_id_seq RESTART WITH 1;

-- Insert menu categories
INSERT INTO menu_categories (name, description, display_order, active) 
VALUES ('Main Courses', 'Our signature main dishes', 1, true);

INSERT INTO menu_categories (name, description, display_order, active) 
VALUES ('Starters', 'Perfect beginnings to your meal', 2, true);

INSERT INTO menu_categories (name, description, display_order, active) 
VALUES ('Desserts', 'Sweet endings to your dining experience', 3, true);

-- Insert menu items for Main Courses
INSERT INTO menu_items (name, description, price, category_id, image_url, available, preparation_time, calories, ingredients, allergens, is_vegetarian, is_vegan, is_gluten_free) 
SELECT 'Classic Margherita Pizza', 
       'Fresh tomatoes, mozzarella, basil, and olive oil on our signature crust',
       14.99,
       id,
       'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca',
       true,
       20,
       800,
       'Pizza dough, tomatoes, mozzarella cheese, fresh basil, olive oil',
       'Gluten, dairy',
       true,
       false,
       false
FROM menu_categories WHERE name = 'Main Courses';

INSERT INTO menu_items (name, description, price, category_id, image_url, available, preparation_time, calories, ingredients, allergens, is_vegetarian, is_vegan, is_gluten_free) 
SELECT 'Spicy Thai Curry', 
       'Aromatic curry with coconut milk, vegetables, and your choice of protein',
       16.99,
       id,
       'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd',
       true,
       25,
       650,
       'Coconut milk, curry paste, vegetables, choice of protein, rice',
       'Shellfish (optional)',
       false,
       false,
       true
FROM menu_categories WHERE name = 'Main Courses';

INSERT INTO menu_items (name, description, price, category_id, image_url, available, preparation_time, calories, ingredients, allergens, is_vegetarian, is_vegan, is_gluten_free) 
SELECT 'Pad Thai', 
       'Stir-fried rice noodles with tofu, shrimp, peanuts, and tamarind sauce',
       15.99,
       id,
       'https://images.unsplash.com/photo-1559314809-0d155014e29e',
       true,
       20,
       700,
       'Rice noodles, tofu, shrimp, peanuts, eggs, bean sprouts, tamarind sauce',
       'Shellfish, peanuts, eggs',
       false,
       false,
       true
FROM menu_categories WHERE name = 'Main Courses';

-- Insert menu items for Starters
INSERT INTO menu_items (name, description, price, category_id, image_url, available, preparation_time, calories, ingredients, allergens, is_vegetarian, is_vegan, is_gluten_free) 
SELECT 'Mediterranean Salad', 
       'Fresh mixed greens, feta cheese, olives, and house-made vinaigrette',
       10.99,
       id,
       'https://images.unsplash.com/photo-1540420773420-3366772f4999',
       true,
       10,
       350,
       'Mixed greens, feta cheese, kalamata olives, cucumber, tomatoes, red onion, vinaigrette',
       'Dairy',
       true,
       false,
       true
FROM menu_categories WHERE name = 'Starters';

INSERT INTO menu_items (name, description, price, category_id, image_url, available, preparation_time, calories, ingredients, allergens, is_vegetarian, is_vegan, is_gluten_free) 
SELECT 'Crispy Calamari', 
       'Lightly battered calamari served with marinara sauce and lemon',
       12.99,
       id,
       'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0',
       true,
       15,
       450,
       'Squid, flour, herbs, marinara sauce, lemon',
       'Shellfish, gluten',
       false,
       false,
       false
FROM menu_categories WHERE name = 'Starters';

INSERT INTO menu_items (name, description, price, category_id, image_url, available, preparation_time, calories, ingredients, allergens, is_vegetarian, is_vegan, is_gluten_free) 
SELECT 'Fresh Spring Rolls', 
       'Rice paper rolls with vegetables, herbs, and shrimp, served with peanut sauce',
       9.99,
       id,
       'https://images.unsplash.com/photo-1553163675-71dd0e489f0f',
       true,
       15,
       300,
       'Rice paper, shrimp, rice noodles, vegetables, herbs, peanut sauce',
       'Shellfish, peanuts',
       false,
       false,
       true
FROM menu_categories WHERE name = 'Starters';

-- Insert menu items for Desserts
INSERT INTO menu_items (name, description, price, category_id, image_url, available, preparation_time, calories, ingredients, allergens, is_vegetarian, is_vegan, is_gluten_free) 
SELECT 'Chocolate Lava Cake', 
       'Warm chocolate cake with a molten center, served with vanilla ice cream',
       8.99,
       id,
       'https://images.unsplash.com/photo-1624353365286-3f8d62daad51',
       true,
       15,
       550,
       'Chocolate, flour, eggs, butter, vanilla ice cream',
       'Dairy, eggs, gluten',
       true,
       false,
       false
FROM menu_categories WHERE name = 'Desserts';

INSERT INTO menu_items (name, description, price, category_id, image_url, available, preparation_time, calories, ingredients, allergens, is_vegetarian, is_vegan, is_gluten_free) 
SELECT 'Tiramisu', 
       'Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream',
       7.99,
       id,
       'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9',
       true,
       0,
       400,
       'Ladyfingers, mascarpone cheese, coffee, cocoa powder, eggs',
       'Dairy, eggs, gluten',
       true,
       false,
       false
FROM menu_categories WHERE name = 'Desserts'; 