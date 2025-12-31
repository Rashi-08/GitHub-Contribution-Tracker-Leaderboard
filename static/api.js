// api.js
const API_BASE = 'https://githubtrackerdemo.onrender.com';

const api = {
  /**
   * Initiate GitHub OAuth login
   */
  async login() {
    try {
      const res = await fetch(`${API_BASE}/auth/login`);
      const data = await res.json();
      
      if (data.auth_url) {
        window.location.href = data.auth_url;
      } else {
        throw new Error('No auth URL received');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Failed to initiate login. Please try again.');
    }
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser(token) {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { 
        'Authorization': `Bearer ${token}` 
      }
    });
    
    if (!res.ok) {
      throw new Error('Authentication failed');
    }
    
    return res.json();
  },

  /**
   * Get user profile by username
   */
  async getProfile(username) {
    const res = await fetch(`${API_BASE}/profile/${username}`);
    
    if (!res.ok) {
      throw new Error('Failed to fetch profile');
    }
    
    return res.json();
  },

  async getContributions(username) {
    const res = await fetch(`${API_BASE}/contributions/${username}`);
    
    if (!res.ok) {
      throw new Error('Failed to fetch contributions');
    }
    
    return res.json();
  },

  /**
   * Get user projects by username
   */
  async getProjects(username) {
    const res = await fetch(`${API_BASE}/projects/${username}`);
    
    if (!res.ok) {
      throw new Error('Failed to fetch projects');
    }
    
    return res.json();
  },

  /**
   * Get leaderboard
   */
  async getLeaderboard() {
    const res = await fetch(`${API_BASE}/leaderboard/`);
    
    if (!res.ok) {
      throw new Error('Failed to fetch leaderboard');
    }
    
    return res.json();
  },

  /**
   * Logout user
   */
  async logout(token) {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      });
    } catch (error) {
      console.error('Logout request failed:', error);
      // Continue with local logout even if API call fails
    }
  }
};
