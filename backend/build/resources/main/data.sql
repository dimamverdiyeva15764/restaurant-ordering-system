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