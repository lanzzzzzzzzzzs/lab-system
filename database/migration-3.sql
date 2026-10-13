-- =====================================================
-- Update for a database that is ALREADY imported (after migration-2.sql).
-- Run it once: phpMyAdmin -> lab_borrowing -> SQL tab -> paste -> Go.
-- =====================================================

USE lab_borrowing;

-- Active or Suspended accounts (Manage users page)
ALTER TABLE users
  ADD COLUMN status ENUM('Active', 'Suspended') NOT NULL DEFAULT 'Active' AFTER role;

-- How many units of the item were requested (no more limit, any quantity)
ALTER TABLE borrow_requests
  ADD COLUMN quantity INT NOT NULL DEFAULT 1 AFTER equipment_id;

-- Log of every attempt to create an administrator account
CREATE TABLE admin_attempts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL,
  success TINYINT(1) NOT NULL,
  ip_address VARCHAR(45) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
