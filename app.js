// =====================================================
// LabTrack - Laboratory Borrowing System (plain JavaScript)
// All data comes from MySQL through the PHP files in the api folder.
// =====================================================


// ---------- 1. ICONS ----------
// Each icon is just the inside of an SVG. icon("plus") gives you a full <svg>.
const iconPaths = {
  arrow: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  beaker: '<path d="M9 3h6"/><path d="M10 3v5.5L5.8 17a2.8 2.8 0 0 0 2.5 4h7.4a2.8 2.8 0 0 0 2.5-4L14 8.5V3"/><path d="M7.8 15h8.4"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  cube: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="m4.5 7.8 7.5 4.3 7.5-4.3M12 21v-8.9"/>',
  dashboard: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  flask: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3"/><path d="M7 16h10"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.7 9a2.4 2.4 0 1 1 3.2 2.3c-.9.4-.9 1.1-.9 1.7M12 17h.01"/>',
  history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6h.01M4 12h.01M4 18h.01"/>',
  logout: '<path d="M10 17l5-5-5-5M15 12H3"/><path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  microscope: '<path d="m9 4 4 4M7 6l4-4 3 3-4 4-3-3ZM10 14a5 5 0 0 0 9 3M5 21h14M7 18h8"/><path d="M12 8c2 2 2 5 0 7H8c-1-3 0-5 2-6"/>',
  minus: '<path d="M5 12h14"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H3v-4h.2a1.7 1.7 0 0 0 1.4-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
  thermometer: '<path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0Z"/><path d="M12 11v6"/>'
};

function icon(name, size = "size-5") {
  const paths = iconPaths[name] ?? iconPaths.cube;
  return `<svg class="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
}


// ---------- 2. DATA AND STATE ----------
// The three lists below are filled by loadData() from the database.
let items = [];        // all equipment
let categories = [];   // [{ id, name }]
let requests = [];     // borrowing requests (admin: everyone's, student: only their own)

// These variables remember what the user is doing right now.
let loginRole = "student";    // role card chosen on the login screen
let role = "student";         // role after logging in: "student" or "admin"
let currentUser = null;       // the logged-in user (comes from PHP)
let authMode = "login";       // the login screen shows "login" or "register"
let panel = "browse";         // which page is showing
let guideIndex = 0;           // which help guide is open
let category = "All items";   // selected category tab (student)
let query = "";               // text in the search box (student)
let inventoryTab = "All";     // selected tab on the inventory page (admin)
let basket = [];              // [{ id, qty }]: the items and quantities in the request drawer
let users = [];               // all accounts (administrators only)
let usersTab = "All users";   // tab on the Manage users page
let userQuery = "";           // search text on the Manage users page
let usersNotice = "";         // green message at the top of the Manage users page
let submitted = false;        // true for a moment after submitting a request
let dueDate = dateString(addDays(new Date(), 7));   // default return date: 7 days from today

// Shortcut so we don't type document.getElementById every time
const $ = (id) => document.getElementById(id);


// ---------- 3. HELPERS ----------

// Makes text safe before putting it inside HTML (prevents HTML injection / XSS).
// Use it on anything typed by users or coming from the database.
function esc(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// --- dates ---
function dateString(date) {            // Date -> "2026-10-13"
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function addDays(date, days) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function todayString() {
  return dateString(new Date());
}

function parseDate(text) {             // "2026-10-13" (or with a time) -> Date
  const [year, month, day] = text.slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(text) {            // "2026-10-13" -> "Oct 13"
  return parseDate(text).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function daysUntil(text) {             // how many days from today (negative = already late)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((parseDate(text) - today) / (24 * 60 * 60 * 1000));
}

function plural(count, word) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

// --- requests ---
function requestNumber(request) {      // 7 -> "REQ-0007"
  return `REQ-${String(request.id).padStart(4, "0")}`;
}

// The label shown for a request (an approved one can also be Due soon or Overdue)
function loanStatus(request) {
  if (request.status !== "Approved") return request.status;
  const days = daysUntil(request.return_date);
  if (days < 0) return "Overdue";
  if (days <= 3) return "Due soon";
  return "Active";
}

function itemLabel(request) {          // "Compound Microscope" or "Compound Microscope × 3"
  return request.quantity > 1 ? `${request.item} × ${request.quantity}` : request.item;
}

function initialsOf(name) {            // "Alex Morgan" -> "AM"
  return name.split(" ").filter(Boolean).map((word) => word[0]).slice(0, 2).join("").toUpperCase();
}

// Colored label for a status like "Pending" or "Approved"
function badge(status) {
  let style = "bg-rose-50 text-rose-600";
  if (["Active", "Returned", "Approved", "Operational"].includes(status)) {
    style = "bg-violet-50 text-violet-700";
  } else if (["Pending", "Due soon"].includes(status)) {
    style = "bg-amber-50 text-amber-700";
  }
  return `<span class="w-fit rounded-full px-2.5 py-1 text-[0.68rem] font-bold ${style}">${esc(status)}</span>`;
}

// Title + description + optional button at the top of a page
function pageHeader(eyebrow, title, description, action = "") {
  return `
    <div class="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <div class="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-violet-600">${eyebrow}</div>
        <h1 class="text-3xl font-bold tracking-tight text-slate-950">${title}</h1>
        <p class="mt-2 text-sm text-slate-500">${description}</p>
      </div>
      ${action}
    </div>`;
}

// A row of small stat cards
function statCards(stats) {
  return stats.map(([label, value, iconName, tone, note]) => `
    <div class="rounded-2xl border border-slate-200 bg-white p-5">
      <div class="flex items-start justify-between">
        <div class="stat-icon stat-${tone}">${icon(iconName, "size-4")}</div>
        <span class="text-3xl font-bold tracking-tight text-slate-950">${value}</span>
      </div>
      <div class="mt-5 text-sm font-semibold text-slate-700">${label}</div>
      ${note === "" ? "" : `<div class="mt-1 text-xs text-slate-400">${note}</div>`}
    </div>`).join("");
}

// Small message in the corner that disappears after 3 seconds
function showToast(text, isError = false) {
  const toast = document.createElement("div");
  toast.setAttribute("role", "status");
  toast.className = "fixed bottom-6 right-6 z-[70] max-w-sm rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg " +
    (isError ? "bg-rose-600" : "bg-slate-950");
  toast.textContent = text;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// Pop-up window (used for the equipment form)
function openModal(title, bodyHtml) {
  $("modal-title").textContent = title;
  $("modal-body").innerHTML = bodyHtml;
  $("modal").classList.remove("hidden");
  $("modal").classList.add("flex");
}

function closeModal() {
  $("modal").classList.add("hidden");
  $("modal").classList.remove("flex");
}

// Form fields used inside the pop-up
const fieldStyle = "mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-normal outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100";

function textField(label, id, value, type = "text", extra = "") {
  return `
    <label class="block text-xs font-bold text-slate-600" for="${id}">${label}
      <input id="${id}" type="${type}" value="${esc(value)}" ${extra} class="${fieldStyle}">
    </label>`;
}

function selectField(label, id, options, selected) {   // options = [[value, text], ...]
  const optionsHtml = options.map(([value, text]) =>
    `<option value="${esc(value)}" ${String(value) === String(selected) ? "selected" : ""}>${esc(text)}</option>`).join("");
  return `
    <label class="block text-xs font-bold text-slate-600" for="${id}">${label}
      <select id="${id}" class="${fieldStyle}">${optionsHtml}</select>
    </label>`;
}


// ---------- 4. LOGIN, REGISTER, LOGOUT ----------
// These functions talk to the PHP files in the api folder using fetch().

// Send JSON to a PHP file and get its answer back
async function postJson(url, data) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  return { ok: response.ok, result };
}

// Red box for errors, green box for success
function showAuthMessage(text, isError = true) {
  const box = $("login-error");
  box.textContent = text;
  box.className = "mt-5 rounded-xl px-4 py-3 text-xs font-semibold " +
    (isError ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-700");
}

function hideAuthMessage() {
  $("login-error").classList.add("hidden");
}

// Change the texts and fields depending on the form: "login", "register" (student) or "admin"
function updateAuthTexts() {
  const admin = authMode === "admin";
  const registering = authMode === "register";
  const creating = admin || registering;

  $("auth-eyebrow").textContent = admin ? "Administrator access" : (registering ? "Get started" : "Welcome back");
  $("auth-title").textContent = admin ? "Create your admin account" : (registering ? "Create your student account" : "Sign in to your account");
  $("auth-subtitle").textContent = admin
    ? "Enter your staff details and institutional access code."
    : (registering ? "Fill in your details to register." : "Choose your workspace and enter your credentials.");
  $("login-button-text").textContent = admin
    ? "Create admin account"
    : (registering ? "Create account" : (loginRole === "student" ? "Sign in as student" : "Sign in as administrator"));
  $("auth-switch-text").textContent = creating ? "Already have an account?" : "New student?";
  $("auth-switch-link").textContent = creating ? "Sign in" : "Create an account";
  $("auth-footnote").innerHTML = admin
    ? "Administrator creation attempts are logged<br>for institutional security."
    : "By signing in, you agree to the laboratory's<br>equipment use and safety policies.";

  $("email-label").textContent = admin ? "Work email address" : "Email address";
  $("login-email").placeholder = admin ? "name@labtrack.edu" : (loginRole === "admin" && !registering ? "admin@labtrack.edu" : "student@labtrack.edu");
  $("login-password").placeholder = creating ? "At least 8 characters" : "Enter your password";

  // Sign up fields
  $("register-fields").classList.toggle("hidden", !creating);
  $("register-name").placeholder = admin ? "Dr. Jordan Davis" : "Alex Morgan";
  $("register-id-label").textContent = admin ? "Staff ID" : "Student ID (optional)";
  $("register-id").placeholder = admin ? "ADM-0014" : "STU-2024-081";
  $("register-id-box").classList.toggle("sm:col-span-2", !admin);
  $("register-department-box").classList.toggle("hidden", !admin);
  $("admin-code-box").classList.toggle("hidden", !admin);

  // Sign in only parts
  $("role-cards").classList.toggle("hidden", creating);
  $("login-extras").classList.toggle("hidden", creating);
  $("auth-admin-link-row").classList.toggle("hidden", authMode !== "login");
  $("auth-back").classList.toggle("hidden", !admin);

  // The dark left side has two versions
  $("left-default").classList.toggle("hidden", admin);
  $("left-admin").classList.toggle("hidden", !admin);
}

function setAuthMode(mode) {
  authMode = mode;
  hideAuthMessage();
  updateAuthTexts();
}

function toggleAuthMode() {
  setAuthMode(authMode === "login" ? "register" : "login");
}

function selectRole(newRole) {
  loginRole = newRole;
  $("role-student").classList.toggle("active", newRole === "student");
  $("role-admin").classList.toggle("active", newRole === "admin");
  updateAuthTexts();
  hideAuthMessage();
}

function togglePassword() {
  const input = $("login-password");
  const hidden = input.type === "password";
  input.type = hidden ? "text" : "password";
  $("toggle-password").textContent = hidden ? "Hide" : "Show";
}

function forgotPassword() {
  showToast("Please ask your laboratory administrator to reset your password.");
}

// Runs when the form is submitted (Sign in OR Create account)
async function handleLogin(event) {
  event.preventDefault(); // stop the page from reloading

  const email = $("login-email").value.trim();
  const password = $("login-password").value;

  if (email === "" || password === "") {
    showAuthMessage("Enter your email and password to continue.");
    return;
  }

  try {
    if (authMode !== "login") {
      await registerUser(email, password);
    } else {
      const { ok, result } = await postJson("api/login.php", { email, password, role: loginRole });
      if (!ok) {
        showAuthMessage(result.error);
        return;
      }
      await startSession(result.user);
    }
  } catch (error) {
    showAuthMessage("Unable to connect to the server. Open the site at http://localhost/lab-system/ and check that Apache and MySQL are running.");
  }
}

async function registerUser(email, password) {
  const admin = authMode === "admin";
  const fullName = $("register-name").value.trim();
  const idNumber = $("register-id").value.trim();
  const department = $("register-department").value.trim();
  const adminCode = $("register-admin-code").value.trim();

  if (fullName === "") {
    showAuthMessage("Please enter your full name.");
    return;
  }
  if (admin && (idNumber === "" || department === "" || adminCode === "")) {
    showAuthMessage("Please complete all required fields.");
    return;
  }

  const { ok, result } = await postJson("api/register.php", {
    account_type: admin ? "admin" : "student",
    full_name: fullName,
    email,
    password,
    student_id: idNumber,
    department,
    admin_code: adminCode
  });

  if (!ok) {
    showAuthMessage(result.error);
    return;
  }

  // Success: go back to the sign in form, with the matching card selected
  authMode = "login";
  selectRole(admin ? "admin" : "student");
  $("login-password").value = "";
  $("register-admin-code").value = "";
  showAuthMessage(result.message, false);
}

// Called after PHP says the login is correct
async function startSession(user) {
  currentUser = user;
  role = user.role;
  panel = role === "student" ? "browse" : "overview";

  await loadData();
  if (currentUser === null) return;   // the session expired while loading

  $("login-screen").classList.add("hidden");
  $("app").classList.remove("hidden");
  render();
}

// When the page loads, ask PHP if we are still logged in
async function checkSession() {
  try {
    const response = await fetch("api/me.php");
    if (!response.ok) return;
    const result = await response.json();
    await startSession(result.user);
  } catch (error) {
    // No server yet: stay on the login screen
  }
}

async function logout() {
  try {
    await fetch("api/logout.php", { method: "POST" });
  } catch (error) {
    // even if the server cannot be reached, show the login screen
  }
  currentUser = null;
  basket = [];
  $("app").classList.add("hidden");
  $("login-screen").classList.remove("hidden");
  $("login-password").value = "";
  closeBasket();
  closeModal();
}


// ---------- 5. LOADING DATA FROM THE DATABASE ----------
// Gets the equipment and the requests at the same time (Promise.all).
async function loadData() {
  try {
    const calls = [fetch("api/items.php"), fetch("api/requests.php")];
    if (role === "admin") calls.push(fetch("api/users.php"));   // only administrators see the accounts
    const responses = await Promise.all(calls);

    if (responses.some((response) => response.status === 401)) {
      showToast("Your session has expired. Please sign in again.", true);
      await logout();
      return;
    }

    const [itemsData, requestsData, usersData] = await Promise.all(responses.map((response) => response.json()));

    categories = itemsData.categories;
    items = itemsData.items.map((row) => ({
      id: Number(row.id),
      name: row.name,
      code: row.code,
      category: row.category,
      category_id: Number(row.category_id),
      available: Number(row.available_units),
      total: Number(row.total_units),
      condition: row.condition_status,
      icon: row.icon,
      color: row.color,
      created_at: row.created_at
    }));
    requests = requestsData.requests.map((row) => ({ ...row, id: Number(row.id), quantity: Number(row.quantity) }));
    if (usersData) users = usersData.users.map((row) => ({ ...row, id: Number(row.id) }));
  } catch (error) {
    showToast("Unable to load data from the server.", true);
  }
}


// ---------- 6. MAIN RENDER ----------
// render() redraws every part of the screen from the current data.
function render() {
  renderNav();
  renderUserCard();
  renderHeader();
  renderContent();
  renderBasket();
}

// Sidebar links
function navButton(id, iconName, label, extra = "") {
  const helpPages = ["help", "guide", "contact"];
  const active = panel === id || (id === "help" && helpPages.includes(panel)) ? "nav-item-active" : "";
  return `<button onclick="go('${id}')" class="nav-item ${active}">${icon(iconName)} ${label} ${extra}</button>`;
}

function renderNav() {
  const pending = requests.filter((r) => r.status === "Pending").length;
  const borrowed = requests.filter((r) => r.status === "Approved").length;
  let links = "";

  if (role === "student") {
    links += navButton("browse", "dashboard", "Browse equipment");
    links += navButton("borrowings", "list", "My borrowings", `<span class="ml-auto rounded-full bg-slate-800 px-2 py-0.5 text-xs">${borrowed}</span>`);
    links += navButton("history", "history", "Request history");
  } else {
    links += navButton("overview", "dashboard", "Overview");
    links += navButton("inventory", "cube", "Inventory");
    links += navButton("requests", "list", "Borrowing requests", `<span class="ml-auto rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-slate-950">${pending}</span>`);
    links += navButton("users", "shield", "Manage users");
    links += navButton("lending", "history", "Lending history");
  }

  $("nav").innerHTML = `
    <div class="px-3 pb-2 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-slate-600">Workspace</div>
    ${links}
    <div class="px-3 pb-2 pt-7 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-slate-600">Support</div>
    ${navButton("help", "help", "Help center")}
    ${navButton("settings", "settings", "Settings")}`;
}

function renderUserCard() {
  const isStudent = role === "student";
  const subtitle = isStudent ? (currentUser.department || "Student") : "Laboratory administrator";

  // Units this student has borrowed or is waiting for
  const inUse = requests
    .filter((r) => ["Pending", "Approved"].includes(r.status))
    .reduce((sum, r) => sum + r.quantity, 0);

  $("user-card").innerHTML = `
    <div class="flex items-center gap-3">
      <div class="flex size-9 items-center justify-center rounded-full bg-indigo-400 font-bold text-slate-950">${esc(initialsOf(currentUser.full_name))}</div>
      <div class="min-w-0 flex-1">
        <div class="truncate text-sm font-semibold text-white">${esc(currentUser.full_name)}</div>
        <div class="truncate text-xs text-slate-500">${esc(subtitle)}</div>
      </div>
      <button onclick="logout()" class="text-slate-500 transition hover:text-white" aria-label="Sign out" title="Sign out">${icon("logout", "size-4")}</button>
    </div>
    ${isStudent ? `<div class="mt-3 text-[0.68rem] text-slate-500">${plural(inUse, "item")} borrowed or pending</div>` : ""}`;
}

function renderHeader() {
  const isStudent = role === "student";
  const now = new Date();
  const hour = now.getHours();
  const timeOfDay = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  const weekday = now.toLocaleDateString("en-US", { weekday: "long" });
  const month = now.toLocaleDateString("en-US", { month: "long" });

  $("greeting").textContent = isStudent ? `Good ${timeOfDay}, ${currentUser.full_name.split(" ")[0]}` : "Admin dashboard";
  $("today").textContent = isStudent ? `${weekday}, ${now.getDate()} ${month}` : "Laboratory operations";
  $("request-btn").classList.toggle("hidden", !isStudent);

  // The search box in the top bar is only for students (desktop screens)
  $("header-search-box").classList.toggle("md:block", isStudent);
  $("header-search").value = query;
}

// Which function builds which page
const pages = {
  overview: () => overviewPage(),
  inventory: () => inventoryPage(),
  requests: () => requestsPage(),
  lending: () => lendingPage(),
  borrowings: () => borrowingsPage(),
  history: () => historyPage(),
  help: () => helpPage(),
  guide: () => guidePage(),
  contact: () => contactPage(),
  users: () => usersPage(),
  settings: () => settingsPage()
};

function renderContent() {
  if (panel === "browse") {
    renderBrowse();
  } else {
    $("content").innerHTML = pages[panel]();
  }
}

// Open a page. The data is loaded again so the page is always up to date.
async function go(newPanel) {
  panel = newPanel;
  usersNotice = "";
  closeMenu();
  await loadData();
  if (currentUser === null) return;
  render();
}


// ---------- 7. STUDENT: BROWSE EQUIPMENT ----------
function renderBrowse() {
  const readyCount = items.reduce((sum, item) => item.condition === "Operational" ? sum + item.available : sum, 0);
  const unitsOf = (list) => list.reduce((sum, r) => sum + r.quantity, 0);
  const borrowed = requests.filter((r) => r.status === "Approved");
  const dueThisWeek = borrowed.filter((r) => daysUntil(r.return_date) <= 7);
  const pending = requests.filter((r) => r.status === "Pending");

  const stats = [
    ["Available now", readyCount, "cube", "emerald", "Items ready to borrow"],
    ["My borrowings", String(unitsOf(borrowed)).padStart(2, "0"), "list", "indigo", "Currently borrowed"],
    ["Due this week", String(unitsOf(dueThisWeek)).padStart(2, "0"), "calendar", "amber", "Return soon"],
    ["Pending requests", String(unitsOf(pending)).padStart(2, "0"), "clock", "violet", "Waiting for approval"]
  ];

  const tabNames = ["All items", ...categories.map((c) => c.name)];
  const tabs = tabNames.map((name) => `
    <button onclick="setCategory('${esc(name)}')"
      class="whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-semibold transition ${category === name ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-800"}">${esc(name)}</button>`).join("");

  $("content").innerHTML = `
    <section class="relative overflow-hidden rounded-3xl bg-slate-950 p-7 text-white sm:p-10">
      <div class="absolute -right-16 -top-28 size-72 rounded-full border-[3rem] border-violet-400/10"></div>
      <div class="absolute bottom-0 right-32 h-24 w-24 rounded-t-full bg-indigo-400/10"></div>
      <div class="relative max-w-2xl">
        <div class="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-semibold text-violet-300">
          <span class="size-1.5 rounded-full bg-violet-400"></span> ${readyCount} items ready to borrow
        </div>
        <h1 class="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">The right equipment,<br class="hidden sm:block"> right when you need it.</h1>
        <p class="mt-4 max-w-lg text-sm leading-6 text-slate-400">Browse laboratory equipment, check real-time availability, and submit a borrowing request in minutes.</p>
      </div>
    </section>

    <section class="grid grid-cols-2 gap-3 py-7 lg:grid-cols-4">${statCards(stats)}</section>

    <section>
      <div class="flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 class="text-xl font-bold tracking-tight text-slate-950">Explore equipment</h2>
          <p class="mt-1 text-sm text-slate-500">Select an item to add it to your borrowing request.</p>
        </div>
        <div class="flex gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1">${tabs}</div>
      </div>

      <div class="relative mt-5 md:hidden">
        <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">${icon("search", "size-4")}</span>
        <input id="page-search" value="${esc(query)}" oninput="setQuery(this.value)" placeholder="Search equipment…" aria-label="Search equipment"
          class="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100">
      </div>

      <div id="item-grid" class="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"></div>
    </section>`;

  renderItems();
}

// Only redraws the equipment cards (so the search box keeps focus while typing)
function renderItems() {
  const search = query.toLowerCase();

  // Dynamic search + category filter using the array filter() method
  const visible = items.filter((item) =>
    (category === "All items" || item.category === category) &&
    (item.name.toLowerCase().includes(search) || item.code.toLowerCase().includes(search))
  );

  if (visible.length === 0) {
    $("item-grid").innerHTML = `
      <div class="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
        <h3 class="font-semibold">No equipment found</h3>
        <p class="mt-1 text-sm text-slate-500">Try a different item name or category.</p>
      </div>`;
    return;
  }

  $("item-grid").innerHTML = visible.map((item) => {
    const selected = inBasket(item.id);
    const unavailable = item.available === 0 || item.condition !== "Operational";

    let buttonStyle = "bg-slate-950 text-white hover:bg-violet-400 hover:text-slate-950";
    if (selected) buttonStyle = "bg-violet-400 text-slate-950";
    if (unavailable) buttonStyle = "cursor-not-allowed bg-slate-100 text-slate-300";

    return `
      <article class="overflow-hidden rounded-2xl border bg-white transition duration-200 hover:-translate-y-0.5 hover:shadow-lg ${selected ? "border-violet-400 ring-2 ring-violet-100" : "border-slate-200"}">
        <div class="equipment-visual visual-${esc(item.color)}">
          <div class="absolute inset-4 rounded-full border border-current opacity-10"></div>
          ${icon(item.icon, "relative size-20 stroke-[1.15]")}
          <span class="absolute left-4 top-4 rounded-full bg-white/80 px-2.5 py-1 text-[0.65rem] font-bold text-slate-600">${esc(item.category)}</span>
        </div>
        <div class="p-5">
          <div class="flex items-start justify-between gap-3">
            <div>
              <h3 class="font-bold text-slate-950">${esc(item.name)}</h3>
              <p class="mt-1 font-mono text-[0.68rem] tracking-wide text-slate-400">${esc(item.code)}</p>
            </div>
            <div class="mt-1 size-2 shrink-0 rounded-full ${unavailable ? "bg-rose-400" : "bg-violet-400"}"></div>
          </div>
          <div class="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
            <div>
              <div class="text-xs font-bold ${unavailable ? "text-rose-500" : "text-violet-600"}">${unavailable ? "Currently unavailable" : `${item.available} available`}</div>
              <div class="mt-0.5 text-[0.68rem] text-slate-400">${item.total} units total</div>
            </div>
            <button ${unavailable ? "disabled" : ""} onclick="toggleBasket(${item.id})"
              class="flex size-10 items-center justify-center rounded-xl transition ${buttonStyle}"
              aria-label="${selected ? "Remove" : "Add"} ${esc(item.name)}">
              ${icon(selected ? "check" : "plus")}
            </button>
          </div>
        </div>
      </article>`;
  }).join("");
}

function setCategory(name) {
  category = name;
  renderBrowse();
}

function setQuery(text) {
  query = text;

  // keep the two search boxes showing the same text
  const headerSearch = $("header-search");
  if (headerSearch.value !== text) headerSearch.value = text;
  const pageSearch = $("page-search");
  if (pageSearch && pageSearch.value !== text) pageSearch.value = text;

  if (panel === "browse") renderItems();
}


// ---------- 8. REQUEST DRAWER ----------
// basket = [{ id: 3, qty: 2 }, ...]  (the item and how many units of it)
function inBasket(id) {
  return basket.some((entry) => entry.id === id);
}

function basketTotal() {
  return basket.reduce((sum, entry) => sum + entry.qty, 0);
}

function toggleBasket(id) {
  if (inBasket(id)) {
    basket = basket.filter((entry) => entry.id !== id);
  } else {
    basket.push({ id, qty: 1 });
  }
  renderItems();
  renderBasket();
}

// Set how many units of an item are in the request (never more than are available)
function setQty(id, value) {
  const entry = basket.find((e) => e.id === id);
  const item = items.find((i) => i.id === id);
  if (!entry || !item) return;

  let qty = parseInt(value, 10);
  if (Number.isNaN(qty) || qty < 1) qty = 1;
  if (qty > item.available) {
    qty = item.available;
    showToast(`Only ${plural(item.available, "unit")} of ${item.name} available.`, true);
  }
  entry.qty = qty;
  renderBasket();
}

function changeQty(id, change) {
  const entry = basket.find((e) => e.id === id);
  if (entry) setQty(id, entry.qty + change);
}

function setDueDate(value) {
  dueDate = value;
}

function renderBasket() {
  $("basket-count").textContent = `${plural(basketTotal(), "item")} selected`;

  // Number on the header button
  const badgeEl = $("basket-badge");
  badgeEl.textContent = basketTotal();
  badgeEl.classList.toggle("hidden", basket.length === 0);
  badgeEl.classList.toggle("flex", basket.length > 0);

  // Match every basket entry with its equipment (skip items that no longer exist)
  const picked = basket
    .map((entry) => ({ entry, item: items.find((i) => i.id === entry.id) }))
    .filter(({ item }) => item);

  if (picked.length === 0) {
    $("basket-body").innerHTML = `
      <div class="flex h-full flex-col items-center justify-center text-center">
        <div class="flex size-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">${icon("beaker", "size-8")}</div>
        <h3 class="mt-4 font-bold">Your request is empty</h3>
        <p class="mt-2 max-w-xs text-sm leading-6 text-slate-500">Browse the catalog and select available equipment to begin.</p>
      </div>`;
  } else {
    $("basket-body").innerHTML = `
      <div class="space-y-3">
        ${picked.map(({ entry, item }) => `
          <div class="rounded-2xl border border-slate-200 p-3">
            <div class="flex items-center gap-3">
              <div class="flex size-12 shrink-0 items-center justify-center rounded-xl visual-${esc(item.color)}">${icon(item.icon, "size-7")}</div>
              <div class="min-w-0 flex-1">
                <div class="truncate text-sm font-bold">${esc(item.name)}</div>
                <div class="mt-0.5 text-xs text-slate-400">${esc(item.code)} · ${item.available} available</div>
              </div>
              <button onclick="toggleBasket(${item.id})" class="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500" aria-label="Remove ${esc(item.name)}">${icon("close", "size-4")}</button>
            </div>
            <div class="mt-3 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
              <span class="text-xs font-bold text-slate-600">Quantity</span>
              <div class="flex items-center gap-2">
                <button onclick="changeQty(${item.id}, -1)" class="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100" aria-label="Decrease quantity of ${esc(item.name)}">${icon("minus", "size-4")}</button>
                <input type="number" min="1" max="${item.available}" value="${entry.qty}" onchange="setQty(${item.id}, this.value)" aria-label="Quantity of ${esc(item.name)}"
                  class="h-8 w-14 rounded-lg border border-slate-200 bg-white text-center text-sm font-bold outline-none focus:border-violet-500">
                <button onclick="changeQty(${item.id}, 1)" class="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100" aria-label="Increase quantity of ${esc(item.name)}">${icon("plus", "size-4")}</button>
              </div>
            </div>
          </div>`).join("")}
      </div>
      <div class="mt-7 rounded-2xl bg-slate-50 p-4">
        <label class="text-xs font-bold text-slate-600" for="return-date">Expected return date</label>
        <input id="return-date" type="date" value="${dueDate}" min="${todayString()}" onchange="setDueDate(this.value)"
          class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-violet-500">
      </div>`;
  }

  const button = $("submit-btn");
  button.disabled = basket.length === 0 || submitted;
  button.innerHTML = submitted
    ? `${icon("check")} Request submitted`
    : `Submit request ${icon("arrow", "size-4")}`;
}

function openBasket() { setDrawer(true); }
function closeBasket() { setDrawer(false); }

// Slide the drawer in or out by switching Tailwind classes
function setDrawer(open) {
  $("drawer").classList.toggle("pointer-events-none", !open);
  $("drawer-bg").classList.toggle("opacity-0", !open);
  $("drawer-panel").classList.toggle("translate-x-full", !open);
}

// Send the request to PHP (CREATE)
async function submitRequest() {
  submitted = true;
  renderBasket();

  try {
    const { ok, result } = await postJson("api/borrow.php", {
      items: basket.map((entry) => ({ id: entry.id, quantity: entry.qty })),
      return_date: dueDate
    });

    if (!ok) {
      submitted = false;
      renderBasket();
      showToast(result.error, true);
      return;
    }

    showToast(result.message);
    setTimeout(async () => {
      basket = [];
      submitted = false;
      closeBasket();
      await loadData();
      render();
    }, 1200);
  } catch (error) {
    submitted = false;
    renderBasket();
    showToast("Unable to connect to the server.", true);
  }
}


// ---------- 9. MOBILE MENU ----------
function openMenu() {
  $("sidebar").classList.remove("-translate-x-full");
  $("overlay").classList.remove("hidden");
}

function closeMenu() {
  $("sidebar").classList.add("-translate-x-full");
  $("overlay").classList.add("hidden");
}


// ---------- 10. LISTS (used by several pages) ----------

// One row of a list. "right" is HTML: a badge or buttons.
function recordRow(title, sub, info1, info2, right) {
  return `
    <div class="record-row grid gap-3 p-5 sm:grid-cols-[1.2fr_.8fr_.7fr_auto] sm:items-center">
      <div>
        <div class="text-sm font-bold">${esc(title)}</div>
        <div class="mt-1 text-xs text-slate-400">${esc(sub)}</div>
      </div>
      <div class="text-xs font-semibold text-slate-500">${esc(info1)}</div>
      <div class="text-xs text-slate-500">${esc(info2)}</div>
      <div class="flex flex-wrap items-center gap-2 sm:justify-end">${right}</div>
    </div>`;
}

// A white card with a title, a working "Search records" box, and the rows
function recordsCard(title, rowsHtml, emptyText) {
  return `
    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div class="flex items-center justify-between border-b border-slate-200 p-5">
        <h2 class="font-bold">${title}</h2>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">${icon("search", "size-4")}</span>
          <input oninput="filterRecords(this.value)" placeholder="Search records" aria-label="Search records"
            class="h-9 w-40 rounded-lg border border-slate-200 pl-9 pr-3 text-xs outline-none focus:border-violet-500">
        </div>
      </div>
      ${rowsHtml === "" ? `<p class="p-8 text-center text-sm text-slate-500">${emptyText}</p>` : `<div class="divide-y divide-slate-100">${rowsHtml}</div>`}
    </div>`;
}

// Hide the rows that do not contain the typed text
function filterRecords(text) {
  const search = text.toLowerCase();
  document.querySelectorAll(".record-row").forEach((row) => {
    row.classList.toggle("hidden", !row.textContent.toLowerCase().includes(search));
  });
}


// ---------- 11. STUDENT: MY BORROWINGS AND REQUEST HISTORY ----------
function borrowingsPage() {
  const active = requests.filter((r) => r.status === "Approved");
  const overdue = active.filter((r) => daysUntil(r.return_date) < 0);
  const dueSoon = active.filter((r) => daysUntil(r.return_date) >= 0 && daysUntil(r.return_date) <= 7);

  // Yellow notice at the top
  let banner = "";
  if (overdue.length > 0) {
    banner = bannerHtml(`${plural(overdue.length, "item")} overdue`, "Return it as soon as possible to keep your borrowing privileges active.");
  } else if (dueSoon.length > 0) {
    const nextDays = Math.min(...dueSoon.map((r) => daysUntil(r.return_date)));
    const when = nextDays === 0 ? "today" : `in ${plural(nextDays, "day")}`;
    banner = bannerHtml(`${plural(dueSoon.length, "item")} due soon`, `The next return date is ${when}. Return it on time to keep your borrowing privileges active.`);
  }

  const rows = active.map((r) =>
    recordRow(itemLabel(r), r.code, `Borrowed ${formatDate(r.date_reviewed)}`, `Due ${formatDate(r.return_date)}`, badge(loanStatus(r)))
  ).join("");

  const action = `<button onclick="go('browse')" class="flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white">${icon("plus", "size-4")} New request</button>`;

  return pageHeader("Student workspace", "My borrowings", "Track active loans and upcoming return dates.", action) +
    banner +
    recordsCard("Currently borrowed", rows, "You have no borrowed items right now.");
}

function bannerHtml(title, text) {
  return `
    <div class="mb-5 rounded-2xl bg-amber-50 p-5 sm:flex sm:items-center sm:justify-between">
      <div class="flex gap-3">
        <div class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">${icon("clock")}</div>
        <div>
          <div class="text-sm font-bold text-amber-900">${title}</div>
          <div class="mt-1 text-xs text-amber-700">${text}</div>
        </div>
      </div>
      <button onclick="openGuide(1)" class="mt-4 text-xs font-bold text-amber-800 sm:mt-0">View return policy</button>
    </div>`;
}

// The two info columns of a history row depend on the status
function historyInfo(r) {
  if (r.status === "Approved") return [`Approved ${formatDate(r.date_reviewed)}`, `Due ${formatDate(r.return_date)}`];
  if (r.status === "Declined") return [`Declined ${formatDate(r.date_reviewed)}`, "Not approved"];
  if (r.status === "Returned") {
    const days = Math.round((parseDate(r.date_returned) - parseDate(r.date_reviewed)) / (24 * 60 * 60 * 1000));
    return [`Returned ${formatDate(r.date_returned)}`, plural(days, "day")];
  }
  return [`Requested ${formatDate(r.date_requested)}`, `Return by ${formatDate(r.return_date)}`];
}

function historyPage() {
  const rows = requests.map((r) => {
    const [info1, info2] = historyInfo(r);
    return recordRow(itemLabel(r), requestNumber(r), info1, info2, badge(loanStatus(r)));
  }).join("");

  return pageHeader("Student workspace", "Request history", "Review your previous equipment requests and outcomes.") +
    recordsCard("Activity records", rows, "No records found.");
}


// ---------- 12. ADMIN: OVERVIEW ----------

// Buttons for a request: approve / decline, mark returned, or just a status label
function requestActions(r) {
  if (r.status === "Pending") {
    return `
      <button onclick="updateRequest(${r.id}, 'decline')" class="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500" aria-label="Decline ${requestNumber(r)}">${icon("close", "size-4")}</button>
      <button onclick="updateRequest(${r.id}, 'approve')" class="flex size-9 items-center justify-center rounded-lg bg-violet-400 text-slate-950 transition hover:bg-violet-300" aria-label="Approve ${requestNumber(r)}">${icon("check", "size-4")}</button>`;
  }
  if (r.status === "Approved") {
    return `
      ${badge(loanStatus(r))}
      <button onclick="updateRequest(${r.id}, 'return')" class="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-violet-300 hover:bg-violet-50">Mark returned</button>`;
  }
  return badge(r.status);
}

// UPDATE: approve, decline, or mark returned
async function updateRequest(id, action) {
  try {
    const { ok, result } = await postJson("api/request_update.php", { id, action });
    if (!ok) {
      showToast(result.error, true);
      return;
    }
    showToast(result.message);
    await loadData();
    render();
  } catch (error) {
    showToast("Unable to connect to the server.", true);
  }
}

function overviewPage() {
  const totalUnits = items.reduce((sum, item) => sum + item.total, 0);
  const goodUnits = items.reduce((sum, item) => item.condition === "Operational" ? sum + item.total : sum, 0);
  const health = totalUnits === 0 ? 0 : Math.round((goodUnits / totalUnits) * 100);
  const addedThisMonth = items.filter((item) => item.created_at.slice(0, 7) === todayString().slice(0, 7)).length;

  const borrowed = requests.filter((r) => r.status === "Approved").reduce((sum, r) => sum + r.quantity, 0);
  const pending = requests.filter((r) => r.status === "Pending").length;
  const overdue = requests.filter((r) => loanStatus(r) === "Overdue").length;
  const percentBorrowed = totalUnits === 0 ? 0 : Math.round((borrowed / totalUnits) * 100);

  const stats = [
    ["Total equipment", totalUnits, "cube", "indigo", `+${addedThisMonth} this month`],
    ["Currently borrowed", borrowed, "list", "violet", `${percentBorrowed}% of inventory`],
    ["Pending approval", String(pending).padStart(2, "0"), "clock", "amber", "Needs attention"],
    ["Overdue items", String(overdue).padStart(2, "0"), "calendar", "rose", overdue === 0 ? "All on time" : "Follow up today"]
  ];

  // The 5 newest requests
  const requestRows = requests.slice(0, 5).map((r) => {
    const initials = r.student.split(" ").filter(Boolean).map((word) => word[0]).slice(0, 2).join("").toUpperCase();
    return `
      <div class="grid gap-4 p-4 sm:grid-cols-[minmax(12rem,1.2fr)_minmax(10rem,1fr)_5rem_auto] sm:items-center sm:px-5">
        <div class="flex items-center gap-3">
          <div class="flex size-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600">${esc(initials)}</div>
          <div class="min-w-0">
            <div class="truncate text-sm font-bold text-slate-900">${esc(r.student)}</div>
            <div class="mt-0.5 truncate text-xs text-slate-400">${esc(r.department || "Student")}</div>
          </div>
        </div>
        <div>
          <div class="truncate text-sm font-semibold text-slate-700">${esc(itemLabel(r))}</div>
          <div class="mt-0.5 text-xs text-slate-400">${esc(r.code)} · ${requestNumber(r)}</div>
        </div>
        <div class="text-xs font-semibold text-slate-500">${formatDate(r.date_requested)}</div>
        <div class="flex flex-wrap items-center justify-end gap-2">${requestActions(r)}</div>
      </div>`;
  }).join("");

  const lowItems = items.filter((item) => item.available <= 3).sort((a, b) => a.available - b.available).slice(0, 4);
  const lowStock = lowItems.map((item) => `
    <div class="flex items-center gap-3">
      <div class="flex size-9 items-center justify-center rounded-lg visual-${esc(item.color)}">${icon(item.icon)}</div>
      <div class="min-w-0 flex-1">
        <div class="truncate text-xs font-bold">${esc(item.name)}</div>
        <div class="mt-0.5 text-[0.68rem] text-slate-400">${esc(item.code)}</div>
      </div>
      <span class="text-xs font-bold ${item.available === 0 ? "text-rose-500" : "text-amber-600"}">${item.available} left</span>
    </div>`).join("");

  const addButton = `<button onclick="editItem(0)" class="flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800">${icon("plus", "size-4")} Add equipment</button>`;

  return `
    ${pageHeader("Admin workspace", "LabTrack overview", "Manage equipment, review requests, and monitor lending activity.", addButton)}

    <section class="grid grid-cols-2 gap-3 pb-7 lg:grid-cols-4">${statCards(stats)}</section>

    <section class="grid gap-5 xl:grid-cols-[1fr_20rem]">
      <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div class="flex items-center justify-between border-b border-slate-200 p-5">
          <div>
            <h2 class="font-bold text-slate-950">Borrowing requests</h2>
            <p class="mt-1 text-xs text-slate-500">Review the latest student requests.</p>
          </div>
          <button onclick="go('requests')" class="text-xs font-bold text-violet-700">View all</button>
        </div>
        ${requestRows === "" ? `<p class="p-8 text-center text-sm text-slate-500">No requests yet.</p>` : `<div class="divide-y divide-slate-100">${requestRows}</div>`}
      </div>

      <div class="space-y-5">
        <div class="rounded-2xl bg-slate-950 p-6 text-white">
          <div class="flex items-center justify-between">
            <div class="flex size-10 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">${icon("shield")}</div>
            <span class="text-xs font-semibold text-violet-300">${health >= 80 ? "Good standing" : "Needs attention"}</span>
          </div>
          <h2 class="mt-6 font-bold">Inventory health</h2>
          <div class="mt-2 text-3xl font-bold">${health}%</div>
          <div class="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><div class="h-full rounded-full bg-violet-400" style="width: ${health}%"></div></div>
          <p class="mt-4 text-xs leading-5 text-slate-400">${goodUnits} of ${totalUnits} items are operational and ready for laboratory use.</p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 class="font-bold text-slate-950">Low availability</h2>
          <div class="mt-4 space-y-4">${lowStock === "" ? `<p class="text-xs text-slate-500">All equipment is well stocked.</p>` : lowStock}</div>
        </div>
      </div>
    </section>`;
}


// ---------- 13. ADMIN: INVENTORY (add, edit, delete equipment) ----------

// Counts in units. They add up: available + borrowed + maintenance = all.
function inventoryCounts() {
  const good = items.filter((item) => item.condition === "Operational");
  return {
    All: items.reduce((sum, item) => sum + item.total, 0),
    Available: good.reduce((sum, item) => sum + item.available, 0),
    Borrowed: good.reduce((sum, item) => sum + (item.total - item.available), 0),
    Maintenance: items.filter((item) => item.condition !== "Operational").reduce((sum, item) => sum + item.total, 0)
  };
}

function inventoryRows() {
  if (inventoryTab === "Available") return items.filter((item) => item.condition === "Operational" && item.available > 0);
  if (inventoryTab === "Borrowed") return items.filter((item) => item.condition === "Operational" && item.available < item.total);
  if (inventoryTab === "Maintenance") return items.filter((item) => item.condition !== "Operational");
  return items;
}

function setInventoryTab(name) {
  inventoryTab = name;
  renderContent();
}

function inventoryPage() {
  const counts = inventoryCounts();
  const tabs = ["All", "Available", "Borrowed", "Maintenance"].map((name) => `
    <button onclick="setInventoryTab('${name}')" class="whitespace-nowrap rounded-lg px-4 py-2 text-xs font-bold ${inventoryTab === name ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}">${name} ${counts[name]}</button>`).join("");

  const rows = inventoryRows().map((item) => `
    <div class="grid gap-4 border-b border-slate-100 p-4 last:border-0 md:grid-cols-[1.5fr_.7fr_.7fr_.7fr_auto] md:items-center md:px-5">
      <div class="flex items-center gap-3">
        <div class="flex size-11 items-center justify-center rounded-xl visual-${esc(item.color)}">${icon(item.icon, "size-6")}</div>
        <div>
          <div class="text-sm font-bold">${esc(item.name)}</div>
          <div class="mt-0.5 text-xs text-slate-400">${esc(item.code)}</div>
        </div>
      </div>
      <span class="text-xs font-semibold text-slate-500">${esc(item.category)}</span>
      <span class="text-xs font-bold ${item.available ? "text-violet-600" : "text-rose-500"}">${item.available} / ${item.total}</span>
      <span class="w-fit rounded-full bg-violet-50 px-2.5 py-1 text-[0.68rem] font-bold text-violet-700">${esc(item.condition)}</span>
      <button onclick="editItem(${item.id})" class="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50" aria-label="Edit ${esc(item.name)}">${icon("settings", "size-4")}</button>
    </div>`).join("");

  const addButton = `<button onclick="editItem(0)" class="flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white">${icon("plus", "size-4")} Add equipment</button>`;

  return pageHeader("Admin workspace", "Equipment inventory", "Monitor stock levels and equipment condition.", addButton) + `
    <div class="mb-5 flex gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1 sm:w-fit">${tabs}</div>
    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div class="hidden grid-cols-[1.5fr_.7fr_.7fr_.7fr_auto] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-[0.65rem] font-bold uppercase tracking-wider text-slate-400 md:grid">
        <span>Equipment</span><span>Category</span><span>Availability</span><span>Condition</span><span>Actions</span>
      </div>
      ${rows === "" ? `<p class="p-8 text-center text-sm text-slate-500">No equipment found.</p>` : rows}
    </div>`;
}

// Opens the pop-up form. id = 0 means "add new equipment".
function editItem(id) {
  const item = items.find((entry) => entry.id === id) ?? {
    id: 0, name: "", code: "", category_id: categories.length > 0 ? categories[0].id : 0,
    total: 1, available: 1, condition: "Operational", icon: "cube", color: "indigo"
  };

  const categoryOptions = categories.map((c) => [c.id, c.name]);
  const conditionOptions = ["Operational", "Inspection", "Maintenance"].map((name) => [name, name]);
  const iconOptions = ["cube", "beaker", "flask", "microscope", "thermometer"].map((name) => [name, name]);
  const colorOptions = ["indigo", "cyan", "amber", "violet", "emerald", "rose"].map((name) => [name, name]);

  openModal(id === 0 ? "Add equipment" : "Edit equipment", `
    <div class="space-y-4">
      ${textField("Name", "item-name", item.name)}
      ${textField("Code (for example MIC-204)", "item-code", item.code)}
      ${selectField("Category", "item-category", categoryOptions, item.category_id)}
      <div class="grid grid-cols-2 gap-4">
        ${textField("Total units", "item-total", item.total, "number", 'min="1"')}
        ${textField("Available units", "item-available", item.available, "number", 'min="0"')}
      </div>
      ${selectField("Condition", "item-condition", conditionOptions, item.condition)}
      <div class="grid grid-cols-2 gap-4">
        ${selectField("Icon", "item-icon", iconOptions, item.icon)}
        ${selectField("Card color", "item-color", colorOptions, item.color)}
      </div>
      <div class="flex items-center gap-3 pt-2">
        <button onclick="saveItem(${item.id})" class="rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800">Save</button>
        <button onclick="closeModal()" class="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">Cancel</button>
        ${id !== 0 ? `<button onclick="deleteItem(${item.id})" class="ml-auto rounded-xl px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50">Delete</button>` : ""}
      </div>
    </div>`);
}

// CREATE or UPDATE equipment
async function saveItem(id) {
  const data = {
    id,
    name: $("item-name").value.trim(),
    code: $("item-code").value.trim(),
    category_id: Number($("item-category").value),
    total_units: Number($("item-total").value),
    available_units: Number($("item-available").value),
    condition_status: $("item-condition").value,
    icon: $("item-icon").value,
    color: $("item-color").value
  };

  if (data.name === "" || data.code === "") {
    showToast("Please complete all required fields.", true);
    return;
  }

  try {
    const { ok, result } = await postJson("api/item_save.php", data);
    if (!ok) {
      showToast(result.error, true);
      return;
    }
    closeModal();
    showToast(result.message);
    await loadData();
    render();
  } catch (error) {
    showToast("Unable to connect to the server.", true);
  }
}

// DELETE equipment
async function deleteItem(id) {
  if (!confirm("Delete this equipment? This cannot be undone.")) return;

  try {
    const { ok, result } = await postJson("api/item_delete.php", { id });
    if (!ok) {
      showToast(result.error, true);
      return;
    }
    closeModal();
    showToast(result.message);
    await loadData();
    render();
  } catch (error) {
    showToast("Unable to connect to the server.", true);
  }
}


// ---------- 14. ADMIN: BORROWING REQUESTS AND LENDING HISTORY ----------
function requestsPage() {
  const rows = requests.map((r) =>
    recordRow(r.student, requestNumber(r), itemLabel(r), `Return ${formatDate(r.return_date)}`, requestActions(r))
  ).join("");

  return pageHeader("Admin workspace", "Borrowing requests", "Review and process requests submitted by students.") +
    recordsCard("All requests", rows, "No requests yet.");
}

function lendingPage() {
  // Only items that were really lent out (approved or returned)
  const lent = requests.filter((r) => r.status === "Approved" || r.status === "Returned");

  const rows = lent.map((r) => {
    let info1 = `Borrowed ${formatDate(r.date_reviewed)}`;
    let info2 = `Due ${formatDate(r.return_date)}`;
    if (r.status === "Returned") {
      [info1, info2] = historyInfo(r);
    }
    return recordRow(itemLabel(r), `${requestNumber(r)} · ${r.student}`, info1, info2, badge(loanStatus(r)));
  }).join("");

  return pageHeader("Admin workspace", "Lending history", "A complete log of equipment lending activity.") +
    recordsCard("Activity records", rows, "No records found.");
}


// ---------- 14b. ADMIN: MANAGE USERS ----------
function usersPage() {
  const students = users.filter((u) => u.role === "student").length;
  const admins = users.filter((u) => u.role === "admin").length;
  const suspended = users.filter((u) => u.status === "Suspended").length;

  const stats = [
    ["Total accounts", users.length, "list", "indigo", ""],
    ["Students", students, "beaker", "indigo", ""],
    ["Administrators", admins, "shield", "amber", ""],
    ["Suspended", suspended, "clock", "rose", ""]
  ];

  const tabs = ["All users", "Students", "Administrators"].map((name) => `
    <button onclick="setUsersTab('${name}')" class="whitespace-nowrap rounded-lg px-4 py-2 text-xs font-bold ${usersTab === name ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-800"}">${name}</button>`).join("");

  // Green message after an action (can be closed)
  const notice = usersNotice === "" ? "" : `
    <div class="mb-5 flex items-center justify-between gap-3 rounded-xl bg-violet-50 px-4 py-3 text-xs font-semibold text-violet-900">
      <span class="flex items-center gap-3"><span class="text-violet-600">${icon("check", "size-4")}</span>${esc(usersNotice)}</span>
      <button onclick="dismissUsersNotice()" class="text-violet-600 hover:text-violet-900" aria-label="Close message">${icon("close", "size-4")}</button>
    </div>`;

  return pageHeader("Admin workspace", "Manage users", "View accounts, update access levels, and remove users.") +
    notice + `
    <section class="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">${statCards(stats)}</section>

    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div class="flex flex-col gap-4 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">
        <div class="relative md:w-96">
          <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">${icon("search", "size-4")}</span>
          <input id="user-search" value="${esc(userQuery)}" oninput="setUserQuery(this.value)" placeholder="Search name, email, or ID…" aria-label="Search accounts"
            class="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100">
        </div>
        <div class="flex gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1">${tabs}</div>
      </div>
      <div class="hidden grid-cols-[1.6fr_1fr_.8fr_.6fr_auto] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-[0.65rem] font-bold uppercase tracking-wider text-slate-400 md:grid">
        <span>Account</span><span>Department</span><span>Role</span><span>Status</span><span>Actions</span>
      </div>
      <div id="user-rows">${userRowsHtml()}</div>
    </div>`;
}

// The rows of the table (filtered by the tab and the search text)
function userRowsHtml() {
  const search = userQuery.toLowerCase();

  const visible = users.filter((u) => {
    const tabMatch = usersTab === "All users" ||
      (usersTab === "Students" && u.role === "student") ||
      (usersTab === "Administrators" && u.role === "admin");
    const textMatch = [u.full_name, u.email, u.student_id || ""].some((text) => text.toLowerCase().includes(search));
    return tabMatch && textMatch;
  });

  if (visible.length === 0) {
    return `<p class="p-8 text-center text-sm text-slate-500">No accounts found.</p>`;
  }

  const button = "rounded-lg border px-3 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-40";

  return visible.map((u) => {
    const isMe = u.id === currentUser.id;
    const active = u.status === "Active";

    const roleBadge = u.role === "admin"
      ? `<span class="rounded-full bg-violet-50 px-2.5 py-1 text-[0.68rem] font-bold text-violet-700">Administrator</span>`
      : `<span class="rounded-full bg-indigo-50 px-2.5 py-1 text-[0.68rem] font-bold text-indigo-700">Student</span>`;

    const statusHtml = `
      <span class="flex items-center gap-2 text-xs font-semibold ${active ? "text-emerald-600" : "text-rose-500"}">
        <span class="size-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-rose-500"}"></span>${esc(u.status)}
      </span>`;

    const roleButton = u.role === "admin"
      ? `<button ${isMe ? "disabled" : ""} onclick="changeUser(${u.id}, 'demote')" class="${button} border-slate-200 text-slate-600 hover:bg-slate-50">Demote</button>`
      : `<button onclick="changeUser(${u.id}, 'promote')" class="${button} border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100">Promote</button>`;

    const statusButton = active
      ? `<button ${isMe ? "disabled" : ""} onclick="changeUser(${u.id}, 'suspend')" class="${button} border-slate-200 text-amber-700 hover:bg-amber-50">Suspend</button>`
      : `<button onclick="changeUser(${u.id}, 'activate')" class="${button} border-slate-200 text-emerald-700 hover:bg-emerald-50">Activate</button>`;

    const removeButton = `<button ${isMe ? "disabled" : ""} onclick="removeUser(${u.id})" class="${button} border-slate-200 text-rose-600 hover:bg-rose-50">Remove</button>`;

    return `
      <div class="grid gap-4 border-b border-slate-100 px-5 py-4 last:border-0 md:grid-cols-[1.6fr_1fr_.8fr_.6fr_auto] md:items-center">
        <div class="flex items-center gap-3">
          <div class="flex size-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600">${esc(initialsOf(u.full_name))}</div>
          <div class="min-w-0">
            <div class="truncate text-sm font-bold text-slate-900">${esc(u.full_name)}${isMe ? ` <span class="ml-1 text-[0.65rem] font-normal text-slate-400">(You)</span>` : ""}</div>
            <div class="mt-0.5 truncate text-xs text-slate-400">${esc(u.email)}${u.student_id ? ` · ${esc(u.student_id)}` : ""}</div>
          </div>
        </div>
        <div class="text-xs font-semibold text-slate-500">${esc(u.department || "—")}</div>
        <div>${roleBadge}</div>
        <div>${statusHtml}</div>
        <div class="flex flex-wrap items-center gap-2 md:justify-end">${roleButton}${statusButton}${removeButton}</div>
      </div>`;
  }).join("");
}

function setUsersTab(name) {
  usersTab = name;
  renderContent();
}

// Only redraws the rows (so the search box keeps focus while typing)
function setUserQuery(text) {
  userQuery = text;
  $("user-rows").innerHTML = userRowsHtml();
}

function dismissUsersNotice() {
  usersNotice = "";
  renderContent();
}

// UPDATE: promote, demote, suspend, or reactivate an account
async function changeUser(id, action) {
  const user = users.find((u) => u.id === id);
  const messages = {
    promote: `${user.full_name} is now an administrator.`,
    demote: `${user.full_name} is now a student.`,
    suspend: `${user.full_name}'s account was suspended.`,
    activate: `${user.full_name}'s account was reactivated.`
  };

  try {
    const { ok, result } = await postJson("api/user_update.php", { id, action });
    if (!ok) {
      showToast(result.error, true);
      return;
    }
    usersNotice = messages[action];
    await loadData();
    render();
  } catch (error) {
    showToast("Unable to connect to the server.", true);
  }
}

// DELETE: remove an account
async function removeUser(id) {
  const user = users.find((u) => u.id === id);
  if (!confirm(`Remove ${user.full_name}'s account? Their requests and messages will be deleted too.`)) return;

  try {
    const { ok, result } = await postJson("api/user_delete.php", { id });
    if (!ok) {
      showToast(result.error, true);
      return;
    }
    usersNotice = `${user.full_name}'s account was removed.`;
    await loadData();
    render();
  } catch (error) {
    showToast("Unable to connect to the server.", true);
  }
}


// ---------- 15. HELP CENTER ----------
// The text is sample text: change it to match your laboratory's real rules.
const guideList = [
  {
    title: "Borrowing equipment",
    icon: "beaker",
    summary: "Learn how to find items, submit a request, and collect approved equipment.",
    subtitle: "Everything you need to request and collect laboratory equipment.",
    intro: "LabTrack makes equipment requests quick and traceable. Follow these steps before visiting the laboratory counter.",
    steps: [
      ["Find your equipment", "Browse the catalog, use category filters, and confirm that the item is currently available."],
      ["Submit a request", "Add the items and quantities you need, choose an expected return date, and submit the request for review."],
      ["Wait for approval", "Your laboratory supervisor will approve or decline the request. You will receive an update in My Borrowings."],
      ["Collect your items", "Bring your student ID to the laboratory counter and inspect each item before accepting it."]
    ]
  },
  {
    title: "Returns and extensions",
    icon: "calendar",
    summary: "Understand return dates, renewals, and what to do if an item is overdue.",
    subtitle: "How to return items, request more time, and avoid overdue loans.",
    intro: "Returning equipment on time keeps shared resources available to everyone and protects your borrowing privileges.",
    steps: [
      ["Check the due date", "Your active due dates are visible in My Borrowings and in reminder notifications."],
      ["Request an extension", "Contact the laboratory before the due date. Extensions depend on pending requests and availability."],
      ["Return to the counter", "Return all components together and allow the laboratory team to inspect the equipment."],
      ["Confirm completion", "The loan changes to Returned after inspection. Report any issues or damage immediately."]
    ]
  },
  {
    title: "Safety and responsibility",
    icon: "shield",
    summary: "Review handling rules and laboratory equipment safety requirements.",
    subtitle: "Essential practices for handling shared laboratory equipment.",
    intro: "Every borrower is responsible for safe handling, proper storage, and accurate reporting while equipment is in their care.",
    steps: [
      ["Complete required training", "Only request equipment that you are trained and authorized to operate."],
      ["Inspect before use", "Check cables, glassware, calibration, and safety guards before leaving the laboratory."],
      ["Use approved procedures", "Follow laboratory SOPs and never modify, disassemble, or lend equipment to another person."],
      ["Report incidents", "Stop using damaged equipment and contact the laboratory team as soon as possible."]
    ]
  }
];

function openGuide(index) {
  guideIndex = index;
  go("guide");
}

function backToHelp() {
  return `<button onclick="go('help')" class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 hover:bg-slate-50">${icon("arrow", "size-4 rotate-180")} Back to help</button>`;
}

function helpPage() {
  const cards = guideList.map((guide, index) => `
    <button onclick="openGuide(${index})" class="rounded-2xl border border-slate-200 bg-white p-6 text-left transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-lg">
      <div class="flex size-11 items-center justify-center rounded-xl bg-violet-50 text-violet-700">${icon(guide.icon)}</div>
      <h2 class="mt-5 font-bold text-slate-950">${guide.title}</h2>
      <p class="mt-2 text-sm leading-6 text-slate-500">${guide.summary}</p>
      <div class="mt-5 flex items-center gap-2 text-xs font-bold text-violet-700">Read guide ${icon("arrow", "size-3.5")}</div>
    </button>`).join("");

  return pageHeader("Support", "Help center", "Guides and answers for using the laboratory hub.") + `
    <div class="grid gap-4 md:grid-cols-3">${cards}</div>
    <div class="mt-5 flex flex-col items-start justify-between gap-4 rounded-2xl bg-slate-950 p-6 text-white sm:flex-row sm:items-center">
      <div>
        <h2 class="font-bold">Still need help?</h2>
        <p class="mt-1 text-sm text-slate-400">The laboratory team usually replies within one working day.</p>
      </div>
      <button onclick="go('contact')" class="rounded-xl bg-violet-400 px-5 py-3 text-sm font-bold text-slate-950">Contact laboratory</button>
    </div>`;
}

function guidePage() {
  const guide = guideList[guideIndex];

  const steps = guide.steps.map(([title, text], number) => `
    <li class="flex gap-4">
      <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">${number + 1}</span>
      <div>
        <div class="text-sm font-bold text-slate-950">${title}</div>
        <p class="mt-1 text-sm leading-6 text-slate-500">${text}</p>
      </div>
    </li>`).join("");

  return pageHeader("Help center · Guide", guide.title, guide.subtitle, backToHelp()) + `
    <div class="grid gap-5 lg:grid-cols-[1fr_20rem] lg:items-start">
      <div class="rounded-2xl border border-slate-200 bg-white p-8">
        <div class="flex size-12 items-center justify-center rounded-xl bg-violet-50 text-violet-700">${icon(guide.icon, "size-6")}</div>
        <p class="mt-6 max-w-2xl text-sm leading-7 text-slate-600">${guide.intro}</p>
        <ol class="mt-8 space-y-6">${steps}</ol>
      </div>
      <div class="rounded-2xl bg-violet-600 p-6 text-white">
        <div class="flex size-10 items-center justify-center rounded-full border border-white/40">${icon("help")}</div>
        <h2 class="mt-6 font-bold">Have a question?</h2>
        <p class="mt-2 text-xs leading-5 text-violet-100">Contact the laboratory team if this guide does not answer your question.</p>
        <button onclick="go('contact')" class="mt-5 w-full rounded-xl bg-white py-3 text-xs font-bold text-violet-700 hover:bg-violet-50">Contact support</button>
      </div>
    </div>`;
}

function contactPage() {
  const topics = ["Borrowing request", "Returns and extensions", "Damaged equipment", "Equipment availability", "Account problem", "Other"];
  const topicOptions = topics.map((name) => [name, name]);

  const infoCards = [
    ["clock", "Response time", "Within one working day"],
    ["calendar", "Laboratory hours", "Mon–Fri · 8:00–17:00"],
    ["shield", "Urgent safety issue", "Call extension 204"]
  ].map(([iconName, title, text]) => `
    <div class="rounded-2xl border border-slate-200 bg-white p-5">
      <div class="flex size-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700">${icon(iconName, "size-4")}</div>
      <div class="mt-4 text-sm font-bold text-slate-950">${title}</div>
      <div class="mt-1 text-xs text-slate-500">${text}</div>
    </div>`).join("");

  const readonlyStyle = fieldStyle + " bg-slate-50 text-slate-500";

  return pageHeader("Help center", "Contact the laboratory", "Send a message to the equipment support team.", backToHelp()) + `
    <div class="grid gap-5 lg:grid-cols-[1fr_20rem] lg:items-start">
      <div class="rounded-2xl border border-slate-200 bg-white p-8">
        <h2 class="font-bold text-slate-950">How can we help?</h2>
        <div class="mt-6 grid gap-5 sm:grid-cols-2">
          <label class="block text-xs font-bold text-slate-600">Your name
            <input value="${esc(currentUser.full_name)}" readonly class="${readonlyStyle}">
          </label>
          <label class="block text-xs font-bold text-slate-600">${currentUser.role === "admin" ? "Staff ID" : "Student ID"}
            <input value="${esc(currentUser.student_id || "")}" readonly class="${readonlyStyle}">
          </label>
        </div>
        <div class="mt-5">${selectField("Topic", "contact-topic", topicOptions, "Borrowing request")}</div>
        <label class="mt-5 block text-xs font-bold text-slate-600" for="contact-message">Message
          <textarea id="contact-message" rows="5" maxlength="1000" placeholder="Tell us what you need help with…"
            class="mt-2 w-full rounded-xl border border-slate-200 p-4 text-sm font-normal outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"></textarea>
        </label>
        <button onclick="sendMessage()" class="mt-6 flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800">Send message ${icon("arrow", "size-4")}</button>
      </div>
      <div class="space-y-4">${infoCards}</div>
    </div>`;
}

// CREATE: save the message in the database
async function sendMessage() {
  const topic = $("contact-topic").value;
  const message = $("contact-message").value.trim();

  if (message.length < 10) {
    showToast("Please write a message of at least 10 characters.", true);
    return;
  }

  try {
    const { ok, result } = await postJson("api/message_send.php", { topic, message });
    if (!ok) {
      showToast(result.error, true);
      return;
    }
    $("contact-message").value = "";
    showToast(result.message);
  } catch (error) {
    showToast("Unable to connect to the server.", true);
  }
}


// ---------- 16. SETTINGS ----------

// Notification choices are saved in the browser (Web Storage: localStorage)
const defaultNotifications = { "Request updates": true, "Return reminders": true, "Inventory alerts": false };

function loadNotificationSettings() {
  try {
    return { ...defaultNotifications, ...JSON.parse(localStorage.getItem("notifications")) };
  } catch (error) {
    return { ...defaultNotifications };
  }
}

function saveNotification(name, checked) {
  const settings = loadNotificationSettings();
  settings[name] = checked;
  localStorage.setItem("notifications", JSON.stringify(settings));
}

function settingsPage() {
  // [label, value, extra attribute, id]
  const fields = [
    ["Full name", currentUser.full_name, "", "set-name"],
    [currentUser.role === "admin" ? "Staff ID" : "Student ID", currentUser.student_id || "", "readonly", "set-student-id"],
    ["Email address", currentUser.email, "", "set-email"],
    ["Department", currentUser.department || "", "", "set-department"]
  ];
  const settings = loadNotificationSettings();

  return pageHeader("Account", "Settings", "Manage your profile, notifications, and preferences.") + `
    <div class="grid gap-5 lg:grid-cols-[1fr_20rem]">
      <div class="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 class="font-bold text-slate-950">Profile information</h2>
        <div class="mt-6 grid gap-5 sm:grid-cols-2">
          ${fields.map(([label, value, extra, id]) => `
            <label class="text-xs font-bold text-slate-600">${label}
              <input id="${id}" value="${esc(value)}" ${extra} class="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm font-normal outline-none focus:border-violet-500 ${extra ? "bg-slate-50 text-slate-500" : ""}">
            </label>`).join("")}
        </div>
        <button onclick="saveProfile()" class="mt-6 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">Save changes</button>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 class="font-bold text-slate-950">Notifications</h2>
        <div class="mt-5 space-y-5">
          ${Object.keys(defaultNotifications).map((name) => `
            <label class="flex items-center justify-between gap-4 text-sm font-semibold text-slate-700">
              ${name}<input type="checkbox" ${settings[name] ? "checked" : ""} onchange="saveNotification('${name}', this.checked)" class="size-4 accent-violet-500">
            </label>`).join("")}
        </div>
      </div>
    </div>`;
}

// UPDATE: save the profile
async function saveProfile() {
  const fullName = $("set-name").value.trim();
  const email = $("set-email").value.trim();
  const department = $("set-department").value.trim();

  if (fullName === "" || email === "") {
    showToast("Please complete all required fields.", true);
    return;
  }

  try {
    const { ok, result } = await postJson("api/update_profile.php", { full_name: fullName, email, department });
    if (!ok) {
      showToast(result.error, true);
      return;
    }
    currentUser = result.user;
    renderUserCard();   // update the name in the sidebar
    renderHeader();     // update the greeting
    showToast(result.message);
  } catch (error) {
    showToast("Unable to connect to the server.", true);
  }
}


// ---------- 17. START ----------
// Put the icons into the fixed parts of the HTML page.
function setupIcons() {
  $("login-logo").innerHTML = icon("flask", "size-7");
  $("login-logo-small").innerHTML = icon("flask");
  $("login-badge-icon").innerHTML = icon("shield", "size-4");
  $("admin-badge-icon").innerHTML = icon("shield", "size-4");
  $("admin-footer-icon").innerHTML = icon("shield", "size-4");
  $("auth-back-icon").innerHTML = icon("arrow", "size-4 rotate-180");
  $("login-arrow").innerHTML = icon("arrow", "size-4");
  $("header-search-icon").innerHTML = icon("search", "size-4");
  $("sidebar-logo").innerHTML = icon("flask", "size-6");
  $("role-student-icon").innerHTML = icon("beaker");
  $("role-admin-icon").innerHTML = icon("shield");
  $("role-student-check").innerHTML = icon("check", "size-3");
  $("role-admin-check").innerHTML = icon("check", "size-3");
  $("close-menu-btn").innerHTML = icon("close");
  $("open-menu-btn").innerHTML = icon("menu");
  $("request-btn-icon").innerHTML = icon("list", "size-4");
  $("close-drawer-btn").innerHTML = icon("close");
  $("close-modal-btn").innerHTML = icon("close");
}

// The Escape key closes the pop-up and the request drawer
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
    closeBasket();
  }
});

setupIcons();
checkSession();
