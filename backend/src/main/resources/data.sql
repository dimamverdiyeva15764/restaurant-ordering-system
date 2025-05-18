-- Insert users
INSERT INTO users (username, password, role, active, full_name) 
VALUES 
    ('manager1', '$2a$12$bbqCTD/CA8NJJFHeyzwdH.psT7y/5pwqEgkmIxPzP27zeGbCJ4ctK', 'MANAGER', true, 'Manager One'),
    ('waiter1', '$2a$12$bbqCTD/CA8NJJFHeyzwdH.psT7y/5pwqEgkmIxPzP27zeGbCJ4ctK', 'WAITER', true, 'Waiter One'),
    ('waiter2', '$2a$12$bbqCTD/CA8NJJFHeyzwdH.psT7y/5pwqEgkmIxPzP27zeGbCJ4ctK', 'WAITER', true, 'Waiter Two'),
    ('kitchen1', '$2a$12$bbqCTD/CA8NJJFHeyzwdH.psT7y/5pwqEgkmIxPzP27zeGbCJ4ctK', 'KITCHEN_STAFF', true, 'Kitchen Staff One');

-- Insert menu categories
INSERT INTO menu_categories (name, description, active, display_order) 
VALUES 
    ('Appetizers', 'Start your meal with these delicious options', true, 1),
    ('Main Course', 'Hearty and satisfying main dishes', true, 2),
    ('Pasta', 'Fresh homemade pasta dishes', true, 3),
    ('Pizza', 'Wood-fired authentic Italian pizzas', true, 4),
    ('Salads', 'Fresh and healthy salad options', true, 5),
    ('Desserts', 'Sweet treats to end your meal', true, 6),
    ('Beverages', 'Refreshing drinks and beverages', true, 7);

-- Insert menu items
INSERT INTO menu_items (name, description, price, category_id, image_url, available, is_vegetarian, is_vegan, is_gluten_free, spicy_level) 
VALUES 
    -- Appetizers
    ('Bruschetta', 'Toasted bread with fresh tomatoes, garlic, and basil', 8.99, 
        (SELECT id FROM menu_categories WHERE name = 'Appetizers'), 
        'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f',
        true, true, true, false, 0),
    ('Calamari', 'Crispy fried squid with marinara sauce', 12.99,
        (SELECT id FROM menu_categories WHERE name = 'Appetizers'),
        'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0',
        true, false, false, true, 0),
    ('Garlic Bread', 'Fresh bread with garlic butter and herbs', 6.99,
        (SELECT id FROM menu_categories WHERE name = 'Appetizers'),
        'https://images.unsplash.com/photo-1619535860434-ba1d8fa72248',
        true, true, false, false, 0),

    -- Main Course
    ('Grilled Salmon', 'Fresh salmon with lemon herb sauce', 24.99,
        (SELECT id FROM menu_categories WHERE name = 'Main Course'),
        'https://images.unsplash.com/photo-1485921325833-c519f76c4927',
        true, false, false, true, 0),
    ('Chicken Marsala', 'Chicken breast in marsala wine sauce', 22.99,
        (SELECT id FROM menu_categories WHERE name = 'Main Course'),
        'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d',
        true, false, false, false, 0),
    ('Vegetable Stir Fry', 'Mixed vegetables in Asian sauce', 18.99,
        (SELECT id FROM menu_categories WHERE name = 'Main Course'),
        'https://images.unsplash.com/photo-1512058564366-18510be2db19',
        true, true, true, true, 2),

    -- Pasta
    ('Spaghetti Carbonara', 'Classic carbonara with pancetta', 16.99,
        (SELECT id FROM menu_categories WHERE name = 'Pasta'),
        'https://images.unsplash.com/photo-1612874742237-6526221588e3',
        true, false, false, false, 0),
    ('Penne Arrabbiata', 'Spicy tomato sauce with garlic', 14.99,
        (SELECT id FROM menu_categories WHERE name = 'Pasta'),
        'https://images.unsplash.com/photo-1563379926898-05f4575a45d8',
        true, true, true, false, 3),
    ('Fettuccine Alfredo', 'Creamy parmesan sauce', 15.99,
        (SELECT id FROM menu_categories WHERE name = 'Pasta'),
        'https://images.unsplash.com/photo-1645112411341-6c4fd023714a',
        true, true, false, false, 0),

    -- Pizza
    ('Margherita', 'Fresh tomatoes, mozzarella, and basil', 14.99,
        (SELECT id FROM menu_categories WHERE name = 'Pizza'),
        'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca',
        true, true, false, false, 0),
    ('Pepperoni', 'Classic pepperoni pizza', 16.99,
        (SELECT id FROM menu_categories WHERE name = 'Pizza'),
        'https://images.unsplash.com/photo-1628840042765-356cda07504e',
        true, false, false, false, 1),
    ('Vegetarian', 'Assorted vegetables and mushrooms', 15.99,
        (SELECT id FROM menu_categories WHERE name = 'Pizza'),
        'https://images.unsplash.com/photo-1511689660979-10d2b1aada49',
        true, true, true, false, 0),

    -- Salads
    ('Caesar Salad', 'Romaine lettuce with caesar dressing', 12.99,
        (SELECT id FROM menu_categories WHERE name = 'Salads'),
        'https://images.unsplash.com/photo-1550304943-4f24f54ddde9',
        true, true, false, true, 0),
    ('Greek Salad', 'Mixed greens with feta and olives', 13.99,
        (SELECT id FROM menu_categories WHERE name = 'Salads'),
        'https://images.unsplash.com/photo-1540420773420-3366772f4999',
        true, true, true, true, 0),
    ('Quinoa Bowl', 'Healthy quinoa with roasted vegetables', 14.99,
        (SELECT id FROM menu_categories WHERE name = 'Salads'),
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
        true, true, true, true, 0),

    -- Desserts
    ('Tiramisu', 'Classic Italian coffee-flavored dessert', 8.99,
        (SELECT id FROM menu_categories WHERE name = 'Desserts'),
        'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9',
        true, true, false, false, 0),
    ('Chocolate Cake', 'Rich chocolate layer cake', 7.99,
        (SELECT id FROM menu_categories WHERE name = 'Desserts'),
        'https://images.unsplash.com/photo-1578985545062-69928b1d9587',
        true, true, false, false, 0),
    ('Fruit Sorbet', 'Assorted fruit sorbets', 6.99,
        (SELECT id FROM menu_categories WHERE name = 'Desserts'),
        'https://images.unsplash.com/photo-1488900128323-21503983a07e',
        true, true, true, true, 0),

    -- Beverages
    ('Sparkling Water', 'San Pellegrino 750ml', 4.99,
        (SELECT id FROM menu_categories WHERE name = 'Beverages'),
        'https://images.unsplash.com/photo-1603394557311-0c71296c5178',
        true, true, true, true, 0),
    ('Fresh Lemonade', 'Homemade lemonade', 3.99,
        (SELECT id FROM menu_categories WHERE name = 'Beverages'),
        'https://images.unsplash.com/photo-1621263764928-df1444c5e859',
        true, true, true, true, 0),
    ('Italian Soda', 'Assorted flavors', 3.99,
        (SELECT id FROM menu_categories WHERE name = 'Beverages'),
        'https://images.unsplash.com/photo-1558642891-54be180ea339',
        true, true, true, true, 0);

-- Insert restaurant tables
INSERT INTO restaurant_tables (table_number, capacity, status)
VALUES 
    ('T1', 4, 'AVAILABLE'),
    ('T2', 4, 'AVAILABLE'),
    ('T3', 6, 'AVAILABLE'),
    ('T4', 2, 'AVAILABLE'),
    ('T5', 8, 'AVAILABLE');

-- Insert sample order
INSERT INTO orders (order_number, table_number, status, created_at, updated_at)
VALUES ('ORD-001', 'T1', 'PENDING', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert sample order items
INSERT INTO order_items (order_id, menu_item_id, item_name, quantity, price, special_instructions)
SELECT o.id, m.id, m.name, 2, m.price, 'Extra cheese'
FROM orders o, menu_items m 
WHERE o.order_number = 'ORD-001' AND m.name = 'Margherita';

INSERT INTO order_items (order_id, menu_item_id, item_name, quantity, price, special_instructions)
SELECT o.id, m.id, m.name, 1, m.price, 'No croutons'
FROM orders o, menu_items m 
WHERE o.order_number = 'ORD-001' AND m.name = 'Caesar Salad';