-- =====================================================
-- LabTrack - Laboratory Borrowing System
-- Import this file in phpMyAdmin (Import tab) to create the database.
-- =====================================================

CREATE DATABASE IF NOT EXISTS lab_borrowing
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE lab_borrowing;


-- ---------- USERS (students and administrators) ----------
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,   -- saved with password_hash(), never as plain text
  role ENUM('student', 'admin') NOT NULL DEFAULT 'student',
  student_id VARCHAR(30) NULL,
  department VARCHAR(100) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;


-- ---------- CATEGORIES (Optical, Glassware, Measuring...) ----------
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;


-- ---------- EQUIPMENT ----------
CREATE TABLE equipment (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) NOT NULL UNIQUE,
  category_id INT NOT NULL,
  total_units INT NOT NULL DEFAULT 1,
  available_units INT NOT NULL DEFAULT 1,
  condition_status ENUM('Operational', 'Inspection', 'Maintenance') NOT NULL DEFAULT 'Operational',
  icon VARCHAR(20) NOT NULL DEFAULT 'cube',      -- icon name used by the front end
  color VARCHAR(20) NOT NULL DEFAULT 'indigo',   -- card color used by the front end
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE=InnoDB;


-- ---------- BORROW REQUESTS (one row = one student asking for one item) ----------
CREATE TABLE borrow_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  equipment_id INT NOT NULL,
  date_requested TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  return_date DATE NOT NULL,        -- the date the student promised to return it
  date_returned DATE NULL,          -- filled in when the item is actually returned
  status ENUM('Pending', 'Approved', 'Declined', 'Returned') NOT NULL DEFAULT 'Pending',
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (equipment_id) REFERENCES equipment(id)
) ENGINE=InnoDB;


-- ---------- SAMPLE DATA ----------
INSERT INTO categories (name) VALUES
  ('Optical'),
  ('Glassware'),
  ('Measuring');

INSERT INTO equipment (name, code, category_id, total_units, available_units, condition_status, icon, color) VALUES
  ('Compound Microscope',  'MIC-204', 1, 12,  8, 'Operational', 'microscope',  'indigo'),
  ('Erlenmeyer Flask Set', 'GLS-118', 2, 20, 14, 'Operational', 'flask',       'cyan'),
  ('Digital Thermometer',  'MEA-072', 3,  8,  3, 'Operational', 'thermometer', 'amber'),
  ('Precision Balance',    'MEA-093', 3,  6,  0, 'Inspection',  'cube',        'violet'),
  ('Beaker Set · 6 pcs',   'GLS-042', 2, 10,  9, 'Operational', 'beaker',      'emerald'),
  ('Stereo Microscope',    'MIC-217', 1,  5,  2, 'Operational', 'microscope',  'rose');

-- Users are NOT inserted here on purpose: passwords must be hashed by PHP,
-- so accounts will be created through the registration page.
