const AUTH = {
  USERS: {
    admin: { password: "admin123", role: "admin" },
    user:  { password: "user123",  role: "user" }
  },
  SESSION_MINUTES: 30
};

function now() { 
  return Date.now(); 
}

function isSessionValid() {
  const exp = Number(localStorage.getItem("sessionExpiry") || "0");
  return exp > now();
}

function isLoggedIn() {
  return localStorage.getItem("isLoggedIn") === "true" && isSessionValid();
}

function getUser() {
  return localStorage.getItem("user");
}

function getRole() {
  return localStorage.getItem("role");
}

function login(username, password) {
  const u = AUTH.USERS[username];
  if (!u || u.password !== password) return false;

  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("user", username);
  localStorage.setItem("role", u.role);
  localStorage.setItem(
    "sessionExpiry", 
    String(now() + AUTH.SESSION_MINUTES * 60 * 1000)
  );

  return true;
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

function requireAuth() {
  if (!isLoggedIn()) {
    logout();
  }
}

// 🧪 For Playwright
window.fakeApiLogin = function(username) {
  const u = AUTH.USERS[username];
  if (!u) return false;
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("user", username);
  localStorage.setItem("role", u.role);
  localStorage.setItem("sessionExpiry", String(now() + 60 * 60 * 1000));
  return true;
};

// ================= UI =================

// Loader
function showLoader() {
  const l = document.getElementById("globalLoader");
  if (l) l.classList.add("show");
}
function hideLoader() {
  const l = document.getElementById("globalLoader");
  if (l) l.classList.remove("show");
}

// Toast
function showToast(message, type = "info") {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast " + type;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}

// Header profile badge
function renderProfileBadge() {
  const el = document.getElementById("profileBadge");
  if (!el) return;
  el.textContent = getUser() + " (" + getRole() + ")";
}

function requireRole(role) {
  requireAuth();
  if (getRole() !== role) {
    alert("❌ Access denied. Admin only.");
    window.location.href = "inventory.html";
  }
}

if (getRole() === "admin") {
  const a = document.createElement("a");
  a.href = "admin.html";
  a.className = "btn ghost";
  a.textContent = "📊 Admin";
  document.querySelector(".header-actions").prepend(a);
}

