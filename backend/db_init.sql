-- Initialize database for Django E-commerce
CREATE DATABASE IF NOT EXISTS ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecommerce_db;

-- Grant privileges
GRANT ALL PRIVILEGES ON ecommerce_db.* TO 'ecommerce_user'@'%';
FLUSH PRIVILEGES;