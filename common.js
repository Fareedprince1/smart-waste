// Storage helpers, KEYS, seeds, auth, points, posts, missions, tasks, team, leaderboard, utilities, and initCommonUI

//const // Storage helpers, KEYS, seeds, auth, points, posts, missions, tasks, team, leaderboard, utilities, and initCommonUI

const storage = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  update(key, updater, fallback) {
    const current = storage.get(key, fallback);
    const updated = updater(current);
    storage.set(key, updated);
    return updated;
  },
};

const KEYS = {
  users: 'swm_users',
  currentUser: 'swm_current_user',
  posts: 'swm_posts',
  missions: 'swm_missions',
  events: 'swm_events',
  tasks: 'swm_tasks',
  team: 'swm_team',
  tips: 'swm_tips',
};

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
function futureDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
function shortName(user) {
  if (!user) return 'User';
  if (user.name) return user.name.split(' ')[0];
  return user.email?.split('@')[0] || 'User';
}
function formatDateTime(ts) {
  const d = new Date(ts);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

// Data seeds
function initDataSeeds() {
  if (!storage.get(KEYS.users)) {
    storage.set(KEYS.users, [
      { id: uid(), email: 'eco@demo.com', password: 'password', role: 'Individual', name: 'Eco Demo', points: 75, joinedMissions: [], createdAt: Date.now() },
      { id: uid(), email: 'leader@demo.com', password: 'password', role: 'Community Leader', name: 'Green Leader', points: 120, joinedMissions: [], createdAt: Date.now() },
      { id: uid(), email: 'org@demo.com', password: 'password', role: 'Organization', name: 'Eco Org', points: 200, joinedMissions: [], createdAt: Date.now() },
    ]);
  }
  if (!storage.get(KEYS.posts)) {
    storage.set(KEYS.posts, [
      {
        id: uid(),
        authorEmail: 'eco@demo.com',
        authorName: 'Eco Demo',
        content: 'Sorted my plastic and paper today! ♻️',
        imageDataUrl: '',
        likes: [],
        comments: [{ id: uid(), authorEmail: 'leader@demo.com', authorName: 'Green Leader', content: 'Great job!', createdAt: Date.now() - 3600_000 }],
        createdAt: Date.now() - 86_400_000,
      },
      {
        id: uid(),
        authorEmail: 'leader@demo.com',
        authorName: 'Green Leader',
        content: 'Organized a neighborhood clean-up, collected 50kg of waste!',
        imageDataUrl: 'https://via.placeholder.com/400x200/81c784/ffffff?text=Clean-up+Event',
        likes: [{ email: 'eco@demo.com' }],
        comments: [],
        createdAt: Date.now() - 172_800_000,
      },
    ]);
  }
  if (!storage.get(KEYS.missions)) {
    storage.set(KEYS.missions, [
      { id: 'swachh', name: 'Swachh Bharat', description: 'Keep surroundings clean and green.', points: 20, joinedUsers: [] },
      { id: 'plastic-ban', name: 'Plastic Ban', description: 'Reduce single-use plastics in daily life.', points: 20, joinedUsers: [] },
      { id: 'clean-rivers', name: 'Clean Rivers', description: 'Participate in river clean-up drives.', points: 25, joinedUsers: [] },
      { id: 'ewaste', name: 'E-waste Drive', description: 'Recycle electronics responsibly.', points: 25, joinedUsers: [] },
      { id: 'tree-plant', name: 'Tree Plantation', description: 'Plant and care for trees locally.', points: 30, joinedUsers: [] },
      { id: 'compost', name: 'Composting at Home', description: 'Start composting kitchen waste.', points: 20, joinedUsers: [] },
    ]);
  }
  if (!storage.get(KEYS.events)) {
    storage.set(KEYS.events, [
      { id: uid(), title: 'Beach Clean-Up', date: futureDate(3), place: 'Marine Drive' },
      { id: uid(), title: 'E-waste Collection Camp', date: futureDate(7), place: 'Community Hall' },
      { id: uid(), title: 'Park Plastic Audit', date: futureDate(14), place: 'Central Park' },
    ]);
  }
  if (!storage.get(KEYS.team)) {
    storage.set(KEYS.team, [
      { id: uid(), name: 'Aisha Khan', email: 'aisha@example.com', role: 'Volunteer' },
      { id: uid(), name: 'Ravi Patel', email: 'ravi@example.com', role: 'Volunteer' },
      { id: uid(), name: 'Meera Joshi', email: 'meera@example.com', role: 'Coordinator' },
      { id: uid(), name: 'Arun Singh', email: 'arun@example.com', role: 'Volunteer' },
    ]);
  }
  if (!storage.get(KEYS.tasks)) {
    storage.set(KEYS.tasks, [
      { id: uid(), title: 'Organize neighborhood clean-up', assigneeEmail: 'meera@example.com', assigneeName: 'Meera Joshi', progress: 60, status: 'In Progress', createdAt: Date.now() - 7200_000 },
      { id: uid(), title: 'Distribute awareness flyers', assigneeEmail: 'aisha@example.com', assigneeName: 'Aisha Khan', progress: 20, status: 'To Do', createdAt: Date.now() - 3600_000 },
    ]);
  }
  if (!storage.get(KEYS.tips)) {
    storage.set(KEYS.tips, [
      'Carry a reusable water bottle to reduce plastic waste.',
      'Compost your kitchen scraps to enrich the soil.',
      'Say no to single-use plastics like straws and cutlery.',
      'Repair and reuse items before buying new.',
      'Donate old clothes and electronics responsibly.',
      'Rinse recyclables to avoid contamination.',
      'Buy in bulk to reduce packaging waste.',
    ]);
  }
}

// Auth
function getUsers() { return storage.get(KEYS.users, []); }
function setUsers(users) { storage.set(KEYS.users, users); }
function getCurrentUser() {
  const email = storage.get(KEYS.currentUser, null);
  if (!email) return null;
  return getUsers().find((u) => u.email === email) || null;
}
function setCurrentUserByEmail(email) { storage.set(KEYS.currentUser, email); }
function logout() {
  localStorage.removeItem(KEYS.currentUser);
  location.href = '../pages/login.html';
}
function requireAuth(redirectBack = true) {
  const user = getCurrentUser();
  if (!user) {
    const back = redirectBack ? `?next=${encodeURIComponent(location.pathname)}` : '';
    location.href = `../pages/login.html${back}`;
    return null;
  }
  return user;
}

// Points
function addPoints(email, amount, reason = '') {
  if (!email || !Number.isFinite(amount)) return;
  const users = getUsers();
  const idx = users.findIndex((u) => u.email === email);
  if (idx >= 0) {
    users[idx].points = (users[idx].points || 0) + amount;
    setUsers(users);
  }
}

// Posts
function getPosts() { return storage.get(KEYS.posts, []).sort((a, b) => b.createdAt - a.createdAt); }
function setPosts(posts) { storage.set(KEYS.posts, posts); }

// Missions
function getMissions() { return storage.get(KEYS.missions, []); }
function setMissions(m) { storage.set(KEYS.missions, m); }

// Tasks and Team
function getTasks() { return storage.get(KEYS.tasks, []); }
function setTasks(t) { storage.set(KEYS.tasks, t); }
function getTeam() { return storage.get(KEYS.team, []); }
function setTeam(t) { storage.set(KEYS.team, t); }

// Leaderboard
function computeLeaderboard(limit = 10) {
  return getUsers()
    .slice()
    .sort((a, b) => (b.points || 0) - (a.points || 0))
    .slice(0, limit);
}

// Common UI
function initCommonUI() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const mobileBtn = document.getElementById('mobileMenuButton');
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  const authBtn = document.getElementById('authButton'); // Main header auth button
  const authBtnMobile = document.getElementById('authButtonMobile'); // Mobile auth button
  const dashAuthBtn = document.getElementById('dashAuthBtn'); // Specific to dashboard quick actions

  const user = getCurrentUser();

  // Function to wire the main header auth buttons (Login/Logout with user name)
  function wireMainAuthButton(el) {
    if (!el) return;
    if (user) {
      el.innerHTML = `<img src="../images/user.svg" class="h-4 w-4" alt="User" /> <span>${SWM.shortName(user)} (${user.role})</span>`;
      el.href = '#'; // Make it a button visually, or link to a profile page
      el.removeEventListener('click', SWM.logout); // Remove any previous logout listeners
      el.addEventListener('click', (e) => { // Add a new one for logout
          e.preventDefault();
          SWM.logout();
      });
    } else {
      el.innerHTML = `<img src="../images/user.svg" class="h-4 w-4" alt="User" /> <span>Login</span>`;
      el.href = '../pages/login.html';
      el.removeEventListener('click', SWM.logout); // Ensure no logout listener
    }
  }

  // Function to wire simple auth buttons (e.g., dashboard's quick actions)
  function wireSimpleAuthButton(el) {
    if (!el) return;
    if (user) {
      el.textContent = 'Logout';
      el.href = '#';
      el.removeEventListener('click', SWM.logout); // Ensure clean listener
      el.addEventListener('click', (e) => {
        e.preventDefault();
        SWM.logout();
      });
    } else {
      el.textContent = 'Login';
      el.href = '../pages/login.html';
      el.removeEventListener('click', SWM.logout); // Ensure no logout listener
    }
  }

  // Apply wiring functions
  wireMainAuthButton(authBtn);
  wireMainAuthButton(authBtnMobile);
  wireSimpleAuthButton(dashAuthBtn); // Use for the dashboard's specific quick action button

  // Update role display on dashboard if elements exist
  function updateUserRoleDisplay() {
    const userRoleBadge = document.getElementById('userRoleBadge'); // Dashboard role badge
    if (user && userRoleBadge) {
      userRoleBadge.textContent = user.role;
      userRoleBadge.classList.remove('hidden');
    } else if (userRoleBadge) {
      userRoleBadge.classList.add('hidden');
    }
  }
  updateUserRoleDisplay();
}


// Export to window for use in other scripts
window.SWM = {
  storage, KEYS, uid, futureDate, shortName, formatDateTime,
  initDataSeeds, getUsers, setUsers, getCurrentUser, setCurrentUserByEmail, logout, requireAuth,
  addPoints, getPosts, setPosts, getMissions, setMissions, getTasks, setTasks, getTeam, setTeam,
  computeLeaderboard, initCommonUI
};storage = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  update(key, updater, fallback) {
    const current = storage.get(key, fallback);
    const updated = updater(current);
    storage.set(key, updated);
    return updated;
  },
};

const keys = {
  users: 'swm_users',
  currentUser: 'swm_current_user',
  posts: 'swm_posts',
  missions: 'swm_missions',
  events: 'swm_events',
  tasks: 'swm_tasks',
  team: 'swm_team',
  tips: 'swm_tips',
};

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
function futureDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
function shortName(user) {
  if (!user) return 'User';
  if (user.name) return user.name.split(' ')[0];
  return user.email?.split('@')[0] || 'User';
}
function formatDateTime(ts) {
  const d = new Date(ts);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

// Data seeds
function initDataSeeds() {
  if (!storage.get(KEYS.users)) {
    storage.set(KEYS.users, [
      { id: uid(), email: 'eco@demo.com', password: 'password', role: 'Individual', name: 'Eco Demo', points: 75, joinedMissions: [], createdAt: Date.now() },
      { id: uid(), email: 'leader@demo.com', password: 'password', role: 'Community Leader', name: 'Green Leader', points: 120, joinedMissions: [], createdAt: Date.now() },
    ]);
  }
  if (!storage.get(KEYS.posts)) {
    storage.set(KEYS.posts, [
      {
        id: uid(),
        authorEmail: 'eco@demo.com',
        authorName: 'Eco Demo',
        content: 'Sorted my plastic and paper today! ♻️',
        imageDataUrl: '',
        likes: [],
        comments: [{ id: uid(), authorEmail: 'leader@demo.com', authorName: 'Green Leader', content: 'Great job!', createdAt: Date.now() - 3600_000 }],
        createdAt: Date.now() - 86_400_000,
      },
    ]);
  }
  if (!storage.get(KEYS.missions)) {
    storage.set(KEYS.missions, [
      { id: 'swachh', name: 'Swachh Bharat', description: 'Keep surroundings clean and green.', points: 20, joinedUsers: [] },
      { id: 'plastic-ban', name: 'Plastic Ban', description: 'Reduce single-use plastics in daily life.', points: 20, joinedUsers: [] },
      { id: 'clean-rivers', name: 'Clean Rivers', description: 'Participate in river clean-up drives.', points: 25, joinedUsers: [] },
      { id: 'ewaste', name: 'E-waste Drive', description: 'Recycle electronics responsibly.', points: 25, joinedUsers: [] },
      { id: 'tree-plant', name: 'Tree Plantation', description: 'Plant and care for trees locally.', points: 30, joinedUsers: [] },
      { id: 'compost', name: 'Composting at Home', description: 'Start composting kitchen waste.', points: 20, joinedUsers: [] },
    ]);
  }
  if (!storage.get(KEYS.events)) {
    storage.set(KEYS.events, [
      { id: uid(), title: 'Beach Clean-Up', date: futureDate(3), place: 'Marine Drive' },
      { id: uid(), title: 'E-waste Collection Camp', date: futureDate(7), place: 'Community Hall' },
      { id: uid(), title: 'Park Plastic Audit', date: futureDate(14), place: 'Central Park' },
    ]);
  }
  if (!storage.get(KEYS.team)) {
    storage.set(KEYS.team, [
      { id: uid(), name: 'Aisha Khan', email: 'aisha@example.com', role: 'Volunteer' },
      { id: uid(), name: 'Ravi Patel', email: 'ravi@example.com', role: 'Volunteer' },
      { id: uid(), name: 'Meera Joshi', email: 'meera@example.com', role: 'Coordinator' },
      { id: uid(), name: 'Arun Singh', email: 'arun@example.com', role: 'Volunteer' },
    ]);
  }
  if (!storage.get(KEYS.tasks)) {
    storage.set(KEYS.tasks, [
      { id: uid(), title: 'Organize neighborhood clean-up', assigneeEmail: 'meera@example.com', assigneeName: 'Meera Joshi', progress: 60, status: 'In Progress', createdAt: Date.now() - 7200_000 },
    ]);
  }
  if (!storage.get(KEYS.tips)) {
    storage.set(KEYS.tips, [
      'Carry a reusable water bottle to reduce plastic waste.',
      'Compost your kitchen scraps to enrich the soil.',
      'Say no to single-use plastics like straws and cutlery.',
      'Repair and reuse items before buying new.',
      'Donate old clothes and electronics responsibly.',
      'Rinse recyclables to avoid contamination.',
      'Buy in bulk to reduce packaging waste.',
    ]);
  }
}

// Auth
function getUsers() { return storage.get(KEYS.users, []); }
function setUsers(users) { storage.set(KEYS.users, users); }
function getCurrentUser() {
  const email = storage.get(KEYS.currentUser, null);
  if (!email) return null;
  return getUsers().find((u) => u.email === email) || null;
}
function setCurrentUserByEmail(email) { storage.set(KEYS.currentUser, email); }
function logout() {
  localStorage.removeItem(KEYS.currentUser);
  location.href = '../pages/login.html';
}
function requireAuth(redirectBack = true) {
  const user = getCurrentUser();
  if (!user) {
    const back = redirectBack ? `?next=${encodeURIComponent(location.pathname)}` : '';
    location.href = `../pages/login.html${back}`;
    return null;
  }
  return user;
}

// Points
function addPoints(email, amount, reason = '') {
  if (!email || !Number.isFinite(amount)) return;
  const users = getUsers();
  const idx = users.findIndex((u) => u.email === email);
  if (idx >= 0) {
    users[idx].points = (users[idx].points || 0) + amount;
    setUsers(users);
  }
}

// Posts
function getPosts() { return storage.get(KEYS.posts, []).sort((a, b) => b.createdAt - a.createdAt); }
function setPosts(posts) { storage.set(KEYS.posts, posts); }

// Missions
function getMissions() { return storage.get(KEYS.missions, []); }
function setMissions(m) { storage.set(KEYS.missions, m); }

// Tasks and Team
function getTasks() { return storage.get(KEYS.tasks, []); }
function setTasks(t) { storage.set(KEYS.tasks, t); }
function getTeam() { return storage.get(KEYS.team, []); }
function setTeam(t) { storage.set(KEYS.team, t); }

// Leaderboard
function computeLeaderboard(limit = 10) {
  return getUsers()
    .slice()
    .sort((a, b) => (b.points || 0) - (a.points || 0))
    .slice(0, limit);
}

// Common UI
function initCommonUI() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const mobileBtn = document.getElementById('mobileMenuButton');
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  const authBtn = document.getElementById('authButton');
  const authBtnMobile = document.getElementById('authButtonMobile');
  const dashAuthBtn = document.getElementById('dashAuthBtn');
  const user = getCurrentUser();

  function wireAuthButton(el) {
    if (!el) return;
    if (user) {
      el.textContent = 'Logout';
      el.href = '#';
      el.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
      });
    } else {
      el.textContent = 'Login';
      el.href = '../pages/login.html';
    }
  }

  wireAuthButton(authBtn);
  wireAuthButton(authBtnMobile);
  wireAuthButton(dashAuthBtn);
}

// Export to window for use in other scripts
window.SWM = {
  storage, KEYS, uid, futureDate, shortName, formatDateTime,
  initDataSeeds, getUsers, setUsers, getCurrentUser, setCurrentUserByEmail, logout, requireAuth,
  addPoints, getPosts, setPosts, getMissions, setMissions, getTasks, setTasks, getTeam, setTeam,
  computeLeaderboard, initCommonUI
};