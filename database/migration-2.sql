-- =====================================================
-- Update for a database that is ALREADY imported.
-- Run it once: phpMyAdmin -> lab_borrowing -> SQL tab -> paste -> Go.
-- (A fresh import of database.sql already includes these changes.)
-- =====================================================

USE lab_borrowing;

-- The day an administrator approved or declined a request
ALTER TABLE borrow_requests
  ADD COLUMN date_reviewed DATE NULL AFTER return_date;

-- Messages sent from the Contact page
CREATE TABLE support_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  topic VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;
