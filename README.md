**GitHub Contribution Tracker**

GitHub Contribution Tracker is a web-based platform designed to track GitHub user activity, showcase projects, and generate a leaderboard based on contributions.
The system provides a complete user interface along with a backend architecture that supports authentication, profile management, project listing, and leaderboard generation.
The project is structured to allow future scalability and backend enhancements.

**Overview**  
The platform is divided into the following functional modules:

1) Authentication Module  
Handles GitHub OAuth-based authentication, allowing users to log in securely using their GitHub accounts.

2) User Profile Module  
Displays individual user profiles including GitHub username, contribution data, associated tags/domains, and listed projects.

3) Projects Module  
Used to showcase repositories or projects associated with a user. This module retrieves and displays project-related information in an organized manner.

4) Leaderboard Module  
Ranks users based on contribution metrics and displays them in a leaderboard format for comparison and analysis.

**Technology Stack**  
Frontend:    
HTML   
CSS  
JavaScript  

Backend:  
FastAPI

Database:  
Relational database structure  
Core entities include Users, Projects, and Tags  
Many-to-many relationship between Users and Tags  

Authentication:    
GitHub OAuth 2.0 integration  


**Current Features**  
Complete frontend UI for all core pages (Home, Leaderboard, Profile, Projects)  
GitHub OAuth-based login flow  
User profile display with contribution data   
Project listing for each user  
FastAPI-based REST endpoints available for backend services  


**System Architecture**  
The FastAPI backend exposes REST APIs for authentication, user data, projects, and leaderboard data.  
The frontend is designed to be compatible with API-based data fetching, allowing future migration to a fully decoupled architecture.  


**Deployment Status**  
Frontend UI is fully implemented and functional.  
FastAPI backend APIs are implemented and deployed, available through API documentation endpoints.  

**Recommended Future Enhancements**  

1) Full FastAPI Integration:  
Connect existing frontend pages to FastAPI endpoints using client-side API calls.  

2) Enhanced Database Management:  
Optimize queries and indexing for leaderboard computation.  
Add caching mechanisms for performance improvement.  

3) Role-Based Access Control:  
Introduce different access levels for users and administrators.  

4) Analytics and Insights:  
Contribution trends, activity graphs, and comparative analysis.  

5) UI Improvements:  
Responsive design enhancements.Improved accessibility and usability.  

**Contribution Guidelines:**  
Fork the repository  
Create a new feature branch  
Commit changes with meaningful commit messages  
Push the branch and create a pull request  
Ensure code stability before requesting merges into the main branch  

**License**  
No license has been added yet.

**Contact:**  
For issues, feature requests, or collaboration, please open an issue in the repository or contact the project maintainers.

