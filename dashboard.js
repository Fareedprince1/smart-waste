document.addEventListener('DOMContentLoaded', () => {
  SWM.initCommonUI();
  initDashboardPage();
});

function initDashboardPage() {
  const user = SWM.requireAuth();
  if (!user) return;

  const welcomeTitle = document.getElementById('welcomeTitle');
  const userRoleBadge = document.getElementById('userRoleBadge');
  const userPoints = document.getElementById('userPoints');
  const joinedMissionsCount = document.getElementById('joinedMissionsCount');
  const userPostsCount = document.getElementById('userPostsCount');
  const ecoTip = document.getElementById('ecoTip');
  const quickActionsGrid = document.getElementById('quickActionsGrid');

  welcomeTitle.textContent = `Welcome, ${SWM.shortName(user)}!`;
  if (userRoleBadge) {
    userRoleBadge.textContent = user.role;
    userRoleBadge.classList.remove('hidden');
  }

  // Refresh user data from storage to get updated points and joined missions
  const users = SWM.getUsers();
  const refreshedUser = users.find((u) => u.email === user.email) || user;

  userPoints.textContent = refreshedUser.points || 0;

  const posts = SWM.getPosts().filter((p) => p.authorEmail === user.email);
  userPostsCount.textContent = String(posts.length);

  joinedMissionsCount.textContent = String(refreshedUser.joinedMissions?.length || 0);

  const tips = SWM.storage.get(SWM.KEYS.tips, []);
  ecoTip.textContent = tips[Math.floor(Math.random() * tips.length)] || 'Reduce, reuse, recycle.';

  renderLeaderboard(document.getElementById('leaderboardList'));
  renderQuickActions(refreshedUser.role);

  function renderQuickActions(role) {
    if (!quickActionsGrid) return;

    const dashAuthBtn = document.getElementById('dashAuthBtn');
    let dynamicHtml = '';

    if (role === 'Community Leader' || role === 'Organization') {
      dynamicHtml += `
        <a href="leadership.html" class="btn-primary text-center">Manage Tasks</a>
      `;
    }
    // Add more role-specific actions here if needed

    // Insert dynamic HTML before the login/logout button
    if (dashAuthBtn) {
      dashAuthBtn.insertAdjacentHTML('beforebegin', dynamicHtml);
    } else {
      quickActionsGrid.innerHTML += dynamicHtml;
    }
  }
}

function renderLeaderboard(listEl) {
  if (!listEl) return;
  const me = SWM.getCurrentUser();
  const leaders = SWM.computeLeaderboard(5);
  listEl.innerHTML = leaders
    .map(
      (u, i) => `
    <li class="flex items-center justify-between rounded-lg border border-emerald-100 px-3 py-2 ${me && me.email === u.email ? 'bg-emerald-50' : 'bg-white'}">
      <span class="flex items-center gap-2">
        <span class="w-6 text-slate-500">#${i + 1}</span>
        <span class="font-medium">${SWM.shortName(u)}</span>
      </span>
      <span class="text-eco font-semibold">${u.points || 0} pts</span>
    </li>`
    )
    .join('');
}
