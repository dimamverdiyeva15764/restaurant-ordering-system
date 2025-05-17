-- Create manager users
INSERT INTO users (username, password, role, active, full_name) 
VALUES ('manager1', '$2a$12$bbqCTD/CA8NJJFHeyzwdH.psT7y/5pwqEgkmIxPzP27zeGbCJ4ctK', 'MANAGER', true, 'Manager One');

-- Create waiter users
INSERT INTO users (username, password, role, active, full_name) 
VALUES ('waiter1', '$2a$12$bbqCTD/CA8NJJFHeyzwdH.psT7y/5pwqEgkmIxPzP27zeGbCJ4ctK', 'WAITER', true, 'Waiter One');

INSERT INTO users (username, password, role, active, full_name) 
VALUES ('waiter2', '$2a$12$bbqCTD/CA8NJJFHeyzwdH.psT7y/5pwqEgkmIxPzP27zeGbCJ4ctK', 'WAITER', true, 'Waiter Two');

-- Create kitchen staff users
INSERT INTO users (username, password, role, active, full_name) 
VALUES ('kitchen1', '$2a$12$bbqCTD/CA8NJJFHeyzwdH.psT7y/5pwqEgkmIxPzP27zeGbCJ4ctK', 'KITCHEN_STAFF', true, 'Kitchen Staff One');

-- Create test orders
INSERT INTO orders (order_number, table_number, status, created_at, updated_at) 
VALUES ('ORD-001', 'Table 1', 'PENDING', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert order items after orders
INSERT INTO order_items (order_id, item_name, quantity, price, special_instructions)
SELECT o.id, 'Margherita Pizza', 2, 12.99, 'Extra cheese'
FROM orders o WHERE o.order_number = 'ORD-001';

INSERT INTO order_items (order_id, item_name, quantity, price, special_instructions)
SELECT o.id, 'Caesar Salad', 1, 8.99, 'No croutons'
FROM orders o WHERE o.order_number = 'ORD-001';