document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('github-form');
    const searchInput = document.getElementById('search');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');
    
    const BASE_URL = 'https://api.github.com';
    const USER_SEARCH_ENDPOINT = '/search/users';
    const USER_REPOS_ENDPOINT = '/users/';
    
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const searchTerm = searchInput.value.trim();
      if (searchTerm === '') {
        alert('Please enter a GitHub username');
        return;
      }
      try {
        const users = await searchUsers(searchTerm);
        displayUsers(users);
      } catch (error) {
        console.error('Error searching users:', error);
      }
    });
    
    async function searchUsers(username) {
      const response = await fetch(`${BASE_URL}${USER_SEARCH_ENDPOINT}?q=${username}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data.items; // Return array of users
    }
    
    function displayUsers(users) {
      userList.innerHTML = '';
      users.forEach(user => {
        const userItem = document.createElement('li');
        userItem.innerHTML = `
          <img src="${user.avatar_url}" alt="${user.login}" class="avatar">
          <span>${user.login}</span>
        `;
        userItem.addEventListener('click', async () => {
          try {
            const repos = await getUserRepos(user.login);
            displayRepos(repos);
          } catch (error) {
            console.error('Error fetching user repos:', error);
          }
        });
        userList.appendChild(userItem);
      });
    }
    
    async function getUserRepos(username) {
      const response = await fetch(`${BASE_URL}${USER_REPOS_ENDPOINT}${username}/repos`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data; // Return array of repositories
    }
    
    function displayRepos(repos) {
      reposList.innerHTML = '';
      repos.forEach(repo => {
        const repoItem = document.createElement('li');
        repoItem.innerHTML = `
          <a href="${repo.html_url}" target="_blank">${repo.name}</a>
          <span>Stars: ${repo.stargazers_count}</span>
          <span>Language: ${repo.language}</span>
        `;
        reposList.appendChild(repoItem);
      });
    }
  });
  