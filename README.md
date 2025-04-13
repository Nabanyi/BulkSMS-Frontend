# Bulk SMS Frontend with React and TypeScript

## Overview
This is a React TypeScript project that serves as the frontend for a Bulk SMS application. It seamlessly connects with the Spring Boot backend API to enable users to manage contacts, create and delete campaigns, and utilize refresh tokens for secure authentication. The project is designed to be reusable, meaning developers can integrate it into their own projects with ease.

## Features
- **Contact Management**: Add, update, and delete contacts.
- **Campaigns**: Create and delete SMS campaigns.
- **Authentication**: Secure user login with support for token refresh.
- **Backend Integration**: Fully integrates with the Spring Boot API for handling data and operations.

## Technologies Used
- **Frontend Framework**: React
- **Language**: TypeScript
- **State Management**: React Context API
- **Styling**: CSS
- **API Communication**: Fetch API for HTTP requests
- **Authentication**: JWT-based authentication and refresh tokens

## Prerequisites
Before running this project, ensure you have:
- Node.js installed
- The Spring Boot backend API running
- API credentials if applicable (e.g., for authentication)

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Nabanyi/BulkSMS-Frontend.git
   ```

2. Navigate to the project directory:
   ```bash
   cd BulkSMS-Frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Configure the environment:
   Create an `.env` file in the root directory and add the following:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:8081/api  # Backend API base URL
   REACT_APP_AUTH_TOKEN_KEY=auth-token               # Authentication token key
   ```

5. Start the development server:
   ```bash
   npm start
   ```

6. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## Project Structure
The project follows a standard React folder structure:

```
src/
│
├── components/       # Reusable UI components
├── pages/            # Application views (e.g., Login, Dashboard)
├── services/         # API integration logic
├── context/          # React Context for state management (if applicable)
├── styles/           # Global and component-specific styles
└── utils/            # Helper functions and utilities
```

## How to Use
- **Manage Contacts**: Navigate to the "Contacts" section to add, update, or delete contacts.
- **Create Campaigns**: Go to the "Campaigns" section to create or delete SMS campaigns.
- **Authenticate**: Log in to access the dashboard. The app automatically handles token refresh for active sessions.


## Contributing
If you'd like to improve this project, feel free to fork the repository, make your changes, and submit a pull request. Contributions are always welcome!

## License
This project is licensed under the [MIT License](LICENSE).

## Notes for Developers
- This frontend is reusable. You can integrate it into your own projects by cloning the repository and updating configurations for your specific use case.
- Ensure that the backend API is set up and running for full functionality.

## Contact
For questions or support, you can reach out via:
- GitHub: [@Nabanyi](https://github.com/Nabanyi)

---

Feel free to adapt this template to include any additional features or information! Let me know if you’d like further customization.