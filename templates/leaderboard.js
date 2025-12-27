// Sample user data
let allUsers = [
    {
        name: "Sarah Chen",
        username: "sarahc",
        repos: 45,
        stars: 1250,
        commits: 890,
        followers: 320,
        language: "javascript",
        domain: "web",
        streak: 12,
        projects: [
            { name: "React Dashboard", desc: "Modern admin panel", link: "https://github.com/sarahc/dashboard" },
            { name: "API Builder", desc: "REST API generator", link: "https://github.com/sarahc/api-builder" },
            { name: "CSS Framework", desc: "Lightweight CSS", link: "https://github.com/sarahc/css-fw" }
        ]
    },
    {
        name: "Alex Kumar",
        username: "alexk",
        repos: 38,
        stars: 980,
        commits: 1050,
        followers: 280,
        language: "python",
        domain: "ai",
        streak: 8,
        projects: [
            { name: "ML Predictor", desc: "Machine learning tool", link: "https://github.com/alexk/ml-pred" },
            { name: "Data Analyzer", desc: "Python analysis kit", link: "https://github.com/alexk/data-analyze" }
        ]
    },
    {
        name: "Mike Johnson",
        username: "mikej",
        repos: 52,
        stars: 750,
        commits: 720,
        followers: 195,
        language: "cpp",
        domain: "devops",
        streak: 15,
        projects: [
            { name: "Docker Manager", desc: "Container management", link: "https://github.com/mikej/docker-mgr" },
            { name: "CI/CD Pipeline", desc: "Auto deployment", link: "https://github.com/mikej/cicd" }
        ]
    },
    {
        name: "Emma Davis",
        username: "emmad",
        repos: 29,
        stars: 620,
        commits: 540,
        followers: 165,
        language: "javascript",
        domain: "mobile",
        streak: 5,
        projects: [
            { name: "Mobile App Kit", desc: "React Native starter", link: "https://github.com/emmad/mobile-kit" },
            { name: "Push Notifications", desc: "Notification service", link: "https://github.com/emmad/push-notif" }
        ]
    },
    {
        name: "Ryan Patel",
        username: "ryanp",
        repos: 41,
        stars: 890,
        commits: 380,
        followers: 210,
        language: "python",
        domain: "ai",
        streak: 9,
        projects: [
            { name: "Neural Net Lib", desc: "Simple neural network", link: "https://github.com/ryanp/neural" },
            { name: "Image Classifier", desc: "CNN classification", link: "https://github.com/ryanp/img-class" }
        ]
    },
    {
        name: "Lisa Wang",
        username: "lisaw",
        repos: 34,
        stars: 420,
        commits: 670,
        followers: 140,
        language: "java",
        domain: "web",
        streak: 7,
        projects: [
            { name: "Spring Boot API", desc: "RESTful service", link: "https://github.com/lisaw/spring-api" }
        ]
    },
    {
        name: "Tom Wilson",
        username: "tomw",
        repos: 27,
        stars: 580,
        commits: 445,
        followers: 125,
        language: "javascript",
        domain: "web",
        streak: 11,
        projects: [
            { name: "Vue Dashboard", desc: "Admin panel with Vue", link: "https://github.com/tomw/vue-dash" }
        ]
    },
    {
        name: "Nina Patel",
        username: "ninap",
        repos: 36,
        stars: 710,
        commits: 825,
        followers: 188,
        language: "python",
        domain: "ai",
        streak: 14,
        projects: [
            { name: "AI Chatbot", desc: "NLP chatbot", link: "https://github.com/ninap/ai-chat" }
        ]
    }
];

// Calculate score for each user
allUsers.forEach(user => {
    user.score = (user.repos * 10) + (user.stars) + (user.commits) + (user.followers * 2);
});

// Copy to filtered array
let filteredUsers = [...allUsers];

// Function to display all users in the table
function displayUsers(users) {
    const tbody = document.getElementById('leaderboard-body');
    tbody.innerHTML = '';
    
    users.forEach((user, index) => {
        // Create main row
        const row = document.createElement('tr');
        
        // Add medal for top 3
        let rankHTML = '';
        let rankClass = 'rank';
        if (index === 0) {
            rankHTML = '<span class="medal">🥇</span>';
            rankClass += ' gold';
        } else if (index === 1) {
            rankHTML = '<span class="medal">🥈</span>';
            rankClass += ' silver';
        } else if (index === 2) {
            rankHTML = '<span class="medal">🥉</span>';
            rankClass += ' bronze';
        }
        
        row.innerHTML = `
            <td>
                <div class="${rankClass}">
                    ${rankHTML}
                    #${index + 1}
                </div>
            </td>
            <td>
                <div class="user">
                    <div class="avatar">${user.name[0]}</div>
                    <div class="user-info">
                        <div class="username">${user.name}</div>
                        <div class="user-handle">@${user.username}</div>
                    </div>
                </div>
            </td>
            <td>${user.repos}</td>
            <td>${user.stars}</td>
            <td>${user.commits}</td>
            <td>${user.followers}</td>
            <td class="score">${user.score.toLocaleString()}</td>
            <td>
                <button class="expand-btn" onclick="toggleProjects(${index})">
                    View Projects
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
        
        // Create expandable project row
        const projectRow = document.createElement('tr');
        projectRow.className = 'project-row';
        projectRow.id = 'project-row-' + index;
        
        // Build projects HTML
        let projectsHTML = user.projects.map(project => `
            <div class="project-card">
                <div class="project-name">${project.name}</div>
                <div class="project-desc">${project.desc}</div>
                <a href="${project.link}" target="_blank" class="project-link">View on GitHub</a>
            </div>
        `).join('');
        
        projectRow.innerHTML = `
            <td colspan="8">
                <div class="projects-container">
                    <div class="projects-header">${user.name}'s Projects</div>
                    <div class="projects-list">
                        ${projectsHTML}
                    </div>
                </div>
            </td>
        `;
        
        tbody.appendChild(projectRow);
    });
}

// Function to toggle project details
function toggleProjects(index) {
    const projectRow = document.getElementById('project-row-' + index);
    
    if (projectRow.classList.contains('show')) {
        projectRow.classList.remove('show');
    } else {
        projectRow.classList.add('show');
    }
}

// Function to apply all filters and sorting
function applyFilters() {
    const sortValue = document.getElementById('sort-filter').value;
    const langValue = document.getElementById('language-filter').value;
    const domainValue = document.getElementById('domain-filter').value;
    
    // Start with all users
    filteredUsers = [...allUsers];
    
    // Filter by language
    if (langValue !== 'all') {
        filteredUsers = filteredUsers.filter(user => user.language === langValue);
    }
    
    // Filter by domain
    if (domainValue !== 'all') {
        filteredUsers = filteredUsers.filter(user => user.domain === domainValue);
    }
    
    // Sort the filtered users
    if (sortValue === 'stars') {
        filteredUsers.sort((a, b) => b.stars - a.stars);
    } else if (sortValue === 'commits') {
        filteredUsers.sort((a, b) => b.commits - a.commits);
    } else if (sortValue === 'repos') {
        filteredUsers.sort((a, b) => b.repos - a.repos);
    } else if (sortValue === 'followers') {
        filteredUsers.sort((a, b) => b.followers - a.followers);
    } else {
        // Default: sort by score
        filteredUsers.sort((a, b) => b.score - a.score);
    }
    
    // Display the filtered and sorted users
    displayUsers(filteredUsers);
}

// Function to reset all filters
function resetFilters() {
    document.getElementById('sort-filter').value = 'score';
    document.getElementById('language-filter').value = 'all';
    document.getElementById('domain-filter').value = 'all';
    filteredUsers = [...allUsers];
    filteredUsers.sort((a, b) => b.score - a.score);
    displayUsers(filteredUsers);
}

// Function to generate insights
function generateInsights() {
    const insightsGrid = document.getElementById('insights-grid');
    
    // Count which language is most popular
    const langCount = {};
    allUsers.forEach(user => {
        langCount[user.language] = (langCount[user.language] || 0) + 1;
    });
    const topLang = Object.keys(langCount).reduce((a, b) => 
        langCount[a] > langCount[b] ? a : b
    );
    
    // Count which domain is most popular
    const domainCount = {};
    allUsers.forEach(user => {
        domainCount[user.domain] = (domainCount[user.domain] || 0) + 1;
    });
    const topDomain = Object.keys(domainCount).reduce((a, b) => 
        domainCount[a] > domainCount[b] ? a : b
    );
    
    // Random activity increase
    const activityIncrease = Math.floor(Math.random() * 30) + 10;
    
    insightsGrid.innerHTML = `
        <div class="insight-card">
            <div class="insight-text">
                <p>Most contributors are working in <strong>${topLang.toUpperCase()}</strong></p>
            </div>
        </div>
        <div class="insight-card">
            <div class="insight-text">
                <p>Activity increased by <strong>${activityIncrease}%</strong> this week</p>
            </div>
        </div>
        <div class="insight-card">
            <div class="insight-text">
                <p><strong>${topDomain.toUpperCase()}</strong> projects are getting the most stars</p>
            </div>
        </div>
    `;
}

// Function to populate compare dropdowns
function populateCompareDropdowns() {
    const select1 = document.getElementById('compare-user1');
    const select2 = document.getElementById('compare-user2');
    
    allUsers.forEach(user => {
        const option1 = document.createElement('option');
        option1.value = user.username;
        option1.textContent = user.name;
        select1.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = user.username;
        option2.textContent = user.name;
        select2.appendChild(option2);
    });
}

// Function to compare two users
function compareUsers() {
    const user1Name = document.getElementById('compare-user1').value;
    const user2Name = document.getElementById('compare-user2').value;
    const resultsDiv = document.getElementById('compare-results');
    
    // Check if both users are selected
    if (!user1Name || !user2Name) {
        resultsDiv.innerHTML = '<p class="error-msg">Please select both users!</p>';
        return;
    }
    
    // Check if same user selected
    if (user1Name === user2Name) {
        resultsDiv.innerHTML = '<p class="error-msg">Please select different users!</p>';
        return;
    }
    
    // Find the users
    const user1 = allUsers.find(u => u.username === user1Name);
    const user2 = allUsers.find(u => u.username === user2Name);
    
    // Show comparison
    resultsDiv.innerHTML = `
        <div class="comparison-grid">
            <div class="compare-card">
                <h3>${user1.name}</h3>
                <div class="compare-stat">
                    <span>Commits:</span>
                    <strong>${user1.commits}</strong>
                </div>
                <div class="compare-stat">
                    <span>Stars:</span>
                    <strong>${user1.stars}</strong>
                </div>
                <div class="compare-stat">
                    <span>Repos:</span>
                    <strong>${user1.repos}</strong>
                </div>
                <div class="compare-stat">
                    <span>Followers:</span>
                    <strong>${user1.followers}</strong>
                </div>
                <div class="compare-stat">
                    <span>Score:</span>
                    <strong>${user1.score}</strong>
                </div>
            </div>
            
            <div class="vs-divider">VS</div>
            
            <div class="compare-card">
                <h3>${user2.name}</h3>
                <div class="compare-stat">
                    <span>Commits:</span>
                    <strong>${user2.commits}</strong>
                </div>
                <div class="compare-stat">
                    <span>Stars:</span>
                    <strong>${user2.stars}</strong>
                </div>
                <div class="compare-stat">
                    <span>Repos:</span>
                    <strong>${user2.repos}</strong>
                </div>
                <div class="compare-stat">
                    <span>Followers:</span>
                    <strong>${user2.followers}</strong>
                </div>
                <div class="compare-stat">
                    <span>Score:</span>
                    <strong>${user2.score}</strong>
                </div>
            </div>
        </div>
        
        <div class="winner-section">
            <h4>Winner: ${user1.score > user2.score ? user1.name : user2.name}</h4>
            <p>${user1.score > user2.score ? user1.name : user2.name} has a higher overall score!</p>
        </div>
    `;
}

// Add event listeners to filters
document.getElementById('sort-filter').addEventListener('change', applyFilters);
document.getElementById('language-filter').addEventListener('change', applyFilters);
document.getElementById('domain-filter').addEventListener('change', applyFilters);
document.getElementById('reset-filters').addEventListener('click', resetFilters);
document.getElementById('compare-btn').addEventListener('click', compareUsers);

// When page loads, show everything
window.onload = function() {
    displayUsers(allUsers);
    generateInsights();
    populateCompareDropdowns();
};