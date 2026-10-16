# LabTrack - Laboratory Borrowing System

A web system where students borrow laboratory equipment, professors confirm that each request supports a real class, and the laboratory administrator releases, tracks, and manages the equipment.

## Description

Borrowing laboratory equipment on paper is slow and hard to track. LabTrack replaces it with one workflow:

1. A **student** requests equipment and gives the class details (course, section, schedule, purpose, dates and times).
2. The chosen **professor** confirms the request (or declines it).
3. The laboratory **administrator** approves it, hands the equipment out, and marks it as returned.

Every step is saved in a MySQL database, so nothing gets lost and every number on the dashboards is real.

## Features

### For everyone
- Create an account and sign in with a role (Student, Professor, Administrator)
- Passwords are hashed, sessions keep you signed in, and each role only sees its own pages
- Dark / light mode switch (also on the login page), remembered after a refresh
- Notification bell: new decisions, due-soon and overdue items, and out-of-stock alerts. The notification choices in Settings decide what appears
- The page data refreshes by itself every 30 seconds (auto-refresh)
- Settings page: update your profile (name, email, department)
- Help center with guides, and a Contact page that saves messages to the database
- Responsive layout for desktop, tablet, and mobile
- The login page shows real numbers from the database (lab items, available now, on-time returns, accounts, class requests, active courses)

### Student
- Browse equipment with live search and category tabs
- Request several different items, and several units of the same item (no limit on the number of items)
- Class details: professor, course code and name, section, schedule, laboratory purpose, date and time needed, return date and time
- My borrowings with "Due soon" and "Overdue" labels (based on the promised date and time)
- Request history with the date and time of each step

### Professor
- Class authorizations: confirm or decline the requests sent to you, after checking the student, the class schedule, and the purpose
- Approval history of your past decisions
- Dashboard cards: awaiting review, approved, students, this week

### Administrator
- Overview with live statistics and two charts (requests by status, most-borrowed equipment)
- Inventory: add, edit, and delete equipment, with icon and color choices
- Equipment is counted in units. Some units of an item can be in inspection while the others stay available for borrowing
- Categories: Optical, Glassware, Measuring, Laboratory Accessories, Heating Equipment
- Borrowing requests: approve (only after a professor authorized it), decline, and mark as returned
- Lending history with the exact borrow and return times
- Manage users: change a role from the dropdown (Student, Professor, Administrator), suspend or reactivate accounts, and remove accounts
- Professor and administrator accounts can only be created with a secret access code

## Modern web features

| Feature | Where it is used |
|---|---|
| Web Storage (`localStorage`) | Theme choice, notification settings, and which notifications were already seen |
| Dark mode | Switch in the top bar and on the login page |
| Charts and data visualization | Admin overview (bars drawn with HTML and CSS) |
| Notifications | Notification bell with unread count |
| Real-time features | Auto-refresh every 30 seconds, live search on every list |

## Technologies

- HTML5
- CSS3 and Tailwind CSS (loaded from a CDN)
- JavaScript ES6+ (arrow functions, template literals, destructuring, array methods, `async` / `await`, Promises)
- Fetch API
- PHP (PDO)
- MySQL / MariaDB
- XAMPP
- Git / GitHub

## Project structure

```
lab-system/
├── index.html          the page (login screen, app layout, pop-ups)
├── style.css           custom styles and the dark mode colors
├── app.js              all the front-end code
├── api/                the PHP files the front end talks to (with fetch)
│   ├── db.php          database connection, session, and helper functions
│   ├── config.php      database settings and secret codes (NOT on GitHub)
│   ├── config.example.php   a safe copy of config.php
│   ├── register.php, login.php, logout.php, me.php, update_profile.php
│   ├── items.php, item_save.php, item_delete.php
│   ├── borrow.php, requests.php, class_review.php, request_update.php
│   ├── users.php, user_update.php, user_delete.php
│   ├── message_send.php
│   └── public_stats.php
└── database/
    └── database.sql    the whole database in one file
```

## Installation

1. Install [XAMPP](https://www.apachefriends.org/) and start **Apache** and **MySQL**.
2. Copy this project folder into XAMPP's `htdocs` folder (for example `C:\xampp\htdocs\lab-system`).
3. Set up the database (see the next section).
4. Copy `api/config.example.php` and name the copy `api/config.php`. Open it and set:
   - the database settings (XAMPP's defaults are user `root` with an empty password)
   - `$ADMIN_CODE`: the secret code for creating an administrator account
   - `$PROFESSOR_CODE`: the secret code for creating a professor account
   
   `config.php` is in `.gitignore`, so your codes and passwords are never uploaded.
5. Open `http://localhost/lab-system/` in your browser (open it through `localhost`, not by double-clicking the file, because the PHP needs Apache).
6. Create the first administrator: on the login page choose the **Administrator** card and click **Create an admin account**. Fill in the form and enter your `$ADMIN_CODE`.
7. Create a professor the same way with the **Professor** card and your `$PROFESSOR_CODE`. Students register with **Create an account** and need no code.

## Database setup

The whole database is in one file. Open `http://localhost/phpmyadmin`, go to the **Import** tab, choose `database/database.sql`, and click **Import**. This creates the `lab_borrowing` database with all tables and sample equipment. There is nothing else to run.

> **Warning:** the file deletes the LabTrack tables and creates them again, so importing it on a database that already has your data erases that data.

**On a web host:** if the host gives you a ready-made database, delete the two lines marked `XAMPP only` at the top of `database.sql` (the `CREATE DATABASE` and `USE` lines), then import the file into that database.

### Tables

| Table | What it stores |
|---|---|
| `users` | Students, professors, and administrators (hashed passwords, role, status) |
| `categories` | Equipment categories |
| `equipment` | Each item with its total units, available units, units in inspection, icon, and color |
| `borrow_requests` | Every request: student, item, quantity, professor, class details, planned and actual dates and times, status |
| `support_messages` | Messages sent from the Contact page |
| `account_attempts` | Log of every attempt to create a professor or administrator account |

A request moves through these statuses: **Pending** (waiting for the professor) → **Authorized** (professor confirmed) → **Approved** (laboratory released it) → **Returned**. It can be **Declined** by the professor or the laboratory on the way.

## Security

- Passwords are hashed with `password_hash()` and checked with `password_verify()`
- All database queries use PDO prepared statements (protection against SQL injection)
- Text from users and from the database is escaped before it is shown (protection against HTML injection)
- Every input is validated again on the server, not only in the browser
- The server decides every role. The browser cannot make itself an administrator or professor
- Every request checks the session, the role, and the account status in the database, so a suspended, removed, or demoted account loses access immediately
- Professor and administrator accounts need a secret code, and every attempt is logged
- Secret codes and database passwords live in `config.php`, which is excluded from Git

## Screenshots


## Live demo

**URL:** _(add the deployed link here after the system is online)_

The test accounts for the instructor are in the `README.txt` of the submission. Passwords are never written in this public repository.

## Developers

**Lanz Manuel I. Salvacion** - individual final project for Web Systems Technology.

Contributions:
- Interface design in Figma and front-end development (HTML5, CSS3, Tailwind CSS, JavaScript)
- PHP back end and the API the front end talks to
- Database design (MySQL)
- Testing, documentation, and deployment
