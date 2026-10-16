-- =====================================================
-- Update for a database that is ALREADY imported (after migration-3.sql).
-- Run it once: phpMyAdmin -> lab_borrowing -> SQL tab -> paste -> Go.
-- =====================================================

USE lab_borrowing;

-- A third kind of account: professor
ALTER TABLE users
  MODIFY role ENUM('student', 'professor', 'admin') NOT NULL DEFAULT 'student';

-- A request now has more steps and class details:
-- Pending (waiting for the professor) -> Authorized (professor confirmed)
-- -> Approved (laboratory released it) -> Returned.   Declined can happen on the way.
ALTER TABLE borrow_requests
  MODIFY status ENUM('Pending', 'Authorized', 'Approved', 'Declined', 'Returned') NOT NULL DEFAULT 'Pending';

ALTER TABLE borrow_requests
  ADD COLUMN professor_id INT NULL AFTER equipment_id,
  ADD COLUMN course_code VARCHAR(20) NULL AFTER quantity,
  ADD COLUMN course_name VARCHAR(100) NULL AFTER course_code,
  ADD COLUMN schedule VARCHAR(100) NULL AFTER course_name,
  ADD COLUMN purpose VARCHAR(200) NULL AFTER schedule,
  ADD COLUMN date_needed DATE NULL AFTER date_requested,
  ADD COLUMN date_confirmed DATE NULL AFTER return_date,
  ADD CONSTRAINT fk_requests_professor FOREIGN KEY (professor_id) REFERENCES users(id) ON DELETE SET NULL;

-- Requests made before professors existed go straight to the laboratory
UPDATE borrow_requests SET status = 'Authorized' WHERE status = 'Pending';

-- The log of attempts now covers professors too
RENAME TABLE admin_attempts TO account_attempts;
ALTER TABLE account_attempts
  ADD COLUMN account_type VARCHAR(20) NOT NULL DEFAULT 'admin' AFTER email;
