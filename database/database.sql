-- =====================================================
-- LabTrack - Laboratory Borrowing System
-- THE WHOLE DATABASE IN ONE FILE (nothing else to run)
--
-- How to use:  phpMyAdmin -> Import tab -> choose this file -> Import.
--
-- WARNING: this file deletes the LabTrack tables and creates them again.
-- If the database already holds your data, importing this file ERASES it.
--
-- On a web host that gives you a ready-made database: delete the two lines
-- marked "XAMPP only" below, then import this file into the database the host
-- created for you.
-- =====================================================

SET NAMES utf8mb4;

-- XAMPP only: create the database and select it
CREATE DATABASE IF NOT EXISTS lab_borrowing CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE lab_borrowing;   -- XAMPP only


-- Remove old versions of the tables (the ones that depend on others go first)

DROP TABLE IF EXISTS borrow_requests;
DROP TABLE IF EXISTS support_messages;
DROP TABLE IF EXISTS account_attempts;
DROP TABLE IF EXISTS equipment;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;


-- table users  (students, professors, and administrators)

CREATE TABLE users (

      id            INT                                     NOT NULL AUTO_INCREMENT
    , full_name     VARCHAR (100)                           NOT NULL
    , email         VARCHAR (100)                           NOT NULL
    , password      VARCHAR (255)                           NOT NULL                    -- saved with password_hash(), never as plain text
    , role          ENUM ('student', 'professor', 'admin')  NOT NULL DEFAULT 'student'
    , status        ENUM ('Active', 'Suspended')            NOT NULL DEFAULT 'Active'
    , student_id    VARCHAR (30)                            NULL                        -- the student ID, or the staff ID for professors and administrators
    , department    VARCHAR (100)                           NULL
    , created_at    TIMESTAMP                               DEFAULT CURRENT_TIMESTAMP
    , CONSTRAINT    users_pk                                PRIMARY KEY (id)
    , CONSTRAINT    users_email_uq                          UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- table categories  (Optical, Glassware, Measuring...)

CREATE TABLE categories (

      id            INT                 NOT NULL AUTO_INCREMENT
    , name          VARCHAR (50)        NOT NULL
    , CONSTRAINT    categories_pk       PRIMARY KEY (id)
    , CONSTRAINT    categories_name_uq  UNIQUE (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- table equipment  (total units = available + in inspection + borrowed)

CREATE TABLE equipment (

      id                  INT                    NOT NULL AUTO_INCREMENT
    , name                VARCHAR (100)          NOT NULL
    , code                VARCHAR (20)           NOT NULL
    , category_id         INT                    NOT NULL
    , total_units         INT                    NOT NULL DEFAULT 1
    , available_units     INT                    NOT NULL DEFAULT 1         -- units on the shelf that can be borrowed
    , inspection_units    INT                    NOT NULL DEFAULT 0         -- units in inspection or maintenance (cannot be borrowed)
    , icon                VARCHAR (20)           NOT NULL DEFAULT 'cube'    -- icon name used by the front end
    , color               VARCHAR (20)           NOT NULL DEFAULT 'indigo'  -- card color used by the front end
    , created_at          TIMESTAMP              DEFAULT CURRENT_TIMESTAMP
    , CONSTRAINT          equipment_pk           PRIMARY KEY (id)
    , CONSTRAINT          equipment_code_uq      UNIQUE (code)
    , CONSTRAINT          equipment_category_fk  FOREIGN KEY (category_id)  REFERENCES categories(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- table borrow_requests  (one row = one student asking for one item)

CREATE TABLE borrow_requests (

      id                INT                                                                 NOT NULL AUTO_INCREMENT
    , user_id           INT                                                                 NOT NULL                    -- the student
    , equipment_id      INT                                                                 NOT NULL
    , professor_id      INT                                                                 NULL                        -- the professor who confirms the class
    , quantity          INT                                                                 NOT NULL DEFAULT 1          -- how many units were requested
    , course_code       VARCHAR (20)                                                        NULL                        -- class details written by the student
    , course_name       VARCHAR (100)                                                       NULL
    , section           VARCHAR (30)                                                        NULL                        -- for example: Section B
    , schedule          VARCHAR (100)                                                       NULL                        -- for example: Wed · 1:00–4:00 PM
    , purpose           VARCHAR (200)                                                       NULL
    , date_requested    TIMESTAMP                                                           DEFAULT CURRENT_TIMESTAMP
    , date_needed       DATE                                                                NULL                        -- the day the student needs the equipment
    , time_needed       TIME                                                                NULL                        -- and the time
    , return_date       DATE                                                                NOT NULL                    -- the date the student promised to return it
    , return_time       TIME                                                                NULL                        -- and the time
    , date_confirmed    DATETIME                                                            NULL                        -- when the professor decided
    , date_reviewed     DATETIME                                                            NULL                        -- when the laboratory approved or declined it
    , date_returned     DATETIME                                                            NULL                        -- filled in when the item is actually returned
      -- Pending = waiting for the professor, Authorized = professor confirmed,
      -- Approved = laboratory released it, Returned = given back
    , status            ENUM ('Pending', 'Authorized', 'Approved', 'Declined', 'Returned')  NOT NULL DEFAULT 'Pending'
    , CONSTRAINT        request_pk                                                          PRIMARY KEY (id)
    , CONSTRAINT        request_user_fk                                                     FOREIGN KEY (user_id)       REFERENCES users(id)
    , CONSTRAINT        request_equipment_fk                                                FOREIGN KEY (equipment_id)  REFERENCES equipment(id)
    , CONSTRAINT        request_professor_fk                                                FOREIGN KEY (professor_id)  REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- table support_messages  (from the Contact page)

CREATE TABLE support_messages (

      id            INT              NOT NULL AUTO_INCREMENT
    , user_id       INT              NOT NULL                   -- the student or professor who wrote it
    , topic         VARCHAR (50)     NOT NULL
    , subject       VARCHAR (150)    NOT NULL DEFAULT ''
    , message       TEXT             NOT NULL
    , created_at    TIMESTAMP        DEFAULT CURRENT_TIMESTAMP
    , read_at       DATETIME         NULL                       -- when an administrator opened it
    , archived      TINYINT (1)      NOT NULL DEFAULT 0         -- 1 = hidden from the administrator's inbox
    , CONSTRAINT    message_pk       PRIMARY KEY (id)
    , CONSTRAINT    message_user_fk  FOREIGN KEY (user_id)  REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- table account_attempts  (log of every try to create a professor or administrator)

CREATE TABLE account_attempts (

      id              INT            NOT NULL AUTO_INCREMENT
    , email           VARCHAR (100)  NOT NULL
    , account_type    VARCHAR (20)   NOT NULL
    , success         TINYINT (1)    NOT NULL
    , ip_address      VARCHAR (45)   NULL
    , created_at      TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
    , CONSTRAINT      attempt_pk     PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- categories Inserted VALUES

INSERT INTO categories (name)
VALUES ('Optical')
     , ('Glassware')
     , ('Measuring')
     , ('Laboratory Accessories')
     , ('Heating Equipment');

-- equipment Inserted VALUES

INSERT INTO equipment (name, code, category_id, total_units, available_units, inspection_units, icon, color)
VALUES ('Compound Microscope' , 'MIC-204', 1, 12, 12, 0, 'microscope' , 'indigo')
     , ('Erlenmeyer Flask Set', 'GLS-118', 2, 20, 20, 0, 'flask'      , 'cyan')
     , ('Digital Thermometer' , 'MEA-072', 3,  8,  8, 0, 'thermometer', 'amber')
     , ('Precision Balance'   , 'MEA-093', 3,  6,  5, 1, 'cube'       , 'violet')
     , ('Beaker Set · 6 pcs'  , 'GLS-042', 2, 10, 10, 0, 'beaker'     , 'emerald')
     , ('Stereo Microscope'   , 'MIC-217', 1,  5,  5, 0, 'microscope' , 'rose')
     , ('Safety Goggles'      , 'ACC-301', 4, 30, 30, 0, 'goggles'    , 'sky')
     , ('Laboratory Tongs'    , 'ACC-115', 4, 12, 12, 0, 'tongs'      , 'orange')
     , ('Bunsen Burner'       , 'HTG-101', 5, 10, 10, 0, 'flame'      , 'orange')
     , ('Hot Plate'           , 'HTG-205', 5,  6,  6, 0, 'hotplate'   , 'fuchsia');

-- Users are NOT inserted here on purpose: passwords must be hashed by PHP,
-- and no password should ever be written in a public file.
-- Accounts are created with the sign-up pages (see the README).


-- COMMIT

COMMIT;
