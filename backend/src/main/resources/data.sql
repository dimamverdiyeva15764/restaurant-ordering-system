-- Create manager users
INSERT INTO users (id, username, password, role, active, full_name) 
VALUES (1, 'manager1', '$2a$12$bbqCTD/CA8NJJFHeyzwdH.psT7y/5pwqEgkmIxPzP27zeGbCJ4ctK', 'MANAGER', true, 'Manager One');

-- Create waiter users
INSERT INTO users (id, username, password, role, active, full_name) 
VALUES (2, 'waiter1', '$2a$12$bbqCTD/CA8NJJFHeyzwdH.psT7y/5pwqEgkmIxPzP27zeGbCJ4ctK', 'WAITER', true, 'Waiter One');

INSERT INTO users (id, username, password, role, active, full_name) 
VALUES (3, 'waiter2', '$2a$12$bbqCTD/CA8NJJFHeyzwdH.psT7y/5pwqEgkmIxPzP27zeGbCJ4ctK', 'WAITER', true, 'Waiter Two');

-- Create kitchen staff users
INSERT INTO users (id, username, password, role, active, full_name) 
VALUES (4, 'kitchen1', '$2a$12$bbqCTD/CA8NJJFHeyzwdH.psT7y/5pwqEgkmIxPzP27zeGbCJ4ctK', 'KITCHEN_STAFF', true, 'Kitchen Staff One');

-- Insert menu categories
INSERT INTO menu_categories (name, description) VALUES
('Appetizers', 'Start your meal with these delicious options'),
('Main Courses', 'Hearty and satisfying main dishes'),
('Desserts', 'Sweet treats to end your meal'),
('Beverages', 'Refreshing drinks and beverages');

-- Insert sample menu items
INSERT INTO menu_items (category_id, name, description, price) VALUES
(1, 'Caesar Salad', 'Fresh romaine lettuce with caesar dressing', 8.99),
(1, 'Garlic Bread', 'Toasted bread with garlic butter', 4.99),
(2, 'Grilled Salmon', 'Fresh salmon with seasonal vegetables', 24.99),
(2, 'Beef Steak', 'Premium cut beef with mushroom sauce', 29.99),
(3, 'Chocolate Cake', 'Rich chocolate layer cake', 6.99),
(3, 'Ice Cream', 'Vanilla ice cream with chocolate sauce', 4.99),
(4, 'Soft Drinks', 'Various carbonated beverages', 2.99),
(4, 'Fresh Orange Juice', 'Freshly squeezed orange juice', 3.99);

-- Insert sample restaurant tables
INSERT INTO restaurant_tables (table_number) VALUES
('T1'),
('T2'),
('T3'),
('T4'),
('T5');

-- Insert sample users (password is 'password' - in real app should be encrypted)
INSERT INTO users (username, password, full_name, role) VALUES
('kitchen1', '$2a$10$5PxS1CTqrr1O8kxE9Vw7OePx.hk3VLR.qwk/NoZ7w8fPD5ZYrCU6W', 'Kitchen Staff 1', 'ROLE_KITCHEN'),
('waiter1', '$2a$10$5PxS1CTqrr1O8kxE9Vw7OePx.hk3VLR.qwk/NoZ7w8fPD5ZYrCU6W', 'Waiter 1', 'ROLE_WAITER'),
('manager1', '$2a$10$5PxS1CTqrr1O8kxE9Vw7OePx.hk3VLR.qwk/NoZ7w8fPD5ZYrCU6W', 'Manager 1', 'ROLE_MANAGER');