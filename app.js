// =====================================================
// LabTrack - Laboratory Borrowing System (plain JavaScript)
// All data comes from MySQL through the PHP files in the api folder.
// =====================================================


// ---------- 1. ICONS ----------
// Each icon is just the inside of an SVG. icon("plus") gives you a full <svg>.
const iconPaths = {
  arrow: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  inbox: '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  send: '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
  tag: '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',
  archive: '<rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  testtube: '<path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5s-2.5-1.1-2.5-2.5V2"/><path d="M8.5 2h7"/><path d="M14.5 16h-5"/>',
  tongs: '<path d="M8 2l4 5 4-5"/><path d="M12 7c-4 4-4 9-1 14"/><path d="M12 7c4 4 4 9 1 14"/><circle cx="12" cy="7" r="1"/>',
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  hotplate: '<rect x="3" y="14" width="18" height="6" rx="2"/><path d="M8 4c-1 1.5 1 2.5 0 4M12 4c-1 1.5 1 2.5 0 4M16 4c-1 1.5 1 2.5 0 4"/>',
  pipette: '<path d="m2 22 1-1h3l9-9"/><path d="M3 21v-3l9-9"/><path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z"/>',
  funnel: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
  goggles: '<circle cx="6" cy="15" r="4"/><circle cx="18" cy="15" r="4"/><path d="M14 15a2 2 0 0 0-2-2 2 2 0 0 0-2 2"/><path d="M2.5 13 5 7c.7-1.3 1.4-2 3-2"/><path d="M21.5 13 19 7c-.7-1.3-1.5-2-3-2"/>',
  gloves: '<path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>',
  stand: '<path d="M4 21h10"/><path d="M8 21V3"/><path d="M8 7h9a2 2 0 0 1 2 2v1"/><path d="M8 13h6"/>',
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
let requests = [];     // borrowing requests (admin: all, professor: sent to them, student: their own)
let professors = [];   // active professors (a student chooses one)
let messages = [];     // contact messages (admin: everyone's, others: their own)
let lastLoadError = ""; // which files failed to load last time (so the red message is not repeated)

// Messages page / Support updates page
let selectedMessageId = null;   // the message that is open
let messageFilter = "All";      // "All" or "Unread" (administrator)
let messageQuery = "";          // text in the search box

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
let classForm = newClassForm();   // the class details typed in the request drawer

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
  if (!text) return "—";
  return parseDate(text).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// "13:00" or "13:00:00" -> "1:00 PM"
function formatTime(text) {
  if (!text) return "";
  const [hours, minutes] = text.split(":").map(Number);
  const time = new Date();
  time.setHours(hours, minutes);
  return time.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

// A date and a time next to each other: "Oct 21 · 1:00 PM"
function whenText(date, time) {
  return formatDate(date) + (time ? ` · ${formatTime(time)}` : "");
}

// "2026-10-21 13:00:00" -> "Oct 21 · 1:00 PM" (old records without a time show only the date)
function formatDateTime(text) {
  if (!text) return "—";
  const hasTime = text.length > 10 && !text.endsWith("00:00:00");
  return hasTime ? whenText(text, text.slice(11, 16)) : formatDate(text);
}

// How long between two moments: "3 hr" or "2 days"
function durationText(from, to) {
  const hours = (new Date(to.replace(" ", "T")) - new Date(from.replace(" ", "T"))) / (60 * 60 * 1000);
  if (hours < 24) return `${Math.max(1, Math.round(hours))} hr`;
  return plural(Math.round(hours / 24), "day");
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

  // Late means: the promised date AND time already passed (no time saved = end of that day)
  const time = request.return_time ? request.return_time.slice(0, 5) : "23:59";
  const dueAt = new Date(`${request.return_date}T${time}`);
  if (new Date() > dueAt) return "Overdue";

  if (daysUntil(request.return_date) <= 3) return "Due soon";
  return "Active";
}

function itemLabel(request) {          // "Compound Microscope" or "Compound Microscope × 3"
  return request.quantity > 1 ? `${request.item} × ${request.quantity}` : request.item;
}

function initialsOf(name) {            // "Alex Morgan" -> "AM"
  return name.split(" ").filter(Boolean).map((word) => word[0]).slice(0, 2).join("").toUpperCase();
}

// The icons and colors an administrator can choose for equipment: [value, name]
const iconChoices = [["cube", "Cube"], ["beaker", "Beaker"], ["flask", "Flask"], ["microscope", "Microscope"],
  ["thermometer", "Thermometer"], ["testtube", "Test tube"], ["tongs", "Tongs"], ["flame", "Flame (burner)"],
  ["hotplate", "Hot plate"], ["pipette", "Pipette"], ["funnel", "Funnel"], ["goggles", "Safety goggles"],
  ["gloves", "Gloves"], ["stand", "Stand and clamp"]];
const colorChoices = ["indigo", "cyan", "amber", "violet", "emerald", "rose", "teal", "orange", "sky", "fuchsia", "lime"]
  .map((name) => [name, name.charAt(0).toUpperCase() + name.slice(1)]);

// Units of an item that are borrowed right now
function borrowedUnits(item) {
  return item.total - item.available - item.inspection;
}

// What to show in the "Condition" column
function conditionLabel(item) {
  if (item.inspection === 0) return "Operational";
  if (item.inspection >= item.total) return "Inspection";
  return `${item.inspection} in inspection`;
}

// The class details a student types in the request drawer
function newClassForm() {
  return {
    professor_id: "",
    course_code: "",
    course_name: "",
    section: "",
    schedule: "",
    purpose: "",
    date_needed: todayString(),
    time_needed: "08:00",
    return_date: dateString(addDays(new Date(), 7)),
    return_time: "17:00"
  };
}

// Colored label for a status like "Pending" or "Approved"
function badge(status) {
  const labels = { Pending: "Awaiting professor" };   // the name shown to people
  let style = "bg-rose-50 text-rose-600";
  if (["Active", "Returned", "Approved", "Operational"].includes(status)) {
    style = "bg-violet-50 text-violet-700";
  } else if (["Pending", "Due soon"].includes(status)) {
    style = "bg-amber-50 text-amber-700";
  } else if (status === "Authorized") {
    style = "bg-indigo-50 text-indigo-700";
  }
  return `<span class="w-fit rounded-full px-2.5 py-1 text-[0.68rem] font-bold ${style}">${esc(labels[status] ?? status)}</span>`;
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

// Change the texts and fields depending on the form:
// "login", "register" (student), "professor" (sign up) or "admin" (sign up)
function updateAuthTexts() {
  const registering = authMode === "register";
  const staff = authMode === "professor" || authMode === "admin";
  const creating = registering || staff;

  const eyebrows = { login: "Welcome back", register: "Get started", professor: "Professor access", admin: "Administrator access" };
  const titles = {
    login: "Sign in to your account",
    register: "Create your student account",
    professor: "Create your professor account",
    admin: "Create your admin account"
  };
  const subtitles = {
    login: "Choose your workspace and enter your credentials.",
    register: "Fill in your details to register.",
    professor: "Enter your staff details and institutional access code.",
    admin: "Enter your staff details and institutional access code."
  };
  const buttons = {
    register: "Create account",
    professor: "Create professor account",
    admin: "Create admin account"
  };
  const roleNames = { student: "student", professor: "professor", admin: "administrator" };

  $("auth-eyebrow").textContent = eyebrows[authMode];
  $("auth-title").textContent = titles[authMode];
  $("auth-subtitle").textContent = subtitles[authMode];
  $("login-button-text").textContent = buttons[authMode] ?? `Sign in as ${roleNames[loginRole]}`;

  // The link under the button
  const links = {
    student: ["New student?", "Create an account"],
    professor: ["Need professor access?", "Create a professor account"],
    admin: ["Need administrator access?", "Create an admin account"]
  };
  [$("auth-switch-text").textContent, $("auth-switch-link").textContent] =
    creating ? ["Already have an account?", "Sign in"] : links[loginRole];

  const footnotes = {
    professor: "Professor creation attempts are logged<br>for institutional security.",
    admin: "Administrator creation attempts are logged<br>for institutional security."
  };
  $("auth-footnote").innerHTML = footnotes[authMode] ?? "By signing in, you agree to the laboratory's<br>equipment use and safety policies.";

  $("email-label").textContent = staff ? "Work email address" : "Email address";
  $("login-email").placeholder = staff ? "name@labtrack.edu" : (registering ? "student@labtrack.edu" : `${loginRole}@labtrack.edu`);
  $("login-password").placeholder = creating ? "At least 8 characters" : "Enter your password";

  // Sign up fields
  $("register-fields").classList.toggle("hidden", !creating);
  $("register-name").placeholder = { professor: "Prof. Elise Grant", admin: "Dr. Jordan Davis" }[authMode] ?? "Alex Morgan";
  $("register-id-label").textContent = staff ? "Staff ID" : "Student ID";
  $("register-id").placeholder = { professor: "PROF-0008", admin: "ADM-0014" }[authMode] ?? "STU-2024-081";
  $("register-department").placeholder = { professor: "Biological Sciences", admin: "Laboratory Services" }[authMode] ?? "Biochemistry";
  $("admin-code-box").classList.toggle("hidden", !staff);
  $("code-label").textContent = authMode === "professor" ? "Professor access code" : "Administrator access code";

  // The sign in button is darker blue for professors, as in the design
  $("login-button").classList.toggle("bg-slate-800", authMode === "professor");
  $("login-button").classList.toggle("bg-slate-950", authMode !== "professor");

  // Sign in only parts
  $("role-cards").classList.toggle("hidden", creating);
  $("login-extras").classList.toggle("hidden", creating);
  $("auth-back").classList.toggle("hidden", !staff);

  // The dark left side has three versions
  $("left-default").classList.toggle("hidden", staff);
  $("left-admin").classList.toggle("hidden", authMode !== "admin");
  $("left-professor").classList.toggle("hidden", authMode !== "professor");
}

function setAuthMode(mode) {
  authMode = mode;
  hideAuthMessage();
  updateAuthTexts();
}

// The link under the button: open the right sign up form (or go back to sign in)
function toggleAuthMode() {
  if (authMode !== "login") {
    setAuthMode("login");
    return;
  }
  const signUpForms = { student: "register", professor: "professor", admin: "admin" };
  setAuthMode(signUpForms[loginRole]);
}

function selectRole(newRole) {
  loginRole = newRole;
  ["student", "professor", "admin"].forEach((name) => {
    $(`role-${name}`).classList.toggle("active", name === newRole);
  });
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
  const type = authMode === "register" ? "student" : authMode;   // "student", "professor" or "admin"
  const staff = type !== "student";
  const fullName = $("register-name").value.trim();
  const idNumber = $("register-id").value.trim();
  const department = $("register-department").value.trim();
  const accessCode = $("register-code").value.trim();

  if (fullName === "") {
    showAuthMessage("Please enter your full name.");
    return;
  }
  // The ID and the department are required for everyone
  if (idNumber === "" || department === "") {
    showAuthMessage(staff ? "Please complete all required fields." : "Please enter your student ID and department.");
    return;
  }
  if (staff && accessCode === "") {
    showAuthMessage("Please complete all required fields.");
    return;
  }

  const { ok, result } = await postJson("api/register.php", {
    account_type: type,
    full_name: fullName,
    email,
    password,
    student_id: idNumber,
    department,
    access_code: accessCode
  });

  if (!ok) {
    showAuthMessage(result.error);
    return;
  }

  // Success: go back to the sign in form, with the matching card selected
  authMode = "login";
  selectRole(type);
  $("login-password").value = "";
  $("register-code").value = "";
  showAuthMessage(result.message, false);
}

// Called after PHP says the login is correct
async function startSession(user) {
  currentUser = user;
  role = user.role;
  const firstPages = { student: "browse", professor: "authorizations", admin: "overview" };
  panel = firstPages[role];

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
  loadPublicStats();
}


// ---------- 5. LOADING DATA FROM THE DATABASE ----------
// Gets the equipment and the requests at the same time (Promise.all).
async function loadData() {
  try {
    const calls = [fetch("api/items.php"), fetch("api/requests.php"), fetch("api/messages.php")];
    if (role === "admin") calls.push(fetch("api/users.php"));   // only administrators see the accounts
    const responses = await Promise.all(calls);

    if (responses.some((response) => response.status === 401)) {
      showToast("Your session has expired. Please sign in again.", true);
      await logout();
      return;
    }

    // Read every answer on its own, so one broken file does not stop the others
    const [itemsData, requestsData, messagesData, usersData] = await Promise.all(
      responses.map((response) => response.json().catch(() => null))
    );

    // Tell the person WHICH file failed (a PHP error or a missing database column gives no list)
    const checks = [["items", itemsData?.items], ["requests", requestsData?.requests], ["messages", messagesData?.messages]];
    if (role === "admin") checks.push(["users", usersData?.users]);
    const problem = checks.filter(([, list]) => !Array.isArray(list)).map(([name]) => name).join(", ");

    if (problem !== "" && problem !== lastLoadError) {
      showToast(`Could not load: ${problem}. Check that the PHP files are in the api folder and that the database is up to date.`, true);
    }
    lastLoadError = problem;

    if (Array.isArray(itemsData?.items)) {
      categories = itemsData.categories;
      professors = itemsData.professors ?? [];
      items = itemsData.items.map((row) => ({
        id: Number(row.id),
        name: row.name,
        code: row.code,
        category: row.category,
        category_id: Number(row.category_id),
        available: Number(row.available_units),
        total: Number(row.total_units),
        inspection: Number(row.inspection_units),
        icon: row.icon,
        color: row.color,
        created_at: row.created_at
      }));
    }
    if (Array.isArray(requestsData?.requests)) {
      requests = requestsData.requests.map((row) => ({ ...row, id: Number(row.id), quantity: Number(row.quantity) }));
    }
    if (Array.isArray(messagesData?.messages)) {
      messages = messagesData.messages.map((row) => ({ ...row, id: Number(row.id), user_id: Number(row.user_id) }));
    }
    if (Array.isArray(usersData?.users)) {
      users = usersData.users.map((row) => ({ ...row, id: Number(row.id) }));
    }
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
  renderBell();
}

// Sidebar links
function navButton(id, iconName, label, extra = "") {
  const helpPages = ["help", "guide", "contact"];
  const active = panel === id || (id === "help" && helpPages.includes(panel)) ? "nav-item-active" : "";
  return `<button onclick="go('${id}')" class="nav-item ${active}">${icon(iconName)} ${label} ${extra}</button>`;
}

function renderNav() {
  const waitingProfessor = requests.filter((r) => r.status === "Pending").length;
  const waitingLab = requests.filter((r) => r.status === "Authorized").length;
  const borrowed = requests.filter((r) => r.status === "Approved").length;
  const yellowCount = (count) => `<span class="ml-auto rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-slate-950">${count}</span>`;
  const violetCount = (count) => count === 0 ? "" : `<span class="ml-auto rounded-full bg-violet-600 px-2 py-0.5 text-xs font-bold text-white">${count}</span>`;

  const unreadMessages = messages.filter((m) => !m.read_at).length;                        // for the administrator
  const seenUpdates = loadSupportSeen();
  const newUpdates = messages.filter((m) => !seenUpdates.includes(m.id)).length;           // for students and professors

  let links = "";
  let supportLinks = "";   // only students and professors have "Support updates"

  if (role === "student") {
    links += navButton("browse", "dashboard", "Browse equipment");
    links += navButton("borrowings", "list", "My borrowings", `<span class="ml-auto rounded-full bg-slate-800 px-2 py-0.5 text-xs">${borrowed}</span>`);
    links += navButton("history", "history", "Request history");
    supportLinks = navButton("support", "inbox", "Support updates", violetCount(newUpdates));
  } else if (role === "professor") {
    links += navButton("authorizations", "check", "Class authorizations", yellowCount(waitingProfessor));
    links += navButton("approvals", "history", "Approval history");
    supportLinks = navButton("support", "inbox", "Support updates", violetCount(newUpdates));
  } else {
    links += navButton("overview", "dashboard", "Overview");
    links += navButton("inventory", "cube", "Inventory");
    links += navButton("requests", "list", "Borrowing requests", yellowCount(waitingLab));
    links += navButton("messages", "inbox", "Messages", violetCount(unreadMessages));
    links += navButton("users", "shield", "Manage users");
    links += navButton("lending", "history", "Lending history");
  }

  $("nav").innerHTML = `
    <div class="px-3 pb-2 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-slate-600">Workspace</div>
    ${links}
    <div class="px-3 pb-2 pt-7 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-slate-600">Support</div>
    ${supportLinks}
    ${navButton("help", "help", "Help center")}
    ${navButton("settings", "settings", "Settings")}`;
}

function renderUserCard() {
  const isStudent = role === "student";
  const subtitle = role === "admin" ? "Laboratory administrator" : (currentUser.department || (isStudent ? "Student" : "Professor"));

  // Units this student has borrowed or is waiting for
  const inUse = requests
    .filter((r) => ["Pending", "Authorized", "Approved"].includes(r.status))
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

  $("greeting").textContent = isStudent ? `Good ${timeOfDay}, ${currentUser.full_name.split(" ")[0]}` : (role === "professor" ? "Professor workspace" : "Admin dashboard");
  $("today").textContent = isStudent ? `${weekday}, ${now.getDate()} ${month}` : (role === "professor" ? "Class request authorizations" : "Laboratory operations");
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
  authorizations: () => authorizationsPage(),
  approvals: () => approvalsPage(),
  messages: () => messagesPage(),
  support: () => supportPage(),
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
  selectedMessageId = null;
  messageQuery = "";
  messageFilter = "All";
  closeMenu();
  await loadData();
  if (currentUser === null) return;
  render();
}


// ---------- 7. STUDENT: BROWSE EQUIPMENT ----------
function renderBrowse() {
  const readyCount = items.reduce((sum, item) => sum + item.available, 0);
  const unitsOf = (list) => list.reduce((sum, r) => sum + r.quantity, 0);
  const borrowed = requests.filter((r) => r.status === "Approved");
  const dueThisWeek = borrowed.filter((r) => daysUntil(r.return_date) <= 7);
  const pending = requests.filter((r) => ["Pending", "Authorized"].includes(r.status));

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
    const unavailable = item.available === 0;

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
              <div class="mt-0.5 text-[0.68rem] text-slate-400">${item.total} units total${item.inspection > 0 ? ` · ${item.inspection} in inspection` : ""}</div>
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

// Remember what the student types in the class details
function setClass(field, value) {
  classForm[field] = value;

  // the return date can never be before the date needed
  if (field === "date_needed" && classForm.return_date < value) {
    classForm.return_date = value;
    renderBasket();
  }
}

// The "Class details" part of the drawer: the professor has to confirm these
function classDetailsHtml() {
  if (professors.length === 0) {
    return `<div class="mt-7 rounded-2xl bg-amber-50 p-4 text-xs leading-5 text-amber-800">No professors are registered yet. Ask the administrator to create a professor account before you request equipment.</div>`;
  }

  const fieldStyle = "mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-normal outline-none focus:border-violet-500";

  const textInput = (field, label, placeholder) => `
    <label class="block text-xs font-bold text-slate-600">${label}
      <input value="${esc(classForm[field])}" oninput="setClass('${field}', this.value)" placeholder="${placeholder}" class="${fieldStyle}">
    </label>`;

  const dateInput = (field, label, min) => `
    <label class="block text-xs font-bold text-slate-600">${label}
      <input type="date" value="${classForm[field]}" min="${min}" onchange="setClass('${field}', this.value)" class="${fieldStyle}">
    </label>`;

  const timeInput = (field, label) => `
    <label class="block text-xs font-bold text-slate-600">${label}
      <input type="time" value="${classForm[field]}" onchange="setClass('${field}', this.value)" class="${fieldStyle}">
    </label>`;

  const professorOptions = professors.map((p) =>
    `<option value="${p.id}" ${String(p.id) === String(classForm.professor_id) ? "selected" : ""}>${esc(p.full_name)}${p.department ? " · " + esc(p.department) : ""}</option>`).join("");

  return `
    <div class="mt-7 space-y-4 rounded-2xl bg-slate-50 p-4">
      <div>
        <h3 class="text-sm font-bold text-slate-950">Class details</h3>
        <p class="mt-1 text-xs leading-5 text-slate-500">Your professor must confirm that this request supports your laboratory class.</p>
      </div>
      <label class="block text-xs font-bold text-slate-600">Professor
        <select onchange="setClass('professor_id', this.value)" class="${fieldStyle}">
          <option value="">Choose your professor</option>
          ${professorOptions}
        </select>
      </label>
      <div class="grid gap-3 min-[420px]:grid-cols-2">
        ${textInput("course_code", "Course code", "BIOC 312")}
        ${textInput("course_name", "Course name", "Biochemistry")}
      </div>
      <div class="grid gap-3 min-[420px]:grid-cols-2">
        ${textInput("section", "Section", "Section B")}
        ${textInput("schedule", "Schedule", "Wed · 1:00–4:00 PM")}
      </div>
      ${textInput("purpose", "Laboratory purpose", "Cell structure practical")}
      <div class="grid gap-3 min-[420px]:grid-cols-2">
        ${dateInput("date_needed", "Date needed", todayString())}
        ${timeInput("time_needed", "Time needed")}
      </div>
      <div class="grid gap-3 min-[420px]:grid-cols-2">
        ${dateInput("return_date", "Return date", classForm.date_needed)}
        ${timeInput("return_time", "Return time")}
      </div>
    </div>`;
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
      ${classDetailsHtml()}`;
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
  // every class detail must be filled in
  const fields = ["professor_id", "course_code", "course_name", "section", "schedule", "purpose", "date_needed", "time_needed", "return_date", "return_time"];
  if (fields.some((field) => String(classForm[field]).trim() === "")) {
    showToast("Please complete the class details.", true);
    return;
  }
  if (`${classForm.return_date} ${classForm.return_time}` <= `${classForm.date_needed} ${classForm.time_needed}`) {
    showToast("The return must be after the time needed.", true);
    return;
  }

  submitted = true;
  renderBasket();

  try {
    const { ok, result } = await postJson("api/borrow.php", {
      items: basket.map((entry) => ({ id: entry.id, quantity: entry.qty })),
      ...classForm
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
      classForm = newClassForm();
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
  const overdue = active.filter((r) => loanStatus(r) === "Overdue");
  const dueSoon = active.filter((r) => loanStatus(r) !== "Overdue" && daysUntil(r.return_date) <= 7);

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
    recordRow(itemLabel(r), r.code, `Borrowed ${formatDateTime(r.date_reviewed)}`, `Due ${whenText(r.return_date, r.return_time)}`, badge(loanStatus(r)))
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
  if (r.status === "Authorized") return [`Authorized ${formatDateTime(r.date_confirmed)}`, "Waiting for the laboratory"];
  if (r.status === "Approved") return [`Borrowed ${formatDateTime(r.date_reviewed)}`, `Due ${whenText(r.return_date, r.return_time)}`];
  if (r.status === "Declined") return [`Declined ${formatDateTime(r.date_reviewed)}`, "Not approved"];
  if (r.status === "Returned") return [`Returned ${formatDateTime(r.date_returned)}`, `Kept ${durationText(r.date_reviewed, r.date_returned)}`];
  return [`Requested ${formatDate(r.date_requested)}`, r.professor ? `Waiting for ${r.professor}` : `Return by ${whenText(r.return_date, r.return_time)}`];
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

// Buttons for a request (administrator):
// waiting for the professor -> only Decline,  authorized -> Decline + Approve,  borrowed -> Mark returned
function requestActions(r) {
  const declineButton = `<button onclick="updateRequest(${r.id}, 'decline')" class="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500" aria-label="Decline ${requestNumber(r)}">${icon("close", "size-4")}</button>`;

  if (r.status === "Pending") {
    return `${badge(r.status)} ${declineButton}`;
  }
  if (r.status === "Authorized") {
    return `
      ${declineButton}
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
  const goodUnits = items.reduce((sum, item) => sum + item.total - item.inspection, 0);
  const health = totalUnits === 0 ? 0 : Math.round((goodUnits / totalUnits) * 100);
  const addedThisMonth = items.filter((item) => item.created_at.slice(0, 7) === todayString().slice(0, 7)).length;

  const borrowed = requests.filter((r) => r.status === "Approved").reduce((sum, r) => sum + r.quantity, 0);
  const pending = requests.filter((r) => r.status === "Authorized").length;   // waiting for the laboratory
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
    ${pageHeader("Admin workspace", "Laboratory overview", "Manage equipment, review requests, and monitor lending activity.", addButton)}

    <section class="grid grid-cols-2 gap-3 pb-7 lg:grid-cols-4">${statCards(stats)}</section>

    ${chartsHtml()}

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


// ---------- 12b. ADMIN: CHARTS ----------
// The charts are drawn with plain HTML and CSS: the width of each bar is a percentage.
function chartsHtml() {
  // --- Requests by status ---
  const statuses = [
    ["Approved", "Approved", "#8b5cf6"],
    ["Pending", "Awaiting professor", "#fbbf24"],
    ["Authorized", "Authorized", "#22d3ee"],
    ["Returned", "Returned", "#818cf8"],
    ["Declined", "Declined", "#fb7185"]
  ];
  const counts = statuses.map(([status, label, color]) => ({
    label, color, count: requests.filter((r) => r.status === status).length
  }));
  const biggest = Math.max(...counts.map((entry) => entry.count), 1);   // the longest bar is 100%
  const total = counts.reduce((sum, entry) => sum + entry.count, 0);

  const statusBars = counts.map(({ label, color, count }) => `
    <div>
      <div class="flex items-center justify-between text-xs font-semibold text-slate-700"><span>${label}</span><span class="text-slate-950">${count}</span></div>
      <div class="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div class="h-full rounded-full" style="width: ${(count / biggest) * 100}%; background: ${color}"></div></div>
    </div>`).join("");

  // one bar made of colored parts (each part = its share of all requests)
  const stacked = counts.map(({ color, count }) =>
    count === 0 ? "" : `<div class="h-full" style="width: ${(count / total) * 100}%; background: ${color}"></div>`).join("");

  // --- Most-borrowed equipment: how many requests each item has ---
  const requestCounts = {};
  requests.forEach((r) => { requestCounts[r.equipment_id] = (requestCounts[r.equipment_id] || 0) + 1; });

  const ranked = items
    .map((item) => ({ item, count: requestCounts[item.id] || 0 }))
    .filter((entry) => entry.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);
  const top = ranked.length > 0 ? ranked[0].count : 1;

  const topRows = ranked.map(({ item, count }, index) => `
    <div class="flex items-center gap-4">
      <span class="w-5 text-xs font-bold text-slate-400">${String(index + 1).padStart(2, "0")}</span>
      <div class="min-w-0 flex-1">
        <div class="flex items-center justify-between gap-2 text-xs font-semibold"><span class="truncate text-slate-900">${esc(item.name)}</span><span class="text-violet-600">${count}</span></div>
        <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100"><div class="h-full rounded-full bg-violet-500" style="width: ${(count / top) * 100}%"></div></div>
      </div>
      <span class="w-14 text-right text-[0.65rem] text-slate-400">${esc(item.code)}</span>
    </div>`).join("");

  return `
    <section class="mb-7 grid gap-5 lg:grid-cols-2">
      <div class="rounded-2xl border border-slate-200 bg-white p-6">
        <div class="flex items-start justify-between">
          <div>
            <h2 class="font-bold text-slate-950">Requests by status</h2>
            <p class="mt-1 text-xs text-slate-400">Current request distribution</p>
          </div>
          <span class="rounded-full bg-slate-100 px-2.5 py-1 text-[0.65rem] font-bold text-slate-500">Live data</span>
        </div>
        <div class="mt-6 space-y-5">${statusBars}</div>
        <div class="mt-6 flex h-2 overflow-hidden rounded-full bg-slate-100">${stacked}</div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-6">
        <div class="flex items-start justify-between">
          <div>
            <h2 class="font-bold text-slate-950">Most-borrowed equipment</h2>
            <p class="mt-1 text-xs text-slate-400">Requests during the current term</p>
          </div>
          <span class="text-violet-600">${icon("history", "size-5")}</span>
        </div>
        <div class="mt-6 space-y-5">${topRows === "" ? `<p class="text-sm text-slate-500">No requests yet.</p>` : topRows}</div>
      </div>
    </section>`;
}


// ---------- 13. ADMIN: INVENTORY (add, edit, delete equipment) ----------

// Counts in units. They add up: available + borrowed + maintenance = all.
function inventoryCounts() {
  const sum = (field) => items.reduce((total, item) => total + field(item), 0);
  return {
    All: sum((item) => item.total),
    Available: sum((item) => item.available),
    Borrowed: sum((item) => borrowedUnits(item)),
    Maintenance: sum((item) => item.inspection)
  };
}

// An item shows up in a tab if at least one of its units fits
function inventoryRows() {
  if (inventoryTab === "Available") return items.filter((item) => item.available > 0);
  if (inventoryTab === "Borrowed") return items.filter((item) => borrowedUnits(item) > 0);
  if (inventoryTab === "Maintenance") return items.filter((item) => item.inspection > 0);
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
      <span class="w-fit rounded-full bg-violet-50 px-2.5 py-1 text-[0.68rem] font-bold text-violet-700">${esc(conditionLabel(item))}</span>
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
    total: 1, inspection: 0, icon: "cube", color: "indigo"
  };

  const categoryOptions = categories.map((c) => [c.id, c.name]);

  openModal(id === 0 ? "Add equipment" : "Edit equipment", `
    <div class="space-y-4">
      ${textField("Name", "item-name", item.name)}
      ${textField("Code (for example MIC-204)", "item-code", item.code)}
      ${selectField("Category", "item-category", categoryOptions, item.category_id)}
      <div class="grid gap-4 min-[420px]:grid-cols-2">
        ${textField("Total units", "item-total", item.total, "number", 'min="1"')}
        ${textField("Units in inspection", "item-inspection", item.inspection, "number", 'min="0"')}
      </div>
      <p class="text-xs leading-5 text-slate-500">Only the units in inspection or maintenance are blocked. The others can still be borrowed. Available units are worked out for you: total − in inspection − borrowed${id !== 0 ? ` (${borrowedUnits(item)} borrowed now)` : ""}.</p>
      <div class="grid gap-4 min-[420px]:grid-cols-2">
        ${selectField("Icon", "item-icon", iconChoices, item.icon)}
        ${selectField("Card color", "item-color", colorChoices, item.color)}
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
    inspection_units: Number($("item-inspection").value),
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
    recordRow(r.student, `${requestNumber(r)}${r.professor ? " · " + r.professor : ""}`, itemLabel(r), `Return ${whenText(r.return_date, r.return_time)}`, requestActions(r))
  ).join("");

  return pageHeader("Admin workspace", "Borrowing requests", "Review and process requests submitted by students.") +
    recordsCard("All requests", rows, "No requests yet.");
}

function lendingPage() {
  // Only items that were really lent out (approved or returned)
  const lent = requests.filter((r) => r.status === "Approved" || r.status === "Returned");

  const rows = lent.map((r) => {
    let info1 = `Borrowed ${formatDateTime(r.date_reviewed)}`;
    let info2 = `Due ${whenText(r.return_date, r.return_time)}`;
    if (r.status === "Returned") {
      [info1, info2] = historyInfo(r);
    }
    return recordRow(itemLabel(r), `${requestNumber(r)} · ${r.student}`, info1, info2, badge(loanStatus(r)));
  }).join("");

  return pageHeader("Admin workspace", "Lending history", "A complete log of equipment lending activity.") +
    recordsCard("Activity records", rows, "No records found.");
}


// ---------- 14b. PROFESSOR: CLASS AUTHORIZATIONS ----------

// The three lines about the class (course, schedule, purpose)
function classColumn(r) {
  return `
    <div class="min-w-0">
      <div class="text-sm font-bold text-slate-900">${esc(r.course_code)} · ${esc(r.course_name)}</div>
      <div class="mt-1 text-xs text-slate-500">${r.section ? esc(r.section) + " · " : ""}${esc(r.schedule)}</div>
      <div class="mt-1 text-xs text-violet-600">${esc(r.purpose)}</div>
    </div>`;
}

// One row of the professor's lists. "rightHtml" is a badge or the two buttons.
function professorRow(r, rightHtml) {
  return `
    <div class="grid gap-4 p-5 md:grid-cols-[1.1fr_1.4fr_1fr_auto] md:items-center">
      <div class="flex items-center gap-3">
        <div class="flex size-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600">${esc(initialsOf(r.student))}</div>
        <div class="min-w-0">
          <div class="truncate text-sm font-bold text-slate-900">${esc(r.student)}</div>
          <div class="mt-0.5 text-xs text-slate-400">${requestNumber(r)} · Needed ${whenText(r.date_needed, r.time_needed)}</div>
        </div>
      </div>
      ${classColumn(r)}
      <div>
        <div class="text-sm font-semibold text-slate-700">${esc(itemLabel(r))}</div>
        <div class="mt-0.5 text-xs text-slate-400">${esc(r.code)}</div>
      </div>
      <div class="flex items-center gap-2 md:justify-end">${rightHtml}</div>
    </div>`;
}

function authorizationsPage() {
  const waiting = requests.filter((r) => r.status === "Pending");
  const approved = requests.filter((r) => ["Authorized", "Approved", "Returned"].includes(r.status)).length;
  const students = new Set(requests.map((r) => r.user_id)).size;
  const thisWeek = requests.filter((r) => r.date_needed && daysUntil(r.date_needed) >= 0 && daysUntil(r.date_needed) <= 6).length;

  const stats = [
    ["Awaiting review", waiting.length, "clock", "amber", ""],
    ["Approved", approved, "check", "violet", ""],
    ["Students", students, "beaker", "indigo", ""],
    ["This week", thisWeek, "calendar", "violet", ""]
  ];

  const buttons = (r) => `
    <button onclick="reviewRequest(${r.id}, 'decline')" class="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50">Decline</button>
    <button onclick="reviewRequest(${r.id}, 'authorize')" class="flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800">${icon("check", "size-4")} Authorize</button>`;

  const rows = waiting.map((r) => professorRow(r, buttons(r))).join("");

  return pageHeader("Professor workspace", "Class authorizations", "Confirm that each equipment request supports an active class or laboratory activity.") + `
    <section class="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">${statCards(stats)}</section>
    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div class="border-b border-slate-200 p-5">
        <h2 class="font-bold text-slate-950">Requests requiring your confirmation</h2>
        <p class="mt-1 text-xs text-slate-500">Verify the student, class schedule, and stated laboratory purpose before approving.</p>
      </div>
      ${rows === "" ? `<p class="p-8 text-center text-sm text-slate-500">No requests are waiting for your confirmation.</p>` : `<div class="divide-y divide-slate-100">${rows}</div>`}
    </div>`;
}

function approvalsPage() {
  const reviewed = requests.filter((r) => r.status !== "Pending");

  // For a professor, everything that was not declined counts as approved
  const rows = reviewed.map((r) => {
    const decision = r.status === "Declined" ? "Declined" : "Approved";
    const label = decision === "Declined"
      ? `<span class="rounded-full bg-rose-50 px-2.5 py-1 text-[0.68rem] font-bold text-rose-600">Declined</span>`
      : `<span class="rounded-full bg-violet-50 px-2.5 py-1 text-[0.68rem] font-bold text-violet-700">Approved</span>`;
    return professorRow(r, label);
  }).join("");

  return pageHeader("Professor workspace", "Approval history", "Review class authorization decisions for your students.") + `
    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div class="border-b border-slate-200 p-5">
        <h2 class="font-bold text-slate-950">Reviewed requests</h2>
        <p class="mt-1 text-xs text-slate-500">Your previous authorization decisions.</p>
      </div>
      ${rows === "" ? `<p class="p-8 text-center text-sm text-slate-500">You have not reviewed any requests yet.</p>` : `<div class="divide-y divide-slate-100">${rows}</div>`}
    </div>`;
}

// UPDATE: the professor authorizes or declines
async function reviewRequest(id, action) {
  try {
    const { ok, result } = await postJson("api/class_review.php", { id, action });
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


// ---------- 14c. ADMIN: MANAGE USERS ----------
function usersPage() {
  const count = (role) => users.filter((u) => u.role === role).length;
  const suspended = users.filter((u) => u.status === "Suspended").length;

  const stats = [
    ["Total accounts", users.length, "list", "indigo", ""],
    ["Students", count("student"), "beaker", "indigo", ""],
    ["Professors", count("professor"), "check", "violet", ""],
    ["Administrators", count("admin"), "shield", "amber", ""],
    ["Suspended", suspended, "clock", "rose", ""]
  ];

  const tabs = ["All users", "Students", "Professors", "Administrators"].map((name) => `
    <button onclick="setUsersTab('${name}')" class="whitespace-nowrap rounded-lg px-4 py-2 text-xs font-bold ${usersTab === name ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-800"}">${name}</button>`).join("");

  // Green message after an action (can be closed)
  const notice = usersNotice === "" ? "" : `
    <div class="mb-5 flex items-center justify-between gap-3 rounded-xl bg-violet-50 px-4 py-3 text-xs font-semibold text-violet-900">
      <span class="flex items-center gap-3"><span class="text-violet-600">${icon("check", "size-4")}</span>${esc(usersNotice)}</span>
      <button onclick="dismissUsersNotice()" class="text-violet-600 hover:text-violet-900" aria-label="Close message">${icon("close", "size-4")}</button>
    </div>`;

  return pageHeader("Admin workspace", "Manage users", "View accounts, update access levels, and remove users.") +
    notice + `
    <section class="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-5">${statCards(stats)}</section>

    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div class="flex flex-col gap-4 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">
        <div class="relative md:w-96">
          <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">${icon("search", "size-4")}</span>
          <input id="user-search" value="${esc(userQuery)}" oninput="setUserQuery(this.value)" placeholder="Search name, email, or ID…" aria-label="Search accounts"
            class="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100">
        </div>
        <div class="flex gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1">${tabs}</div>
      </div>
      <div class="hidden grid-cols-[1.5fr_1fr_.8fr_.6fr_auto] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-[0.65rem] font-bold uppercase tracking-wider text-slate-400 md:grid">
        <span>Account</span><span>Department</span><span>Role</span><span>Status</span><span>Actions</span>
      </div>
      <div id="user-rows">${userRowsHtml()}</div>
    </div>`;
}

// The rows of the table (filtered by the tab and the search text)
function userRowsHtml() {
  const search = userQuery.toLowerCase();
  const tabRoles = { "Students": "student", "Professors": "professor", "Administrators": "admin" };

  const visible = users.filter((u) => {
    const tabMatch = usersTab === "All users" || u.role === tabRoles[usersTab];
    const textMatch = [u.full_name, u.email, u.student_id || ""].some((text) => text.toLowerCase().includes(search));
    return tabMatch && textMatch;
  });

  if (visible.length === 0) {
    return `<p class="p-8 text-center text-sm text-slate-500">No accounts found.</p>`;
  }

  const button = "rounded-lg border px-3 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-40";
  const roleStyles = {
    student: ["Student", "bg-indigo-50 text-indigo-700", "bg-indigo-50 text-indigo-600"],
    professor: ["Professor", "bg-amber-50 text-amber-700", "bg-amber-50 text-amber-700"],
    admin: ["Administrator", "bg-violet-50 text-violet-700", "bg-violet-50 text-violet-700"]
  };

  return visible.map((u) => {
    const isMe = u.id === currentUser.id;
    const active = u.status === "Active";
    const [roleName, badgeStyle, avatarStyle] = roleStyles[u.role];

    const roleBadge = `<span class="rounded-full px-2.5 py-1 text-[0.68rem] font-bold ${badgeStyle}">${roleName}</span>`;

    const statusHtml = `
      <span class="flex items-center gap-2 text-xs font-semibold ${active ? "text-emerald-600" : "text-rose-500"}">
        <span class="size-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-rose-500"}"></span>${esc(u.status)}
      </span>`;

    // The role dropdown (Student / Professor / Administrator)
    const roleSelect = `
      <select ${isMe ? "disabled" : ""} onchange="changeRole(${u.id}, this.value)" aria-label="Role of ${esc(u.full_name)}"
        class="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 outline-none focus:border-violet-500 disabled:cursor-not-allowed disabled:opacity-40">
        <option value="student" ${u.role === "student" ? "selected" : ""}>Student</option>
        <option value="professor" ${u.role === "professor" ? "selected" : ""}>Professor</option>
        <option value="admin" ${u.role === "admin" ? "selected" : ""}>Administrator</option>
      </select>`;

    const statusButton = active
      ? `<button ${isMe ? "disabled" : ""} onclick="changeUser(${u.id}, 'suspend')" class="${button} border-slate-200 text-amber-700 hover:bg-amber-50">Suspend</button>`
      : `<button onclick="changeUser(${u.id}, 'activate')" class="${button} border-slate-200 text-emerald-700 hover:bg-emerald-50">Activate</button>`;

    const removeButton = `<button ${isMe ? "disabled" : ""} onclick="removeUser(${u.id})" class="${button} border-slate-200 text-rose-600 hover:bg-rose-50">Remove</button>`;

    return `
      <div class="grid gap-4 border-b border-slate-100 px-5 py-4 last:border-0 md:grid-cols-[1.5fr_1fr_.8fr_.6fr_auto] md:items-center">
        <div class="flex items-center gap-3">
          <div class="flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarStyle}">${esc(initialsOf(u.full_name))}</div>
          <div class="min-w-0">
            <div class="truncate text-sm font-bold text-slate-900">${esc(u.full_name)}${isMe ? ` <span class="ml-1 text-[0.65rem] font-normal text-slate-400">(You)</span>` : ""}</div>
            <div class="mt-0.5 truncate text-xs text-slate-400">${esc(u.email)}${u.student_id ? ` · ${esc(u.student_id)}` : ""}</div>
          </div>
        </div>
        <div class="text-xs font-semibold text-slate-500">${esc(u.department || "—")}</div>
        <div>${roleBadge}</div>
        <div>${statusHtml}</div>
        <div class="flex flex-wrap items-center gap-2 md:justify-end">${roleSelect}${statusButton}${removeButton}</div>
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

// UPDATE: change the role from the dropdown
async function changeRole(id, newRole) {
  const user = users.find((u) => u.id === id);
  const names = { student: "a student", professor: "a professor", admin: "an administrator" };

  try {
    const { ok, result } = await postJson("api/user_update.php", { id, action: "role", role: newRole });
    if (!ok) {
      showToast(result.error, true);
      renderContent();   // put the dropdown back to the real role
      return;
    }
    usersNotice = `${user.full_name} is now ${names[newRole]}.`;
    await loadData();
    render();
  } catch (error) {
    showToast("Unable to connect to the server.", true);
  }
}

// UPDATE: suspend or reactivate an account
async function changeUser(id, action) {
  const user = users.find((u) => u.id === id);
  const messages = {
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
      ["Submit a request", "Add the items and quantities you need, enter your class details, choose your professor and your dates, and send the request."],
      ["Wait for approval", "Your professor confirms your class first, then the laboratory approves the request. Check Request history for updates."],
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

  // Administrators ARE the laboratory, so they do not get the "Contact laboratory" box
  const contactBox = role === "admin" ? "" : `
    <div class="mt-5 flex flex-col items-start justify-between gap-4 rounded-2xl bg-slate-950 p-6 text-white sm:flex-row sm:items-center">
      <div>
        <h2 class="font-bold">Still need help?</h2>
        <p class="mt-1 text-sm text-slate-400">The laboratory team usually replies within one working day.</p>
      </div>
      <button onclick="go('contact')" class="rounded-xl bg-violet-400 px-5 py-3 text-sm font-bold text-slate-950">Contact laboratory</button>
    </div>`;

  return pageHeader("Support", "Help center", "Guides and answers for using the laboratory hub.") + `
    <div class="grid gap-4 md:grid-cols-3">${cards}</div>
    ${contactBox}`;
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

  // The "Have a question?" card is for students and professors only
  const questionCard = role === "admin" ? "" : `
      <div class="rounded-2xl bg-violet-600 p-6 text-white">
        <div class="flex size-10 items-center justify-center rounded-full border border-white/40">${icon("help")}</div>
        <h2 class="mt-6 font-bold">Have a question?</h2>
        <p class="mt-2 text-xs leading-5 text-violet-100">Contact the laboratory team if this guide does not answer your question.</p>
        <button onclick="go('contact')" class="mt-5 w-full rounded-xl bg-white py-3 text-xs font-bold text-violet-700 hover:bg-violet-50">Contact support</button>
      </div>`;

  return pageHeader("Help center · Guide", guide.title, guide.subtitle, backToHelp()) + `
    <div class="grid gap-5 ${role === "admin" ? "" : "lg:grid-cols-[1fr_20rem]"} lg:items-start">
      <div class="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <div class="flex size-12 items-center justify-center rounded-xl bg-violet-50 text-violet-700">${icon(guide.icon, "size-6")}</div>
        <p class="mt-6 max-w-2xl text-sm leading-7 text-slate-600">${guide.intro}</p>
        <ol class="mt-8 space-y-6">${steps}</ol>
      </div>
      ${questionCard}
    </div>`;
}

function contactPage() {
  const topics = ["Borrowing request", "Class authorization", "Equipment issue", "Returns and extensions", "General question"];
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
          <label class="block text-xs font-bold text-slate-600">Account ID
            <input value="${esc(currentUser.student_id || "")}" readonly class="${readonlyStyle}">
          </label>
        </div>
        <div class="mt-5">${selectField("Topic", "contact-topic", topicOptions, "Borrowing request")}</div>
        <div class="mt-5">${textField("Subject", "contact-subject", "", "text", 'maxlength="150" placeholder="Extension for microscope return"')}</div>
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
  const subject = $("contact-subject").value.trim();
  const message = $("contact-message").value.trim();

  if (subject.length < 3) {
    showToast("Please write a subject.", true);
    return;
  }
  if (message.length < 10) {
    showToast("Please write a message of at least 10 characters.", true);
    return;
  }

  try {
    const { ok, result } = await postJson("api/message_send.php", { topic, subject, message });
    if (!ok) {
      showToast(result.error, true);
      return;
    }
    showToast(result.message);
    go("support");   // show the automated "Request received" update
  } catch (error) {
    showToast("Unable to connect to the server.", true);
  }
}


// ---------- 15b. MESSAGES (administrator) AND SUPPORT UPDATES (student, professor) ----------
// The administrator reads the messages here but cannot reply inside LabTrack:
// the reply is written in Outlook (the button opens it with the recipient and subject filled in).

// Which support updates this student or professor already opened (saved in the browser)
function supportSeenKey() {
  return `seen-support-${currentUser.id}`;
}

function loadSupportSeen() {
  try {
    return JSON.parse(localStorage.getItem(supportSeenKey())) || [];
  } catch (error) {
    return [];
  }
}

function saveSupportSeen(ids) {
  try {
    localStorage.setItem(supportSeenKey(), JSON.stringify(ids.slice(-500)));
  } catch (error) {
    // storage is blocked
  }
}

// "10:42 AM" for today, "Yesterday", or "12 Aug"
function shortWhen(text) {
  const days = daysUntil(text);
  if (days === 0) return formatTime(text.slice(11, 16));
  if (days === -1) return "Yesterday";
  return parseDate(text).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

// "Today at 10:42 AM" or "Aug 11 at 10:42 AM"
function submittedText(text) {
  const day = daysUntil(text) === 0 ? "Today" : formatDate(text);
  return `${day} at ${formatTime(text.slice(11, 16))}`;
}

// Messages written before the subject existed show their topic instead
function messageSubject(message) {
  return message.subject || message.topic;
}

function tagChip(topic) {
  return `<span class="inline-flex items-center gap-1 rounded-md bg-violet-50 px-2 py-0.5 text-[0.65rem] font-semibold text-violet-700">${icon("tag", "size-3")}${esc(topic)}</span>`;
}

// The messages shown in the list (the All / Unread tab and the search text)
function visibleMessages() {
  const search = messageQuery.toLowerCase();
  return messages.filter((m) => {
    if (messageFilter === "Unread" && m.read_at) return false;
    return [m.sender, messageSubject(m), m.message, m.topic].some((text) => text.toLowerCase().includes(search));
  });
}

function messageCountText() {
  const count = visibleMessages().length;
  return (role === "admin" ? plural(count, "message") : plural(count, "request")).toUpperCase();
}

// The list on the left
function messageListHtml() {
  const list = visibleMessages();

  if (list.length === 0) {
    const empty = messages.length === 0 && role !== "admin"
      ? "You have not sent any requests yet. Use Contact laboratory in the Help center."
      : "No messages found.";
    return `<p class="p-8 text-center text-sm text-slate-500">${empty}</p>`;
  }

  const admin = role === "admin";
  const seen = loadSupportSeen();

  return list.map((m) => {
    const unread = admin ? !m.read_at : !seen.includes(m.id);
    const selected = m.id === selectedMessageId;
    const name = admin ? m.sender : "Laboratory support";
    const initials = admin ? initialsOf(m.sender) : "LT";
    const preview = admin ? m.message : "Request received · Awaiting email reply";

    return `
      <button onclick="openMessage(${m.id})" class="block w-full border-b border-slate-100 px-5 py-4 text-left transition hover:bg-slate-50 ${selected ? "border-l-4 border-l-violet-600 bg-violet-50" : ""}">
        <div class="flex gap-3">
          <div class="flex size-10 shrink-0 items-center justify-center rounded-full ${admin ? "bg-indigo-50 text-indigo-600" : "bg-violet-600 text-white"} text-xs font-bold">${esc(initials)}</div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center justify-between gap-2">
              <span class="truncate text-sm ${unread ? "font-bold" : "font-semibold"} text-slate-900">${esc(name)}</span>
              <span class="flex shrink-0 items-center gap-2 text-[0.68rem] text-slate-400">${shortWhen(m.created_at)}${unread ? `<span class="size-2 rounded-full bg-violet-600"></span>` : ""}</span>
            </div>
            <div class="mt-0.5 truncate text-sm font-semibold text-slate-800">${esc(messageSubject(m))}</div>
            <div class="mt-0.5 truncate text-xs text-slate-500">${esc(preview)}</div>
            <div class="mt-2">${tagChip(m.topic)}</div>
          </div>
        </div>
      </button>`;
  }).join("");
}

// Open a message. For the administrator this also marks it as read.
async function openMessage(id) {
  selectedMessageId = id;
  const message = messages.find((m) => m.id === id);

  if (role === "admin" && message && !message.read_at) {
    message.read_at = new Date().toISOString();   // show it as read right away
    try {
      await postJson("api/message_update.php", { id, action: "read" });
    } catch (error) {
      // it will show as unread again after the next refresh
    }
  }

  if (role !== "admin") {
    const seen = loadSupportSeen();
    if (!seen.includes(id)) saveSupportSeen([...seen, id]);
  }

  renderNav();
  renderBell();
  renderContent();
}

// On a phone the list and the message are shown one at a time: this goes back to the list
function closeMessage() {
  selectedMessageId = null;
  renderContent();
}

function setMessageFilter(name) {
  messageFilter = name;
  renderContent();
}

// Only redraws the list (so the search box keeps focus while typing)
function setMessageQuery(text) {
  messageQuery = text;
  $("message-list").innerHTML = messageListHtml();
  $("message-count").textContent = messageCountText();
}

// UPDATE: archive (hide) a message from the inbox
async function archiveMessage(id) {
  try {
    const { ok, result } = await postJson("api/message_update.php", { id, action: "archive" });
    if (!ok) {
      showToast(result.error, true);
      return;
    }
    selectedMessageId = null;
    showToast(result.message);
    await loadData();
    render();
  } catch (error) {
    showToast("Unable to connect to the server.", true);
  }
}

// The search box above the list
function messageSearchBox() {
  return `
    <div class="relative min-w-0 flex-1">
      <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">${icon("search", "size-4")}</span>
      <input id="message-search" value="${esc(messageQuery)}" oninput="setMessageQuery(this.value)" placeholder="${role === "admin" ? "Search messages…" : "Search conversations…"}" aria-label="Search"
        class="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100">
    </div>`;
}

// --- Administrator: the inbox ---
function messagesPage() {
  const unread = messages.filter((m) => !m.read_at).length;
  const selected = messages.find((m) => m.id === selectedMessageId);

  const unreadCard = `
    <div class="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4">
      <div class="flex size-10 items-center justify-center rounded-xl bg-violet-600 text-sm font-bold text-white">${unread}</div>
      <div>
        <div class="text-sm font-bold text-slate-950">Unread messages</div>
        <div class="text-xs text-slate-400">Requires your attention</div>
      </div>
    </div>`;

  const tabs = ["All", "Unread"].map((name) => `
    <button onclick="setMessageFilter('${name}')" class="rounded-lg px-3 py-1.5 text-xs font-bold ${messageFilter === name ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}">${name}</button>`).join("");

  // On a phone only one of the two sides is shown: the list, or the open message
  return pageHeader("Admin workspace", "Messages", "Review and respond to requests from students and faculty.", unreadCard) + `
    <div class="grid overflow-hidden rounded-2xl border border-slate-200 bg-white lg:grid-cols-[24rem_1fr]">
      <div class="${selected ? "hidden lg:block" : ""} border-slate-200 lg:border-r">
        <div class="flex items-center gap-3 p-5">
          ${messageSearchBox()}
          <div class="flex shrink-0 rounded-xl bg-slate-100 p-1">${tabs}</div>
        </div>
        <div class="flex items-center justify-between border-y border-slate-100 bg-slate-50 px-5 py-3 text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">
          <span>Inbox</span><span id="message-count">${messageCountText()}</span>
        </div>
        <div id="message-list" class="max-h-[40rem] overflow-y-auto">${messageListHtml()}</div>
      </div>
      <div class="${selected ? "flex flex-col" : "hidden lg:flex lg:flex-col"} min-h-[24rem]">
        ${selected ? adminMessageDetail(selected) : `<div class="m-auto p-8 text-sm text-slate-500">Select a message to read it.</div>`}
      </div>
    </div>`;
}

function adminMessageDetail(m) {
  const rolePill = m.role === "professor"
    ? `<span class="rounded-md bg-emerald-50 px-2 py-0.5 text-[0.65rem] font-bold text-emerald-700">Professor</span>`
    : `<span class="rounded-md bg-indigo-50 px-2 py-0.5 text-[0.65rem] font-bold text-indigo-700">Student</span>`;

  // Outlook on the web: a new email with the recipient and the subject already filled in
  const outlookLink = `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(m.email)}&subject=${encodeURIComponent("Re: " + messageSubject(m))}`;

  const received = daysUntil(m.created_at) === 0
    ? `today at ${formatTime(m.created_at.slice(11, 16))}`
    : submittedText(m.created_at);

  return `
    <div class="flex items-start justify-between gap-3 border-b border-slate-100 p-5 sm:p-6">
      <div class="flex min-w-0 gap-3">
        <button onclick="closeMessage()" class="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 lg:hidden" aria-label="Back to the inbox">${icon("arrow", "size-4 rotate-180")}</button>
        <div class="flex size-12 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-600">${esc(initialsOf(m.sender))}</div>
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-2"><span class="text-sm font-bold text-slate-900">${esc(m.sender)}</span>${rolePill}${tagChip(m.topic)}</div>
          <div class="mt-1 text-xs text-slate-400">${esc(m.student_id || "No ID")} · ${esc(m.department || "No department")}</div>
        </div>
      </div>
      <button onclick="archiveMessage(${m.id})" class="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50" aria-label="Archive message" title="Archive">${icon("archive", "size-4")}</button>
    </div>

    <div class="flex-1 p-5 sm:p-6">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <span class="text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">Subject</span>
        <span class="flex items-center gap-1.5 text-[0.68rem] text-slate-400">${icon("clock", "size-3.5")} Received ${received}</span>
      </div>
      <h2 class="mt-2 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">${esc(messageSubject(m))}</h2>
      <p class="mt-6 whitespace-pre-wrap text-sm leading-7 text-slate-600">${esc(m.message)}</p>
    </div>

    <div class="m-5 flex flex-col gap-4 rounded-2xl border border-slate-200 p-5 sm:m-6 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex min-w-0 gap-4">
        <div class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">${icon("send")}</div>
        <div class="min-w-0">
          <div class="text-sm font-bold text-slate-950">Reply through Outlook</div>
          <p class="mt-1 text-xs leading-5 text-slate-500">LabTrack does not send replies. Contact ${esc(m.sender)} using their registered email address.</p>
          <div class="mt-2 break-all text-xs font-bold text-slate-900">${esc(m.email)}</div>
        </div>
      </div>
      <a href="${esc(outlookLink)}" target="_blank" rel="noopener noreferrer"
        class="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800">Open Outlook ${icon("chevron", "size-4")}</a>
    </div>`;
}

// --- Student and professor: the automated "Request received" update ---
function supportPage() {
  const selected = messages.find((m) => m.id === selectedMessageId);
  const workspace = role === "professor" ? "Professor workspace" : "Student workspace";

  const receivedCard = `
    <div class="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4">
      <div class="flex size-10 items-center justify-center rounded-xl bg-violet-600 text-white">${icon("check", "size-5")}</div>
      <div>
        <div class="text-sm font-bold text-slate-950">Request received</div>
        <div class="text-xs text-slate-400">Reply will arrive by email</div>
      </div>
    </div>`;

  return pageHeader(workspace, "Support updates", "Track requests sent to the laboratory team.", receivedCard) + `
    <div class="grid overflow-hidden rounded-2xl border border-slate-200 bg-white lg:grid-cols-[24rem_1fr]">
      <div class="${selected ? "hidden lg:block" : ""} border-slate-200 lg:border-r">
        <div class="p-5">${messageSearchBox()}</div>
        <div class="flex items-center justify-between border-y border-slate-100 bg-slate-50 px-5 py-3 text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">
          <span>Your requests</span><span id="message-count">${messageCountText()}</span>
        </div>
        <div id="message-list" class="max-h-[40rem] overflow-y-auto">${messageListHtml()}</div>
      </div>
      <div class="${selected ? "flex flex-col" : "hidden lg:flex lg:flex-col"} min-h-[24rem]">
        ${selected ? supportDetail(selected) : `<div class="m-auto p-8 text-sm text-slate-500">Select a request to see its update.</div>`}
      </div>
    </div>`;
}

function supportDetail(m) {
  return `
    <div class="flex items-center gap-3 border-b border-slate-100 p-5 sm:p-6">
      <button onclick="closeMessage()" class="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 lg:hidden" aria-label="Back to the list">${icon("arrow", "size-4 rotate-180")}</button>
      <div class="flex size-12 shrink-0 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">LT</div>
      <div class="min-w-0">
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-sm font-bold text-slate-900">Laboratory support</span>
          <span class="rounded-md bg-violet-50 px-2 py-0.5 text-[0.65rem] font-bold text-violet-700">Automated update</span>
        </div>
        <div class="mt-1 text-xs text-slate-400">Replies are delivered through Outlook email</div>
      </div>
    </div>

    <div class="flex-1 p-5 sm:p-8">
      <div class="mx-auto max-w-xl text-center">
        <div class="mx-auto flex size-16 items-center justify-center rounded-full bg-violet-50">
          <div class="flex size-12 items-center justify-center rounded-full bg-violet-600 text-white">${icon("check", "size-6")}</div>
        </div>
        <div class="mt-5 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-violet-600">Automated message</div>
        <h2 class="mt-2 text-2xl font-bold tracking-tight text-slate-950">Your request has been received</h2>
        <p class="mt-3 text-sm leading-6 text-slate-500">We've received your request. A laboratory administrator will review it and send a reply to <span class="break-all font-semibold text-slate-700">${esc(currentUser.email)}</span> through Outlook email. Replies are not sent in LabTrack.</p>
      </div>

      <div class="mx-auto mt-8 max-w-xl rounded-2xl border border-slate-200 p-5">
        <div class="space-y-3 text-xs">
          <div class="flex gap-6"><span class="w-20 shrink-0 font-bold uppercase tracking-wider text-slate-400">Subject</span><span class="font-semibold text-slate-900">${esc(messageSubject(m))}</span></div>
          <div class="flex gap-6"><span class="w-20 shrink-0 font-bold uppercase tracking-wider text-slate-400">Submitted</span><span class="font-semibold text-slate-900">${submittedText(m.created_at)}</span></div>
        </div>
        <p class="mt-4 whitespace-pre-wrap border-t border-slate-100 pt-4 text-sm leading-6 text-slate-600">${esc(m.message)}</p>
      </div>
    </div>`;
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
    [currentUser.role === "student" ? "Student ID" : "Staff ID", currentUser.student_id || "", "readonly", "set-student-id"],
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


// ---------- 16b. DARK MODE, NOTIFICATIONS, AUTO-REFRESH ----------

// Dark / light mode. The choice is saved in localStorage so it stays after a refresh.
function updateThemeIcon() {
  const dark = document.documentElement.classList.contains("dark");
  const themeIcon = icon(dark ? "sun" : "moon");   // the icon shows what a click will switch to
  $("theme-icon").innerHTML = themeIcon;
  $("theme-icon-login").innerHTML = themeIcon;
}

function toggleTheme() {
  const dark = document.documentElement.classList.toggle("dark");
  try {
    localStorage.setItem("theme", dark ? "dark" : "light");
  } catch (error) {
    // storage is blocked: the theme just will not be remembered
  }
  updateThemeIcon();
}

// --- Notifications: built from the requests (no extra table needed) ---
const dotColors = { green: "bg-emerald-500", indigo: "bg-indigo-400", amber: "bg-amber-400", rose: "bg-rose-400" };

// Which notifications this person has already opened (saved per user in the browser)
function seenKey() {
  return `seen-notifications-${currentUser.id}`;
}

function loadSeen() {
  try {
    return JSON.parse(localStorage.getItem(seenKey())) || [];
  } catch (error) {
    return [];
  }
}

function saveSeen(keys) {
  try {
    localStorage.setItem(seenKey(), JSON.stringify(keys.slice(-500)));
  } catch (error) {
    // storage is blocked
  }
}

function whenLabel(date) {
  if (!date) return "";
  const days = daysUntil(date);
  if (days === 0) return "Today";
  if (days === -1) return "Yesterday";
  return formatDate(date);
}

function buildNotifications() {
  const settings = loadNotificationSettings();   // the checkboxes from the Settings page
  const list = [];
  const add = (type, key, color, title, text, date) => {
    if (settings[type]) list.push({ key, color, title, text, date: date || todayString() });
  };

  requests.forEach((r) => {
    const num = requestNumber(r);

    if (role === "student") {
      if (r.status === "Authorized") add("Request updates", `${r.id}:Authorized`, "indigo", "Request authorized", `${r.professor || "Your professor"} authorized ${num}. The laboratory will review it next.`, r.date_confirmed);
      if (r.status === "Approved") add("Request updates", `${r.id}:Approved`, "green", "Request approved", `${itemLabel(r)} is ready. Collect it from the laboratory.`, r.date_reviewed);
      if (r.status === "Declined") add("Request updates", `${r.id}:Declined`, "rose", "Request declined", `${num} for ${itemLabel(r)} was declined.`, r.date_reviewed);
      if (r.status === "Returned") add("Request updates", `${r.id}:Returned`, "green", "Return confirmed", `${itemLabel(r)} was returned. Thank you!`, r.date_returned);
      if (loanStatus(r) === "Due soon") add("Return reminders", `${r.id}:due`, "amber", "Return due soon", `${itemLabel(r)} is due on ${whenText(r.return_date, r.return_time)}.`, todayString());
      if (loanStatus(r) === "Overdue") add("Return reminders", `${r.id}:overdue`, "rose", "Item overdue", `${itemLabel(r)} was due on ${whenText(r.return_date, r.return_time)}.`, todayString());
    }

    if (role === "professor") {
      if (r.status === "Pending") add("Request updates", `${r.id}:Pending`, "amber", "New class request", `${r.student} requested ${itemLabel(r)} for ${r.course_code}.`, r.date_requested.slice(0, 10));
    }

    if (role === "admin") {
      if (r.status === "Authorized") add("Request updates", `${r.id}:Authorized`, "indigo", "Authorization completed", `${r.professor || "A professor"} authorized request ${num}.`, r.date_confirmed);
      if (r.status === "Returned") add("Request updates", `${r.id}:Returned`, "green", "Equipment returned", `${r.item} ${r.code} is available again.`, r.date_returned);
      if (loanStatus(r) === "Overdue") add("Return reminders", `${r.id}:overdue`, "rose", "Overdue item", `${r.student} has not returned ${itemLabel(r)}.`, todayString());
    }
  });

  messages.forEach((m) => {
    const day = m.created_at.slice(0, 10);
    if (role === "admin" && !m.read_at) {
      add("Request updates", `msg:${m.id}`, "indigo", "New message", `${m.sender} sent: ${messageSubject(m)}`, day);
    }
    if (role !== "admin") {
      add("Request updates", `support:${m.id}`, "green", "Request received", `The laboratory received "${messageSubject(m)}". The reply will arrive by email.`, day);
    }
  });

  if (role === "admin") {
    items.filter((item) => item.available === 0).forEach((item) => {
      add("Inventory alerts", `stock:${item.id}`, "amber", "Out of stock", `${item.name} ${item.code} has no units available.`, todayString());
    });
  }

  // newest first, and not more than 20
  return list.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 20);
}

// Draws the bell: the number of new notifications and the list
function renderBell() {
  const notifications = buildNotifications();
  const seen = loadSeen();
  const unread = notifications.filter((n) => !seen.includes(n.key)).length;

  const count = $("bell-count");
  count.textContent = unread > 9 ? "9+" : unread;
  count.classList.toggle("hidden", unread === 0);
  count.classList.toggle("flex", unread > 0);

  $("bell-list").innerHTML = notifications.length === 0
    ? `<p class="p-8 text-center text-sm text-slate-500">No notifications yet.</p>`
    : notifications.map((n) => `
        <div class="flex gap-3 border-b border-slate-100 px-5 py-4 last:border-0">
          <span class="mt-1.5 size-2 shrink-0 rounded-full ${dotColors[n.color]}"></span>
          <div class="min-w-0">
            <div class="text-sm font-bold text-slate-950">${esc(n.title)}</div>
            <p class="mt-1 text-xs leading-5 text-slate-500">${esc(n.text)}</p>
            <div class="mt-1.5 text-[0.65rem] text-slate-400">${whenLabel(n.date)}</div>
          </div>
        </div>`).join("");
}

function toggleBell() {
  const panel = $("bell-panel");
  const opening = panel.classList.contains("hidden");
  panel.classList.toggle("hidden", !opening);

  if (opening) {
    // opening the list means the person has seen everything in it
    const keys = buildNotifications().map((n) => n.key);
    saveSeen([...new Set([...loadSeen(), ...keys])]);
    renderBell();
  }
}

function closeBell() {
  $("bell-panel").classList.add("hidden");
}

// A click anywhere outside the bell closes the list
document.addEventListener("click", (event) => {
  if (!event.target.closest("#bell-wrap")) closeBell();
});

// Auto-refresh: every 30 seconds the data is loaded again, so new requests and
// decisions appear without reloading the page.
function startAutoRefresh() {
  setInterval(async () => {
    if (currentUser === null || document.hidden) return;

    await loadData();
    if (currentUser === null) return;

    // Only redraw the page when nobody is typing and no pop-up or drawer is open
    const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName);
    const modalOpen = !$("modal").classList.contains("hidden");
    const drawerOpen = !$("drawer-panel").classList.contains("translate-x-full");

    if (typing || modalOpen || drawerOpen) {
      renderNav();
      renderBell();
    } else {
      render();
    }
  }, 30000);
}


// ---------- 16c. LOGIN PAGE NUMBERS ----------
// The numbers on the dark side of the login page come from the database
// (totals only: api/public_stats.php sends no names or private data).
async function loadPublicStats() {
  try {
    const response = await fetch("api/public_stats.php");
    if (!response.ok) return;
    const stats = await response.json();
    const twoDigits = (number) => String(number).padStart(2, "0");

    $("stat-items").textContent = stats.items;
    $("stat-items-admin").textContent = stats.items;
    $("stat-available").textContent = stats.available;
    $("stat-ontime").textContent = stats.on_time === null ? "—" : `${stats.on_time}%`;
    $("stat-accounts").textContent = twoDigits(stats.accounts);
    $("stat-requests").textContent = twoDigits(stats.requests);
    $("stat-courses").textContent = twoDigits(stats.courses);
  } catch (error) {
    // No server yet: the dashes stay
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
  $("role-professor-icon").innerHTML = icon("check");
  $("role-professor-check").innerHTML = icon("check", "size-3");
  $("professor-badge-icon").innerHTML = icon("shield", "size-4");
  $("professor-footer-icon").innerHTML = icon("shield", "size-4");
  $("role-admin-check").innerHTML = icon("check", "size-3");
  $("close-menu-btn").innerHTML = icon("close");
  $("open-menu-btn").innerHTML = icon("menu");
  $("request-btn-icon").innerHTML = icon("list", "size-4");
  $("close-drawer-btn").innerHTML = icon("close");
  $("close-modal-btn").innerHTML = icon("close");
  $("bell-icon").innerHTML = icon("bell");
}

// The Escape key closes the pop-up and the request drawer
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
    closeBasket();
    closeBell();
  }
});

setupIcons();
updateThemeIcon();
startAutoRefresh();
loadPublicStats();
checkSession();
