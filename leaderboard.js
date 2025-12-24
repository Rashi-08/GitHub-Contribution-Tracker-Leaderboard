const users = [
    { username: "octocat", repos: 12, followers: 240 },
    { username: "torvalds", repos: 6, followers: 180000 },
    { username: "gaearon", repos: 25, followers: 85000 },
    { username: "addyosmani", repos: 40, followers: 42000 },
    { username: "sindresorhus", repos: 120, followers: 72000 }
];

// score formula (easy to explain in review)
users.forEach(user => {
    user.score = user.repos * 10 + user.followers;
});

// sort by score
users.sort((a, b) => b.score - a.score);

const tbody = document.getElementById("leaderboard-body");

users.forEach((user, index) => {
    const row = document.createElement("tr");

    let rankClass = "rank";
    if (index === 0) rankClass += " gold";
    else if (index === 1) rankClass += " silver";
    else if (index === 2) rankClass += " bronze";

    row.innerHTML = `
        <td class="${rankClass}">#${index + 1}</td>
        <td>
            <div class="user">
                <div class="avatar">${user.username[0].toUpperCase()}</div>
                <div class="username">${user.username}</div>
            </div>
        </td>
        <td>${user.repos}</td>
        <td>${user.followers}</td>
        <td class="score">${user.score}</td>
    `;

    tbody.appendChild(row);
});

