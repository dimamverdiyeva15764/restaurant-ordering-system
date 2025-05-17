-- Categories
INSERT INTO categories (id, name, description) VALUES 
(1, 'Appetizers', 'Start your meal with something delicious'),
(2, 'Main Courses', 'Hearty entrees to satisfy your hunger'),
(3, 'Desserts', 'Sweet treats to end your meal'),
(4, 'Beverages', 'Drinks to quench your thirst');

-- Menu Items (Appetizers)
INSERT INTO menu_item (id, name, description, price, category, image_url, available) VALUES
(101, 'Garlic Bread', 'Toasted bread with garlic butter and herbs', 4.99, 'Appetizers', 'https://www.allrecipes.com/thmb/GrV_mWqrxIh9ysH8PELYfGXeSFg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/4526061-24b9144c4f734b5c9433248c952ba5e6.jpg', true),
(102, 'Mozzarella Sticks', 'Breaded mozzarella with marinara sauce', 6.99, 'Appetizers', 'https://www.allrecipes.com/thmb/BeVxirh6GosXjLy6o-YrfHSuteM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/23596-fried-mozzarella-cheese-sticks-DDMFS-4x3-842a0e27e0b34acda76d0fb57006027e.jpg', true),
(103, 'Chicken Wings', 'Crispy wings with your choice of sauce', 8.99, 'Appetizers', 'https://www.allrecipes.com/thmb/K5YqcpUzOdXQReUJOntOGiZWxJc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/233170-weekend-wings-DDMFS-4x3-01d91abe42534a7c9954f5ceb1e0f997.jpg', true);

-- Menu Items (Main Courses)
INSERT INTO menu_item (id, name, description, price, category, image_url, available) VALUES
(201, 'Margherita Pizza', 'Classic pizza with tomato sauce, mozzarella, and basil', 12.99, 'Main Courses', 'https://www.allrecipes.com/thmb/tMhYAjIOyyHYgLJRkMYOPXN5cfs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Pizza-Margherita-2000-ff105840fdbe4d818177bfcb3e840053.jpg', true),
(202, 'Cheeseburger', 'Beef patty with cheese, lettuce, tomato, and special sauce', 10.99, 'Main Courses', 'https://www.allrecipes.com/thmb/ltJFUPcaMfk-HS7Xgqz7ux-mQC4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/49409-Juiciest-Hamburgers-Ever-2000-f96594f1c2384e629db92ce6e357e2eb.jpg', true),
(203, 'Grilled Salmon', 'Fresh salmon fillet with lemon butter sauce', 16.99, 'Main Courses', 'https://www.allrecipes.com/thmb/TbFNHbcvQ1Nyako8QtbxDnOAV-Q=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/7374758-baked-salmon-with-lemon-and-dill-BIGDADDY-4x3-2fa4ef7df4d04c4b893892231f729723.jpg', true);

-- Menu Items (Desserts)
INSERT INTO menu_item (id, name, description, price, category, image_url, available) VALUES
(301, 'Chocolate Cake', 'Rich chocolate cake with ganache', 5.99, 'Desserts', 'https://www.allrecipes.com/thmb/beqM4NrWGNGbzM3U1D4OMi-m2D8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/8379761-triple-layer-chocolate-cake-with-chocolate-frostin-DDMFS-4x3-2000-d4344a929db44c69886dd50ec3ecb552.jpg', true),
(302, 'Cheesecake', 'New York style cheesecake with berry compote', 6.99, 'Desserts', 'https://www.allrecipes.com/thmb/zafIXqzbyQFIrJ84L6MnCuHB9Z8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/8274_perfect-cheesecake-ddmfs-4x3-1196-a7b75fe2db674206833d4ca817080b0c.jpg', true),
(303, 'Ice Cream', 'Three scoops of your choice of flavors', 4.99, 'Desserts', 'https://www.allrecipes.com/thmb/1bAsGASKyAEcUvbGQi6BvX_VCnk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/vanilla-ice-cream-3145-e697eca2e93842bab39fb5ac1fab8d7f.jpg', true);

-- Menu Items (Beverages)
INSERT INTO menu_item (id, name, description, price, category, image_url, available) VALUES
(401, 'Soft Drink', 'Your choice of cola, lemon-lime, or root beer', 2.49, 'Beverages', 'https://images.immediate.co.uk/production/volatile/sites/30/2021/05/soft-drinks-74b7698.jpg?quality=90&resize=440,400', true),
(402, 'Iced Tea', 'Freshly brewed and chilled', 2.49, 'Beverages', 'https://www.allrecipes.com/thmb/u_UOQYhTyBU-NwzHOVJ05pG1Kfw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/218364-southern-sweet-tea-DDMFS-4x3-0178-19ea0b42c56b4abfa02d204e2d98b861.jpg', true),
(403, 'Coffee', 'Regular or decaf', 2.29, 'Beverages', 'https://www.allrecipes.com/thmb/Oag1_0cRg-_wmmHH0JygYFrwTLI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1225598339-2000-1c95377ac156498eb1e74a503a9dbbb2.jpg', true);

-- Tables
INSERT INTO restaurant_table (id, number, capacity, status) VALUES
(1, 1, 2, 'AVAILABLE'),
(2, 2, 4, 'AVAILABLE'),
(3, 3, 6, 'AVAILABLE'),
(4, 4, 8, 'AVAILABLE');

-- Initial Order Status Types
INSERT INTO order_status (id, name, description) VALUES
(1, 'PENDING', 'Order has been received but not yet processed'),
(2, 'PREPARING', 'Kitchen is preparing the order'),
(3, 'READY', 'Order is ready for pickup/delivery'),
(4, 'DELIVERED', 'Order has been delivered to the customer'),
(5, 'CANCELLED', 'Order has been cancelled'); 