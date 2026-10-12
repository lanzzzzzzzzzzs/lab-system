// =====================================================
// LabTrack - Laboratory Borrowing System (plain JavaScript)
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
  return `<svg class="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name]}</svg>`;
}


// ---------- 2. SAMPLE DATA ----------
// Later, this data will come from MySQL through PHP (see loadItems below).
let items = [
  { id: 1, name: "Compound Microscope", code: "MIC-204", category: "Optical", available: 8, total: 12, icon: "microscope", color: "indigo" },
  { id: 2, name: "Erlenmeyer Flask Set", code: "GLS-118", category: "Glassware", available: 14, total: 20, icon: "flask", color: "cyan" },
  { id: 3, name: "Digital Thermometer", code: "MEA-072", category: "Measuring", available: 3, total: 8, icon: "thermometer", color: "amber" },
  { id: 4, name: "Precision Balance", code: "MEA-093", category: "Measuring", available: 0, total: 6, icon: "cube", color: "violet" },
  { id: 5, name: "Beaker Set · 6 pcs", code: "GLS-042", category: "Glassware", available: 9, total: 10, icon: "beaker", color: "emerald" },
  { id: 6, name: "Stereo Microscope", code: "MIC-217", category: "Optical", available: 2, total: 5, icon: "microscope", color: "rose" }
];

const categories = ["All items", "Optical", "Glassware", "Measuring"];

let requests = [
  { id: "REQ-1048", student: "Maya Chen", initials: "MC", course: "Microbiology · Y2", item: "Compound Microscope", code: "MIC-204", date: "Aug 21", status: "Pending" },
  { id: "REQ-1047", student: "Noah Williams", initials: "NW", course: "Chemistry · Y3", item: "Erlenmeyer Flask Set", code: "GLS-118", date: "Aug 19", status: "Pending" },
  { id: "REQ-1046", student: "Sofia Patel", initials: "SP", course: "Biochemistry · Y1", item: "Digital Thermometer", code: "MEA-072", date: "Aug 18", status: "Approved" },
  { id: "REQ-1045", student: "Liam Scott", initials: "LS", course: "Physics · Y4", item: "Stereo Microscope", code: "MIC-217", date: "Aug 17", status: "Returned" }
];


// ---------- 3. APP STATE ----------
// These variables remember what the user is doing right now.
let loginRole = "student";   // role chosen on the login screen
let role = "student";        // role after logging in: "student" or "admin"
let panel = "browse";        // which page is showing
let category = "All items";  // selected category filter
let query = "";              // text in the search box
let basket = [];             // ids of items in the request
let submitted = false;       // true for a moment after submitting a request

// Default return date = 7 days from today (format: YYYY-MM-DD)
let dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

// Shortcut so we don't type document.getElementById every time
const $ = (id) => document.getElementById(id);


// ---------- 4. LOGIN ----------
function selectRole(newRole) {
  loginRole = newRole;
  $("role-student").classList.toggle("active", newRole === "student");
  $("role-admin").classList.toggle("active", newRole === "admin");
  $("login-button-text").textContent = newRole === "student" ? "Sign in as student" : "Sign in as administrator";
  $("login-email").placeholder = newRole === "student" ? "student@labtrack.edu" : "admin@labtrack.edu";
  $("login-error").classList.add("hidden");
}

function togglePassword() {
  const input = $("login-password");
  const hidden = input.type === "password";
  input.type = hidden ? "text" : "password";
  $("toggle-password").textContent = hidden ? "Hide" : "Show";
}

async function handleLogin(event) {
  event.preventDefault(); // stop the page from reloading

  const email = $("login-email").value.trim();
  const password = $("login-password").value.trim();

  if (email === "" || password === "") {
    $("login-error").textContent = "Enter your email and password to continue.";
    $("login-error").classList.remove("hidden");
    return;
  }

  // DEMO ONLY: later, PHP will check the email and password against MySQL
  role = loginRole;
  panel = role === "student" ? "browse" : "overview";

  await loadItems();

  $("login-screen").classList.add("hidden");
  $("app").classList.remove("hidden");
  render();
}

function logout() {
  basket = [];
  $("app").classList.add("hidden");
  $("login-screen").classList.remove("hidden");
  $("login-password").value = "";
  closeBasket();
}

// Fetch API: ask the server for the equipment list. If there is no server yet,
// the sample data above is used instead.
async function loadItems() {
  try {
    const response = await fetch("api/items.php");
    items = await response.json();
  } catch (error) {
    console.log("No server yet, using sample items.");
  }
}


// ---------- 5. SMALL HELPERS ----------
// Colored label for a status like "Pending" or "Approved"
function badge(status) {
  let style = "bg-rose-50 text-rose-600";
  if (["Active", "Returned", "Approved", "Operational"].includes(status)) {
    style = "bg-violet-50 text-violet-700";
  } else if (["Pending", "Due soon"].includes(status)) {
    style = "bg-amber-50 text-amber-700";
  }
  return `<span class="w-fit rounded-full px-2.5 py-1 text-[0.68rem] font-bold ${style}">${status}</span>`;
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
      <div class="mt-1 text-xs text-slate-400">${note}</div>
    </div>`).join("");
}


// ---------- 6. MAIN RENDER ----------
// render() redraws every part of the screen from the current state.
function render() {
  renderNav();
  renderUserCard();
  renderHeader();
  renderContent();
  renderBasket();
}

// Sidebar links
function navButton(id, iconName, label, extra = "") {
  const active = panel === id ? "nav-item-active" : "";
  return `<button onclick="go('${id}')" class="nav-item ${active}">${icon(iconName)} ${label} ${extra}</button>`;
}

function renderNav() {
  const pending = requests.filter((r) => r.status === "Pending").length;
  let links = "";

  if (role === "student") {
    links += navButton("browse", "dashboard", "Browse equipment");
    links += navButton("borrowings", "list", "My borrowings", `<span class="ml-auto rounded-full bg-slate-800 px-2 py-0.5 text-xs">2</span>`);
    links += navButton("history", "history", "Request history");
  } else {
    links += navButton("overview", "dashboard", "Overview");
    links += navButton("inventory", "cube", "Inventory");
    links += navButton("requests", "list", "Borrowing requests", `<span class="ml-auto rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-slate-950">${pending}</span>`);
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
  $("user-card").innerHTML = `
    <div class="mb-3 flex items-center gap-3">
      <div class="flex size-9 items-center justify-center rounded-full bg-indigo-400 font-bold text-slate-950">${isStudent ? "AM" : "JD"}</div>
      <div class="min-w-0 flex-1">
        <div class="truncate text-sm font-semibold text-white">${isStudent ? "Alex Morgan" : "Dr. Jordan Davis"}</div>
        <div class="truncate text-xs text-slate-500">${isStudent ? "Biochemistry · Y3" : "LabTrack administrator"}</div>
      </div>
      <button onclick="logout()" class="text-slate-500 transition hover:text-white" aria-label="Sign out" title="Sign out">${icon("logout", "size-4")}</button>
    </div>
    ${isStudent ? `
      <div class="h-1.5 overflow-hidden rounded-full bg-slate-800"><div class="h-full w-2/5 rounded-full bg-violet-400"></div></div>
      <div class="mt-2 flex justify-between text-[0.68rem] text-slate-500"><span>2 items borrowed</span><span>5 max</span></div>` : ""}`;
}

function renderHeader() {
  const isStudent = role === "student";
  const now = new Date();
  const hour = now.getHours();
  const timeOfDay = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  const weekday = now.toLocaleDateString("en-US", { weekday: "long" });
  const month = now.toLocaleDateString("en-US", { month: "long" });

  $("greeting").textContent = isStudent ? `Good ${timeOfDay}, Alex` : "Admin dashboard";
  $("today").textContent = isStudent ? `${weekday}, ${now.getDate()} ${month}` : "LabTrack operations";
  $("request-btn").classList.toggle("hidden", !isStudent);

  // The search box in the top bar is only for students (desktop screens)
  $("header-search-box").classList.toggle("md:block", isStudent);
  $("header-search").value = query;
}

// Decide which page to draw
function renderContent() {
  if (panel === "browse") {
    renderBrowse();
  } else if (panel === "overview") {
    $("content").innerHTML = overviewPage();
  } else {
    $("content").innerHTML = otherPage(panel);
  }
}

function go(newPanel) {
  panel = newPanel;
  closeMenu();
  render();
}


// ---------- 7. STUDENT: BROWSE EQUIPMENT ----------
function renderBrowse() {
  const readyCount = items.reduce((sum, item) => sum + item.available, 0);

  const stats = [
    ["Available now", readyCount, "cube", "emerald", "Items ready to borrow"],
    ["My borrowings", "02", "list", "indigo", "Currently borrowed"],
    ["Due this week", "01", "calendar", "amber", "Return soon"],
    ["Pending requests", "01", "clock", "violet", "Waiting for approval"]
  ];

  const tabs = categories.map((name) => `
    <button onclick="setCategory('${name}')"
      class="whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-semibold transition ${category === name ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-800"}">${name}</button>`).join("");

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
        <input id="page-search" value="${query}" oninput="setQuery(this.value)" placeholder="Search equipment…" aria-label="Search equipment"
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
    (item.name.toLowerCase().includes(search) ||
      item.code.toLowerCase().includes(search))
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
    const selected = basket.includes(item.id);
    const unavailable = item.available === 0;

    let buttonStyle = "bg-slate-950 text-white hover:bg-violet-400 hover:text-slate-950";
    if (selected) buttonStyle = "bg-violet-400 text-slate-950";
    if (unavailable) buttonStyle = "cursor-not-allowed bg-slate-100 text-slate-300";

    return `
      <article class="overflow-hidden rounded-2xl border bg-white transition duration-200 hover:-translate-y-0.5 hover:shadow-lg ${selected ? "border-violet-400 ring-2 ring-violet-100" : "border-slate-200"}">
        <div class="equipment-visual visual-${item.color}">
          <div class="absolute inset-4 rounded-full border border-current opacity-10"></div>
          ${icon(item.icon, "relative size-20 stroke-[1.15]")}
          <span class="absolute left-4 top-4 rounded-full bg-white/80 px-2.5 py-1 text-[0.65rem] font-bold text-slate-600">${item.category}</span>
        </div>
        <div class="p-5">
          <div class="flex items-start justify-between gap-3">
            <div>
              <h3 class="font-bold text-slate-950">${item.name}</h3>
              <p class="mt-1 font-mono text-[0.68rem] tracking-wide text-slate-400">${item.code}</p>
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
              aria-label="${selected ? "Remove" : "Add"} ${item.name}">
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

  renderItems();
}


// ---------- 8. REQUEST DRAWER ----------
function toggleBasket(id) {
  if (basket.includes(id)) {
    basket = basket.filter((itemId) => itemId !== id);
  } else if (basket.length >= 5) {
    alert("You can request up to 5 items at a time.");
    return;
  } else {
    basket.push(id);
  }
  renderItems();
  renderBasket();
}

function setDueDate(value) {
  dueDate = value;
}

function renderBasket() {
  $("basket-count").textContent = `${basket.length} of 5 item slots selected`;

  // Number on the header button
  const badgeEl = $("basket-badge");
  badgeEl.textContent = basket.length;
  badgeEl.classList.toggle("hidden", basket.length === 0);
  badgeEl.classList.toggle("flex", basket.length > 0);

  const picked = items.filter((item) => basket.includes(item.id));

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
        ${picked.map((item) => `
          <div class="flex items-center gap-3 rounded-2xl border border-slate-200 p-3">
            <div class="flex size-12 shrink-0 items-center justify-center rounded-xl visual-${item.color}">${icon(item.icon, "size-7")}</div>
            <div class="min-w-0 flex-1">
              <div class="truncate text-sm font-bold">${item.name}</div>
              <div class="mt-0.5 text-xs text-slate-400">${item.code}</div>
            </div>
            <button onclick="toggleBasket(${item.id})" class="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500" aria-label="Remove ${item.name}">${icon("minus", "size-4")}</button>
          </div>`).join("")}
      </div>
      <div class="mt-7 rounded-2xl bg-slate-50 p-4">
        <label class="text-xs font-bold text-slate-600" for="return-date">Expected return date</label>
        <input id="return-date" type="date" value="${dueDate}" onchange="setDueDate(this.value)"
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

function submitRequest() {
  submitted = true;
  renderBasket();

  // Later: send the request to PHP with fetch("api/borrow.php", { method: "POST", ... })
  setTimeout(() => {
    basket = [];
    submitted = false;
    closeBasket();
    renderBasket();
    if (panel === "browse") renderItems();
  }, 1500);
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


// ---------- 10. ADMIN: OVERVIEW ----------
function updateRequest(id, status) {
  requests = requests.map((r) => (r.id === id ? { ...r, status } : r));
  render();
}

function overviewPage() {
  const pending = requests.filter((r) => r.status === "Pending").length;

  // Total and borrowed are sample numbers from the design.
  // Later they will come from MySQL (COUNT / SUM queries).
  const stats = [
    ["Total equipment", 61, "cube", "indigo", "+4 this month"],
    ["Currently borrowed", 18, "list", "violet", "29% of inventory"],
    ["Pending approval", String(pending).padStart(2, "0"), "clock", "amber", "Needs attention"],
    ["Overdue items", "03", "calendar", "rose", "Follow up today"]
  ];

  const requestRows = requests.map((r) => {
    // Pending requests show approve/decline buttons, the rest show a status label
    const actions = r.status === "Pending"
      ? `<button onclick="updateRequest('${r.id}', 'Declined')" class="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500" aria-label="Decline ${r.id}">${icon("close", "size-4")}</button>
         <button onclick="updateRequest('${r.id}', 'Approved')" class="flex size-9 items-center justify-center rounded-lg bg-violet-400 text-slate-950 transition hover:bg-violet-300" aria-label="Approve ${r.id}">${icon("check", "size-4")}</button>`
      : badge(r.status);

    return `
      <div class="grid gap-4 p-4 sm:grid-cols-[minmax(12rem,1.2fr)_minmax(10rem,1fr)_5rem_auto] sm:items-center sm:px-5">
        <div class="flex items-center gap-3">
          <div class="flex size-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600">${r.initials}</div>
          <div class="min-w-0">
            <div class="truncate text-sm font-bold text-slate-900">${r.student}</div>
            <div class="mt-0.5 truncate text-xs text-slate-400">${r.course}</div>
          </div>
        </div>
        <div>
          <div class="truncate text-sm font-semibold text-slate-700">${r.item}</div>
          <div class="mt-0.5 text-xs text-slate-400">${r.code} · ${r.id}</div>
        </div>
        <div class="text-xs font-semibold text-slate-500">${r.date}</div>
        <div class="flex items-center justify-end gap-2">${actions}</div>
      </div>`;
  }).join("");

  const lowStock = items.filter((item) => item.available <= 3).map((item) => `
    <div class="flex items-center gap-3">
      <div class="flex size-9 items-center justify-center rounded-lg visual-${item.color}">${icon(item.icon)}</div>
      <div class="min-w-0 flex-1">
        <div class="truncate text-xs font-bold">${item.name}</div>
        <div class="mt-0.5 text-[0.68rem] text-slate-400">${item.code}</div>
      </div>
      <span class="text-xs font-bold ${item.available === 0 ? "text-rose-500" : "text-amber-600"}">${item.available} left</span>
    </div>`).join("");

  return `
    ${pageHeader("Admin workspace", "LabTrack overview", "Manage equipment, review requests, and monitor lending activity.",
      `<button class="flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800">${icon("plus", "size-4")} Add equipment</button>`)}

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
        <div class="divide-y divide-slate-100">${requestRows}</div>
      </div>

      <div class="space-y-5">
        <div class="rounded-2xl bg-slate-950 p-6 text-white">
          <div class="flex items-center justify-between">
            <div class="flex size-10 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">${icon("shield")}</div>
            <span class="text-xs font-semibold text-violet-300">Good standing</span>
          </div>
          <h2 class="mt-6 font-bold">Inventory health</h2>
          <div class="mt-2 text-3xl font-bold">92%</div>
          <div class="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><div class="h-full w-[92%] rounded-full bg-violet-400"></div></div>
          <p class="mt-4 text-xs leading-5 text-slate-400">56 of 61 items are operational and ready for laboratory use.</p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 class="font-bold text-slate-950">Low availability</h2>
          <div class="mt-4 space-y-4">${lowStock}</div>
        </div>
      </div>
    </section>`;
}


// ---------- 11. OTHER PAGES ----------
const panelDetails = {
  borrowings: ["Student workspace", "My borrowings", "Track active loans and upcoming return dates."],
  history: ["Student workspace", "Request history", "Review your previous equipment requests and outcomes."],
  inventory: ["Admin workspace", "Equipment inventory", "Monitor stock levels and equipment condition."],
  requests: ["Admin workspace", "Borrowing requests", "Review and process requests submitted by students."],
  lending: ["Admin workspace", "Lending history", "A complete log of equipment lending activity."],
  help: ["Support", "Help center", "Guides and answers for using the laboratory hub."],
  settings: ["Account", "Settings", "Manage your profile, notifications, and preferences."]
};

function otherPage(name) {
  const [eyebrow, title, description] = panelDetails[name];

  if (name === "help") return pageHeader(eyebrow, title, description) + helpBody();
  if (name === "settings") return pageHeader(eyebrow, title, description) + settingsBody();
  if (name === "inventory") {
    const addButton = `<button class="flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white">${icon("plus", "size-4")} Add equipment</button>`;
    return pageHeader(eyebrow, title, description, addButton) + inventoryBody();
  }

  // The rest are simple lists. Each row = [name, sub text, info 1, info 2, status]
  let rows = [];
  let listTitle = "Activity records";
  let action = "";
  let banner = "";

  if (name === "borrowings") {
    listTitle = "Currently borrowed";
    action = `<button onclick="go('browse')" class="flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white">${icon("plus", "size-4")} New request</button>`;
    banner = `
      <div class="mb-5 rounded-2xl bg-amber-50 p-5 sm:flex sm:items-center sm:justify-between">
        <div class="flex gap-3">
          <div class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">${icon("clock")}</div>
          <div>
            <div class="text-sm font-bold text-amber-900">One item is due in 4 days</div>
            <div class="mt-1 text-xs text-amber-700">Return it on time to keep your borrowing privileges active.</div>
          </div>
        </div>
        <button class="mt-4 text-xs font-bold text-amber-800 sm:mt-0">View return policy</button>
      </div>`;
    rows = [
      ["Compound Microscope", "MIC-204", "Borrowed Aug 10", "Due Aug 18", "Due soon"],
      ["Beaker Set · 6 pcs", "GLS-042", "Borrowed Aug 12", "Due Aug 26", "Active"]
    ];
  } else if (name === "requests") {
    listTitle = "All requests";
    rows = requests.map((r) => [r.student, r.id, r.item, `Return ${r.date}`, r.status]);
  } else if (name === "lending") {
    rows = [
      ["Erlenmeyer Flask Set", "REQ-1039", "Returned Aug 06", "7 days", "Returned"],
      ["Digital Thermometer", "REQ-1028", "Returned Jul 24", "5 days", "Returned"],
      ["Precision Balance", "REQ-1014", "Maya Chen", "12 days", "Overdue"],
      ["Stereo Microscope", "REQ-0997", "Returned Jun 29", "4 days", "Returned"]
    ];
  } else {
    // history (student)
    rows = [
      ["Erlenmeyer Flask Set", "REQ-1039", "Returned Aug 06", "7 days", "Returned"],
      ["Digital Thermometer", "REQ-1028", "Returned Jul 24", "5 days", "Returned"],
      ["Precision Balance", "REQ-1014", "Declined Jul 12", "Unavailable", "Declined"],
      ["Stereo Microscope", "REQ-0997", "Returned Jun 29", "4 days", "Returned"]
    ];
  }

  const rowsHtml = rows.map(([name1, sub, info1, info2, status]) => `
    <div class="record-row grid gap-3 p-5 sm:grid-cols-[1.2fr_.8fr_.7fr_auto] sm:items-center">
      <div>
        <div class="text-sm font-bold">${name1}</div>
        <div class="mt-1 text-xs text-slate-400">${sub}</div>
      </div>
      <div class="text-xs font-semibold text-slate-500">${info1}</div>
      <div class="text-xs text-slate-500">${info2}</div>
      ${badge(status)}
    </div>`).join("");

  return `
    ${pageHeader(eyebrow, title, description, action)}
    ${banner}
    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div class="flex items-center justify-between border-b border-slate-200 p-5">
        <h2 class="font-bold">${listTitle}</h2>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">${icon("search", "size-4")}</span>
          <input oninput="filterRecords(this.value)" placeholder="Search records" aria-label="Search records"
            class="h-9 w-40 rounded-lg border border-slate-200 pl-9 pr-3 text-xs outline-none focus:border-violet-500">
        </div>
      </div>
      <div class="divide-y divide-slate-100">${rowsHtml}</div>
    </div>`;
}

// Hide the rows that do not contain the typed text
function filterRecords(text) {
  const search = text.toLowerCase();
  document.querySelectorAll(".record-row").forEach((row) => {
    row.classList.toggle("hidden", !row.textContent.toLowerCase().includes(search));
  });
}

function inventoryBody() {
  // Tabs are just for the look for now (the labels are sample numbers from the design)
  const tabs = ["All 61", "Available 36", "Borrowed 18", "Maintenance 7"];
  const tabsHtml = tabs.map((label, index) => `
    <button class="whitespace-nowrap rounded-lg px-4 py-2 text-xs font-bold ${index === 0 ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}">${label}</button>`).join("");

  const rows = items.map((item) => `
    <div class="grid gap-4 border-b border-slate-100 p-4 last:border-0 md:grid-cols-[1.5fr_.7fr_.7fr_.7fr_auto] md:items-center md:px-5">
      <div class="flex items-center gap-3">
        <div class="flex size-11 items-center justify-center rounded-xl visual-${item.color}">${icon(item.icon, "size-6")}</div>
        <div>
          <div class="text-sm font-bold">${item.name}</div>
          <div class="mt-0.5 text-xs text-slate-400">${item.code}</div>
        </div>
      </div>
      <span class="text-xs font-semibold text-slate-500">${item.category}</span>
      <span class="text-xs font-bold ${item.available ? "text-violet-600" : "text-rose-500"}">${item.available} / ${item.total}</span>
      <span class="w-fit rounded-full bg-violet-50 px-2.5 py-1 text-[0.68rem] font-bold text-violet-700">${item.available ? "Operational" : "Inspection"}</span>
      <button class="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500" aria-label="Manage ${item.name}">${icon("settings", "size-4")}</button>
    </div>`).join("");

  return `
    <div class="mb-5 flex gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1 sm:w-fit">${tabsHtml}</div>
    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div class="hidden grid-cols-[1.5fr_.7fr_.7fr_.7fr_auto] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-[0.65rem] font-bold uppercase tracking-wider text-slate-400 md:grid">
        <span>Equipment</span><span>Category</span><span>Availability</span><span>Condition</span><span>Actions</span>
      </div>
      ${rows}
    </div>`;
}

function helpBody() {
  const guides = [
    ["Borrowing equipment", "Learn how to find items, submit a request, and collect approved equipment.", "beaker"],
    ["Returns & extensions", "Understand return dates, renewals, and what to do if an item is overdue.", "calendar"],
    ["Safety & responsibility", "Review handling rules and laboratory equipment safety requirements.", "shield"]
  ];

  return `
    <div class="grid gap-4 md:grid-cols-3">
      ${guides.map(([title, text, iconName]) => `
        <button class="rounded-2xl border border-slate-200 bg-white p-6 text-left transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-lg">
          <div class="flex size-11 items-center justify-center rounded-xl bg-violet-50 text-violet-700">${icon(iconName)}</div>
          <h2 class="mt-5 font-bold text-slate-950">${title}</h2>
          <p class="mt-2 text-sm leading-6 text-slate-500">${text}</p>
          <div class="mt-5 flex items-center gap-2 text-xs font-bold text-violet-700">Read guide ${icon("arrow", "size-3.5")}</div>
        </button>`).join("")}
    </div>
    <div class="mt-5 flex flex-col items-start justify-between gap-4 rounded-2xl bg-slate-950 p-6 text-white sm:flex-row sm:items-center">
      <div>
        <h2 class="font-bold">Still need help?</h2>
        <p class="mt-1 text-sm text-slate-400">The laboratory team usually replies within one working day.</p>
      </div>
      <button class="rounded-xl bg-violet-400 px-5 py-3 text-sm font-bold text-slate-950">Contact laboratory</button>
    </div>`;
}

function settingsBody() {
  const fields = [
    ["Full name", "Alex Morgan", ""],
    ["Student ID", "STU-2024-081", "readonly"],
    ["Email address", "alex.morgan@labtrack.edu", ""],
    ["Department", "Biochemistry", ""]
  ];
  const notifications = ["Request updates", "Return reminders", "Inventory alerts"];

  return `
    <div class="grid gap-5 lg:grid-cols-[1fr_20rem]">
      <div class="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 class="font-bold text-slate-950">Profile information</h2>
        <div class="mt-6 grid gap-5 sm:grid-cols-2">
          ${fields.map(([label, value, extra]) => `
            <label class="text-xs font-bold text-slate-600">${label}
              <input value="${value}" ${extra} class="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm font-normal outline-none focus:border-violet-500 ${extra ? "bg-slate-50 text-slate-500" : ""}">
            </label>`).join("")}
        </div>
        <button class="mt-6 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">Save changes</button>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 class="font-bold text-slate-950">Notifications</h2>
        <div class="mt-5 space-y-5">
          ${notifications.map((label, index) => `
            <label class="flex items-center justify-between gap-4 text-sm font-semibold text-slate-700">
              ${label}<input type="checkbox" ${index < 2 ? "checked" : ""} class="size-4 accent-violet-500">
            </label>`).join("")}
        </div>
      </div>
    </div>`;
}


// ---------- 12. START ----------
// Put the icons into the fixed parts of the HTML page.
function setupIcons() {
  $("login-logo").innerHTML = icon("flask", "size-7");
  $("login-logo-small").innerHTML = icon("flask");
  $("header-search-icon").innerHTML = icon("search", "size-4");
  $("login-badge-icon").innerHTML = icon("shield", "size-4");
  $("login-arrow").innerHTML = icon("arrow", "size-4");
  $("sidebar-logo").innerHTML = icon("flask", "size-6");
  $("role-student-icon").innerHTML = icon("beaker");
  $("role-admin-icon").innerHTML = icon("shield");
  $("role-student-check").innerHTML = icon("check", "size-3");
  $("role-admin-check").innerHTML = icon("check", "size-3");
  $("close-menu-btn").innerHTML = icon("close");
  $("open-menu-btn").innerHTML = icon("menu");
  $("request-btn-icon").innerHTML = icon("list", "size-4");
  $("close-drawer-btn").innerHTML = icon("close");
}

setupIcons();
