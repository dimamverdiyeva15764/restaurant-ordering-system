-- Create Categories table
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(1000)
);

-- Create Menu Item table
CREATE TABLE IF NOT EXISTS menu_item (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    price DOUBLE NOT NULL,
    category VARCHAR(255),
    image_url VARCHAR(1000),
    available BOOLEAN DEFAULT TRUE
);

-- Create Restaurant Table table
CREATE TABLE IF NOT EXISTS restaurant_table (
    id BIGINT PRIMARY KEY,
    number INT NOT NULL,
    capacity INT NOT NULL,
    status VARCHAR(50) NOT NULL
);

-- Create Order Status table
CREATE TABLE IF NOT EXISTS order_status (
    id BIGINT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255)
);

-- Create Orders table
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    table_id BIGINT,
    status VARCHAR(50) NOT NULL,
    notes VARCHAR(1000),
    total DOUBLE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (table_id) REFERENCES restaurant_table(id)
);

-- Create Order Items table
CREATE TABLE IF NOT EXISTS order_item (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT,
    menu_item_id BIGINT,
    quantity INT DEFAULT 1,
    price DOUBLE NOT NULL,
    notes VARCHAR(500),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (menu_item_id) REFERENCES menu_item(id)
); 