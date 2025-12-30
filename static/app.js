// app.js

// Application state
const state = {
  token: null,
  user: null,
  currentView: 'home'
};

// DOM Elements
const elements = {
  loginModal: document.getElementById('loginModal'),
  dashboard: document.getElementById('dashboard'),
  loginBtn: document.getElementById('loginBtn'),
  logoutBtn: document.getElementById('logoutBtn'),
  
  // Profile elements
  profileAvatar: document.getElementById('profileAvatar'),
  profileName: document.getElementById('profileName'),
  profileUsername: document.getElementById('profileUsername'),
  profileBio: document.getElementById('profileBio'),
  profileLocation: document.getElementById('profileLocation'),
  profileCompany: document.getElementById('profileCompany'),
  githubLink: document.getElementById('githubLink'),
  
  // Stats
  statFollowers: document.getElementById('statFollowers'),
  statRepos: document.getElementById('statRepos'),
  statStars: document.getElementById('statStars'),
  
  // Cards
  topProjects: document.getElementById('topProjects'),
  languages: document.getElementById('languages'),
  leaderboardRank: document.getElementById('leaderboardRank'),
  projectCount: document.getElementById('projectCount'),
  
  // Navigation
  navBtns: document.querySelectorAll('.nav-btn[data-view]')
};

/**
 * Initialize application
 */
async function init() {
  console.log('🚀 Initializing app...');
  
  // Check for OAuth callback token in URL
  const urlParams = new URLSearchParams(window.location.search);
  const urlToken = urlParams.get('token');

  if (urlToken) {
    console.log('✅ Token found in URL');
    state.token = urlToken;
    localStorage.setItem('auth_token', urlToken);
    
    // Clean URL without reloading
    window.history.replaceState({}, document.title, '/');
  } else {
    // Check localStorage for existing token
    state.token = localStorage.getItem('auth_token');
  }

  // Verify authentication
  if (state.token) {
    try {
      console.log('🔐 Verifying token...');
      const userData = await api.getCurrentUser(state.token);
      
      if (userData.is_logged) {
        console.log('✅ User authenticated:', userData.username);
        state.user = userData;
        showDashboard();
        await loadUserData();
      } else {
        console.log('❌ User not logged in');
        clearAuth();
        showLoginModal();
      }
    } catch (error) {
      console.error('❌ Auth verification failed:', error);
      clearAuth();
      showLoginModal();
    }
  } else {
    console.log('ℹ️ No token found, showing login');
    showLoginModal();
  }
}

/**
 * Show login modal
 */
function showLoginModal() {
  elements.loginModal.classList.remove('hidden');
  elements.dashboard.classList.add('hidden');
}

/**
 * Show dashboard
 */
function showDashboard() {
  elements.loginModal.classList.add('hidden');
  elements.dashboard.classList.remove('hidden');
}

/**
 * Clear authentication data
 */
function clearAuth() {
  state.token = null;
  state.user = null;
  localStorage.removeItem('auth_token');
}

/**
 * Load and display user data
 */
/**
 * Load and render contribution heatmap
 */
async function loadContributionChart(username) {
  const chartContainer = document.getElementById('mainChart');
  
  try {
    console.log('📊 Loading contributions for', username);
    const data = await api.getContributions(username);
    
    renderHeatmap(chartContainer, data.contributions, data.total_contributions);
  } catch (error) {
    console.error('Failed to load contributions:', error);
    chartContainer.innerHTML = '<div class="loading-state">Failed to load contribution data</div>';
  }
}

/**
 * Render contribution heatmap
 */
function renderHeatmap(container, contributions, totalContributions) {
  // Group contributions by week
  const weeks = [];
  let currentWeek = [];
  
  contributions.forEach((day, index) => {
    const date = new Date(day.date);
    const dayOfWeek = date.getDay();
    
    // Start new week on Sunday (0)
    if (dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    
    currentWeek.push(day);
    
    // Push last week
    if (index === contributions.length - 1 && currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
  });
  
  // Generate month labels (only show when month changes)
  const monthLabels = [];
  let lastMonth = -1;
  
  weeks.forEach((week) => {
    if (week.length > 0) {
      const firstDay = new Date(week[0].date);
      const month = firstDay.getMonth();
      
      if (month !== lastMonth) {
        monthLabels.push(firstDay.toLocaleDateString('en-US', { month: 'short' }));
        lastMonth = month;
      }
    }
  });
  
  const heatmapHTML = `
    <div class="contribution-graph">
      <div class="graph-header">
        <span class="total-contributions">
          <strong>${totalContributions.toLocaleString()}</strong> contributions in the last year
        </span>
      </div>
      <div class="months-labels">
        ${monthLabels.map(month => `<span>${month}</span>`).join('')}
      </div>
      <div class="graph-container">
        <div class="days-labels">
          <span></span>
          <span>Mon</span>
          <span></span>
          <span>Wed</span>
          <span></span>
          <span>Fri</span>
          <span></span>
        </div>
        <div class="contribution-grid">
          ${weeks.map(week => generateWeekColumn(week)).join('')}
        </div>
      </div>
    </div>
  `;
  
  container.innerHTML = heatmapHTML;
  addTooltips();
}


/**
 * Generate a week column
 */
function generateWeekColumn(week) {
  let html = '<div class="week-column">';
  
  // Pad beginning of week if needed
  const firstDay = new Date(week[0].date).getDay();
  for (let i = 0; i < firstDay; i++) {
    html += '<div class="contribution-day empty"></div>';
  }
  
  week.forEach(day => {
    const date = new Date(day.date);
    const formattedDate = date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    
    html += `
      <div 
        class="contribution-day level-${day.level}" 
        data-date="${day.date}"
        data-count="${day.count}"
        data-tooltip="${day.count} contribution${day.count !== 1 ? 's' : ''} on ${formattedDate}"
      ></div>
    `;
  });
  
  html += '</div>';
  return html;
}

/**
 * Add tooltip interactions
 */
function addTooltips() {
  const days = document.querySelectorAll('.contribution-day:not(.empty)');
  
  days.forEach(day => {
    day.addEventListener('mouseenter', (e) => {
      const tooltip = document.createElement('div');
      tooltip.className = 'contribution-tooltip';
      tooltip.textContent = e.target.dataset.tooltip;
      document.body.appendChild(tooltip);
      
      const rect = e.target.getBoundingClientRect();
      tooltip.style.left = `${rect.left + rect.width / 2}px`;
      tooltip.style.top = `${rect.top - 10}px`;
    });
    
    day.addEventListener('mouseleave', () => {
      const tooltip = document.querySelector('.contribution-tooltip');
      if (tooltip) tooltip.remove();
    });
  });
}

// Call this in loadUserData()
async function loadUserData() {
  if (!state.user) return;

  const { username, profile, projects } = state.user;

  updateProfile(profile, username);
  updateStats(profile, projects);
  await loadProjects(projects);
  await loadLanguages(projects);
  await loadLeaderboardRank(username);
  
  // Load contribution chart
  await loadContributionChart(username);  // ADD THIS LINE
}

/**
 * Update profile card
 */
// Update profile card
function updateProfile(profile, username) {
  // Avatar with localStorage caching
  if (profile.avatar_url) {
    elements.profileAvatar.style.backgroundImage = `url(${profile.avatar_url})`;
    elements.profileAvatar.style.backgroundSize = 'cover';
    elements.profileAvatar.style.backgroundPosition = 'center';
    elements.profileAvatar.innerHTML = ''; // Remove placeholder
    
    // Save to localStorage for reuse on profile page
    localStorage.setItem('user_avatar', profile.avatar_url);
  }
  
  // Name and username
  elements.profileName.textContent = profile.name || username;
  elements.profileUsername.textContent = `@${username}`;
  
  // Bio
  elements.profileBio.textContent = profile.bio || 'No bio available';
  
  // Location
  if (profile.location) {
    elements.profileLocation.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
      ${profile.location}
    `;
  }
  
  // Company
  if (profile.company) {
    elements.profileCompany.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
      ${profile.company}
    `;
  }
  
  // GitHub link
  elements.githubLink.href = profile.html_url || `https://github.com/${username}`;
}


/**
 * Update stats grid
 */
function updateStats(profile, projects) {
  elements.statFollowers.textContent = profile.followers || 0;
  elements.statRepos.textContent = profile.public_repos || 0;
  elements.statStars.textContent = projects.total_stars || 0;
}

/**
 * Load and display top projects
 */
async function loadProjects(projects) {
  const topProjects = projects.top_projects || [];
  
  elements.projectCount.textContent = projects.total_projects || 0;
  
  if (topProjects.length === 0) {
    elements.topProjects.innerHTML = '<div class="loading-state">No projects found</div>';
    return;
  }
  
  elements.topProjects.innerHTML = topProjects.slice(0, 5).map(project => `
    <div class="project-item">
      <span>${project.name}</span>
      <span class="stars">⭐ ${project.stars}</span>
    </div>
  `).join('');
}

/**
 * Load and display languages
 */
async function loadLanguages(projects) {
  const topProjects = projects.top_projects || [];
  
  // Count languages
  const languageCounts = {};
  topProjects.forEach(project => {
    const lang = project.language || 'Unknown';
    languageCounts[lang] = (languageCounts[lang] || 0) + 1;
  });
  
  // Sort by count
  const sortedLanguages = Object.entries(languageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  if (sortedLanguages.length === 0) {
    elements.languages.innerHTML = '<div class="loading-state">No languages found</div>';
    return;
  }
  
  elements.languages.innerHTML = sortedLanguages.map(([lang, count]) => `
    <div class="project-item">
      <span>${lang}</span>
      <span class="stars">${count} ${count === 1 ? 'repo' : 'repos'}</span>
    </div>
  `).join('');
}

/**
 * Load leaderboard rank
 */
async function loadLeaderboardRank(username) {
  try {
    const { leaderboard } = await api.getLeaderboard();
    
    const userIndex = leaderboard.findIndex(user => user.username === username);
    
    if (userIndex === -1) {
      elements.leaderboardRank.innerHTML = '<div class="loading-state">Not ranked yet</div>';
      return;
    }
    
    const rank = userIndex + 1;
    const userScore = leaderboard[userIndex].score;
    
    elements.leaderboardRank.innerHTML = `
      <div style="text-align: center; padding: 40px 20px;">
        <div style="font-size: 48px; font-weight: 700; color: var(--accent-purple); margin-bottom: 8px;">
          #${rank}
        </div>
        <div style="font-size: 14px; color: var(--text-muted); margin-bottom: 16px;">
          out of ${leaderboard.length} users
        </div>
        <div style="font-size: 20px; font-weight: 600; color: var(--text-primary);">
          ${userScore.toFixed(0)} points
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Failed to load leaderboard:', error);
    elements.leaderboardRank.innerHTML = '<div class="loading-state">Failed to load rank</div>';
  }
}

/**
 * Handle logout
 */
async function handleLogout() {
  if (!confirm('Are you sure you want to logout?')) {
    return;
  }
  
  console.log('🚪 Logging out...');
  
  if (state.token) {
    await api.logout(state.token);
  }
  
  clearAuth();
  showLoginModal();
  
  console.log('✅ Logged out successfully');
}

/**
 * Handle navigation
 */
function handleNavigation(view) {
  state.currentView = view;
  
  // Update active nav button
  elements.navBtns.forEach(btn => {
    if (btn.dataset.view === view) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // TODO: Implement view switching logic here
  console.log('📍 Navigated to:', view);
}

// Event Listeners
elements.loginBtn.addEventListener('click', () => {
  console.log('🔑 Login button clicked');
  api.login();
});

elements.logoutBtn.addEventListener('click', handleLogout);

elements.navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    handleNavigation(btn.dataset.view);
  });
});

// Initialize app on page load
document.addEventListener('DOMContentLoaded', init);

console.log('📦 App loaded');
