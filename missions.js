document.addEventListener('DOMContentLoaded', () => {
  SWM.initCommonUI();
  initMissionsPage();
});

function initMissionsPage() {
  const user = SWM.requireAuth();
  if (!user) return;

  const missionsGrid = document.getElementById('missionsGrid');
  const eventsList = document.getElementById('eventsList');

  function renderMissions() {
    const missions = SWM.getMissions();
    if (!missionsGrid) return;
    missionsGrid.innerHTML = missions
      .map(
        (mission) => {
          const joined = user.joinedMissions?.includes(mission.id);
          return `
            <div class="rounded-lg border border-emerald-100 p-4 bg-white shadow-sm">
              <h3 class="font-semibold text-forest">${mission.name}</h3>
              <p class="text-sm text-slate-600 mb-2">${mission.description}</p>
              <button class="btn-primary w-full" data-id="${mission.id}" ${joined ? 'disabled' : ''}>
                ${joined ? 'Joined' : 'Join Mission (+${mission.points} pts)'}
              </button>
            </div>
          `;
        }
      )
      .join('');
  }

  function renderEvents() {
    const events = SWM.storage.get(SWM.KEYS.events, []);
    if (!eventsList) return;
    if (events.length === 0) {
      eventsList.innerHTML = '<li>No upcoming events.</li>';
      return;
    }
    eventsList.innerHTML = events
      .map(
        (event) => `
        <li class="border border-emerald-100 rounded p-3 bg-white shadow-sm">
          <strong>${event.title}</strong><br />
          <span class="text-sm text-slate-600">${event.date} - ${event.place}</span>
        </li>
      `
      )
      .join('');
  }

  function joinMission(missionId) {
    if (!missionId) return;
    if (user.joinedMissions?.includes(missionId)) return;

    // Update user's joined missions
    user.joinedMissions = user.joinedMissions || [];
    user.joinedMissions.push(missionId);

    // Update user points
    const missions = SWM.getMissions();
    const mission = missions.find((m) => m.id === missionId);
    if (mission) {
      user.points = (user.points || 0) + mission.points;
    }

    // Save updated user data
    const users = SWM.getUsers();
    const idx = users.findIndex((u) => u.email === user.email);
    if (idx >= 0) {
      users[idx] = user;
      SWM.setUsers(users);
      SWM.setCurrentUserByEmail(user.email);
    }

    renderMissions();
  }

  missionsGrid?.addEventListener('click', (e) => {
    const target = e.target;
    if (target.tagName === 'BUTTON' && target.dataset.id) {
      joinMission(target.dataset.id);
    }
  });

  renderMissions();
  renderEvents();
}

// Export for testing or future use
window.initMissionsPage = initMissionsPage;
